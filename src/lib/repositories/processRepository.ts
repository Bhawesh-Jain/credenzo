import { QueryBuilder, executeQuery, withTransaction } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise";
import { getSession } from "../session";

export class ProcessRepository extends RepositoryBase {
  constructor() {
    super();
  }

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

  async getProcessLog({
    leadId = '',
    propId = '',
    lan = ''
  }: {
    leadId?: string,
    propId?: string,
    lan?: string,
  }) {
    try {
      var sql = `
              SELECT
              s.id AS status_id,
              s.lead_id,
              s.prop_id,
              s.loan_id,
              s.lan,
              s.last_updated AS status_last_updated,
              l.last_updated AS log_last_updated,
              w.last_updated AS worker_last_updated,
              -- Process steps with aliases to differentiate sources
              s.lead_process AS status_lead,
              l.lead_process AS log_lead,
              w.lead_process AS worker_lead,
              s.proposal_process AS status_proposal,
              l.proposal_process AS log_proposal,
              w.proposal_process AS worker_proposal,
              s.kyc_process AS status_kyc,
              l.kyc_process AS log_kyc,
              w.kyc_process AS worker_kyc,
              s.imd_process AS status_imd,
              l.imd_process AS log_imd,
              w.imd_process AS worker_imd,
              s.sales_process AS status_sales,
              l.sales_process AS log_sales,
              w.sales_process AS worker_sales,
              s.approval_process AS status_approval,
              l.approval_process AS log_approval,
              w.approval_process AS worker_approval,
              s.fi_process AS status_fi,
              l.fi_process AS log_fi,
              w.fi_process AS worker_fi,
              s.legal_process AS status_legal,
              l.legal_process AS log_legal,
              w.legal_process AS worker_legal,
              s.technical_process AS status_technical,
              l.technical_process AS log_technical,
              w.technical_process AS worker_technical,
              s.disbursement_process AS status_disbursement,
              l.disbursement_process AS log_disbursement,
              w.disbursement_process AS worker_disbursement
            FROM process_status s
            LEFT JOIN process_log l 
              ON s.lead_id = l.lead_id 
              AND s.prop_id = l.prop_id 
              AND s.loan_id = l.loan_id 
              AND s.lan = l.lan
            LEFT JOIN process_worker w 
              ON s.lead_id = w.lead_id 
              AND s.prop_id = w.prop_id 
              AND s.loan_id = w.loan_id 
              AND s.lan = w.lan
            WHERE s.lead_id = ?
              OR s.prop_id = ?
              OR s.lan = ?
      `
      const result = await executeQuery<any[]>(sql, [leadId, propId, lan])

      if (result.length > 0) {
        return this.success('Logs Found!')
      }

      return this.failure('Request Failed!')
    } catch (error) {
      return this.handleError(error)
    }
  }
}