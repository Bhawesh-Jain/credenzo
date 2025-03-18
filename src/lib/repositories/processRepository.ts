import { QueryBuilder, executeQuery, withTransaction } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"
import { EditLeadFormValues } from "@/app/dashboard/customer-boarding/leads/blocks/EditLead";

export class ProcessRepository extends RepositoryBase {

  constructor() {
    super()
  }

  private async initializeProcessWithTransaction(
    leadId: string,
    transactionConnection: mysql.Connection,
  ) {
    try {
      await new QueryBuilder('process_status')
        .setConnection(transactionConnection)
        .insert({
          lead_id: leadId,
          lead_process: 1
        })

      await new QueryBuilder('process_log')
        .setConnection(transactionConnection)
        .insert({
          lead_id: leadId,
          lead_process: new Date()
        })

      return this.success('Process Initialized!')
    } catch (error) {
      return this.handleError(error)
    }
  };

  async initializeProcess({
    leadId,
    transactionConnection,
  }: {
    leadId: string,
    transactionConnection?: mysql.Connection,
  }) {
    try {
      if (transactionConnection) {
        return this.initializeProcessWithTransaction(leadId, transactionConnection)
      } else {
        return withTransaction(async (connection) => {
          return this.initializeProcessWithTransaction(leadId, connection)
        })
      }
    } catch (error) {
      return this.handleError(error)
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
    processName: string,
    processValue: number,
    leadId?: string,
    propId?: string,
    loanId?: string,
    lan?: string,
    transactionConnection?: mysql.Connection,
  }) {
    try {
      if (leadId == null && propId == null && loanId == null && lan == null) {
        return this.failure('At least One Identifier Required!');
      }
  
      let updateContent: any = { [processName]: processValue };
  
      const queryStatus = new QueryBuilder('process_status')
        .setConnection(transactionConnection);
  
      if (leadId) {
        queryStatus.where('lead_id = ?', leadId);
        updateContent = { ...updateContent, lead_id: leadId };
      }
      if (propId) {
        queryStatus.where('prop_id = ?', propId);
        updateContent = { ...updateContent, prop_id: propId };
      }
      if (loanId) {
        queryStatus.where('loan_id = ?', loanId);
        updateContent = { ...updateContent, loan_id: loanId };
      }
      if (lan) {
        queryStatus.where('lan = ?', lan);
        updateContent = { ...updateContent, lan: lan };
      }
  
      const statusUpdate = await queryStatus.update(updateContent);
  
      const queryLog = new QueryBuilder('process_log')
        .setConnection(transactionConnection);
  
      if (leadId) queryLog.where('lead_id = ?', leadId);
      if (propId) queryLog.where('prop_id = ?', propId);
      if (loanId) queryLog.where('loan_id = ?', loanId);
      if (lan) queryLog.where('lan = ?', lan);
  
      const logUpdate = await queryLog.update({
        [processName]: new Date()
      });
  
      if (statusUpdate > 0 && logUpdate > 0) {
        return this.success('Process Updated');
      } else {
        let reason = '';
  
        if (statusUpdate <= 0) {
          reason += 'Status Update Not Processed! ';
        }
        if (logUpdate <= 0) {
          reason += 'Log Update Not Processed! ';
        }
        throw new Error("Process Update Failed! " + reason);
      }
    } catch (error) {
      return this.handleError(error);
    }
  }
  
} 