import { QueryBuilder, executeQuery, withTransaction } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise";
import { getSession } from "../session";

export class ProcessRepository extends RepositoryBase {
  constructor() {
    super();
  }

  // Helper function to add identifier conditions to multiple QueryBuilders and update content.
  private addIdentifierCondition(
    queryBuilders: QueryBuilder[],
    updateContent: any,
    fieldName: string,
    identifierValue?: string
  ) {
    if (identifierValue) {
      queryBuilders.forEach((qb) => qb.orWhere(`${fieldName} = ?`, identifierValue));
      updateContent[fieldName] = identifierValue;
    }
  }

  private async updateProcessWithTransaction({
    processName,
    processValue,
    leadId,
    propId,
    loanId,
    lan,
    transactionConnection,
  }: {
    processName: string;
    processValue: number;
    leadId?: string;
    propId?: string;
    loanId?: string;
    lan?: string;
    transactionConnection: mysql.Connection;
  }) {
    try {
      // Validate that at least one identifier is provided.
      if (!leadId && !propId && !loanId && !lan) {
        throw new Error("At least one identifier is required!");
      }

      let updateContent: any = {};

      const queryStatus = new QueryBuilder("process_status").setConnection(transactionConnection);
      const queryLog = new QueryBuilder("process_log").setConnection(transactionConnection);
      const queryWorker = new QueryBuilder("process_worker").setConnection(transactionConnection);

      // Use helper function to add conditions.
      const queryBuilders = [queryStatus, queryLog, queryWorker];
      this.addIdentifierCondition(queryBuilders, updateContent, "lead_id", leadId);
      this.addIdentifierCondition(queryBuilders, updateContent, "prop_id", propId);
      this.addIdentifierCondition(queryBuilders, updateContent, "loan_id", loanId);
      this.addIdentifierCondition(queryBuilders, updateContent, "lan", lan);

      const statusUpdate = await queryStatus.update({
        [processName]: processValue,
        ...updateContent,
      });

      const logUpdate = await queryLog.update({
        [processName]: new Date(),
        ...updateContent,
      });

      const session = await getSession();
      const workerUpdate = await queryWorker.update({
        [processName]: session.user_id,
        ...updateContent,
      });

      if (statusUpdate > 0 && logUpdate > 0 && workerUpdate > 0) {
        return this.success("Process Updated");
      } else {
        let reason = "";
        if (statusUpdate <= 0) {
          reason += "Status update not processed! ";
        }
        if (logUpdate <= 0) {
          reason += "Log update not processed! ";
        }
        if (workerUpdate <= 0) {
          reason += "Worker update not processed! ";
        }
        throw new Error(`${processName} update failed! ${reason}`);
      }
    } catch (error) {
      throw error;
    }
  }

  private async initializeProcessWithTransaction(
    leadId: string,
    transactionConnection: mysql.Connection
  ) {
    try {
      await new QueryBuilder("process_status")
        .setConnection(transactionConnection)
        .insert({
          lead_id: leadId,
          lead_process: 1,
        });

      await new QueryBuilder("process_log")
        .setConnection(transactionConnection)
        .insert({
          lead_id: leadId,
          lead_process: new Date(),
        });

      const session = await getSession();
      await new QueryBuilder("process_worker")
        .setConnection(transactionConnection)
        .insert({
          lead_id: leadId,
          lead_process: session.user_id,
        });

      return this.success("Process Initialized!");
    } catch (error) {
      return this.handleError(error);
    }
  }

  async initializeProcess({
    leadId,
    transactionConnection,
  }: {
    leadId: string;
    transactionConnection?: mysql.Connection;
  }) {
    try {
      if (transactionConnection) {
        return this.initializeProcessWithTransaction(leadId, transactionConnection);
      } else {
        return withTransaction(async (connection) => {
          return this.initializeProcessWithTransaction(leadId, connection);
        });
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateProcess({
    processName,
    processValue,
    leadId,
    propId,
    loanId,
    lan,
    transactionConnection,
  }: {
    processName: string;
    processValue: number;
    leadId?: string;
    propId?: string;
    loanId?: string;
    lan?: string;
    transactionConnection?: mysql.Connection;
  }) {
    try {
      if (transactionConnection) {
        return this.updateProcessWithTransaction({
          processName,
          processValue,
          leadId,
          propId,
          loanId,
          lan,
          transactionConnection,
        });
      } else {
        return withTransaction(async (connection) => {
          return this.updateProcessWithTransaction({
            processName,
            processValue,
            leadId,
            propId,
            loanId,
            lan,
            transactionConnection: connection,
          });
        });
      }
    } catch (error) {
      return this.handleError(error);
    }
  }
}