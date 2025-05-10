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

    private async getDynamicColumns() {
    try {
      // Get columns for all three tables
      const [statusColumns, logColumns, workerColumns] = await Promise.all([
        this.getTableColumns('process_status'),
        this.getTableColumns('process_log', ['lead_id', 'prop_id', 'loan_id', 'lan']),
        this.getTableColumns('process_worker', ['lead_id', 'prop_id', 'loan_id', 'lan'])
      ]);

      // Build dynamic select clauses
      const statusSelect = statusColumns.map(c => `s.${c} AS status_${c}`).join(',\n  ');
      const logSelect = logColumns.map(c => `l.${c} AS log_${c}`).join(',\n  ');
      const workerSelect = workerColumns.map(c => `w.${c} AS worker_${c}`).join(',\n  ');

      return { statusSelect, logSelect, workerSelect };
    } catch (error: any) {
      throw new Error(`Failed to get dynamic columns: ${error.message}`);
    }
  }

  private async getTableColumns(tableName: string, exclude: string[] = []) {
    const sql = `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        ${exclude.length ? `AND COLUMN_NAME NOT IN (${exclude.map(() => '?').join(',')})` : ''}
    `;

    const result = await executeQuery<{ COLUMN_NAME: string }[]>(
      sql, 
      [tableName, ...exclude]
    );

    return result.map(row => row.COLUMN_NAME);
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
      const { statusSelect, logSelect, workerSelect } = await this.getDynamicColumns();

      const sql = `
        SELECT
          ${statusSelect},
          ${logSelect},
          ${workerSelect}
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
        LIMIT 1
      `;

      const result = await executeQuery<any[]>(sql, [leadId, propId, lan]);

      if (result.length > 0) {
        return this.success(result[0]);
      }

      return this.failure('No records found');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getProcessLogByCols({
    cols,
    leadId = '',
    propId = '',
    lan = ''
  }: {
    cols: string[],
    leadId?: string,
    propId?: string,
    lan?: string,
  }) {
    try {
      var all = '';
      cols.forEach(element => {
        var n = element.replaceAll('_process', '')

        all += `s.${element} AS status_${n},`
        all += `l.${element} AS log_${n},`
        all += `w.${element} AS worker_${n},`
      });

      all = all.substring(0, all.length - 1)

      var sql = `
          SELECT
          s.id AS status_id,
          s.lead_id,
          s.prop_id,
          s.loan_id,
          s.lan,

          ${all}

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
            LIMIT 1
      `;
      const result = await executeQuery<any[]>(sql, [leadId, propId, lan])

      if (result.length > 0) {
        return this.success(result[0])
      }

      return this.failure('Request Failed!')
    } catch (error) {
      return this.handleError(error)
    }
  }
}