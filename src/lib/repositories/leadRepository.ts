import { LeadFormValues } from "@/app/dashboard/customer-boarding/leads/blocks/CreateLead";
import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"
export class LeadRepository extends RepositoryBase {
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.companyId = companyId;
  }

  async getLeadsById(userId: string) {
    try {

      var sql = `
        SELECT l.*, lpt.name as loanType
        FROM leads l
        LEFT JOIN loan_product_type lpt
          ON l.product_type = lpt.id
        WHERE l.company_id = ?
          AND l.updated_by = ?
          AND l.status != 0
        ORDER BY l.meeting_date ASC
      `

      const result = await executeQuery(sql, [this.companyId, userId]) as any[]

      if (result.length > 0) {
        return this.success(result)
      }

      return this.failure("No Leads Found!")

    } catch (error) {
      return this.handleError(error);
    }
  }

  async createLead(
    userId: string,
    leadData: LeadFormValues,
    status?: number,
    transactionConnection?: mysql.Connection
  ) {
    try {
      const lead = {
        updated_by: userId,
        customer_name: leadData.firstName + " " + leadData.lastName,
        phone: leadData.phone,
        email: leadData.email,
        gender: leadData.gender,
        product_type: leadData.loanType,
        loan_amount: leadData.amount,
        loan_purpose: leadData.purpose,
        term: leadData.term,
        remark: leadData.notes,
        status: status || 1,
        company_id: this.companyId,
        meeting_date: leadData.date || null,
        meeting_time: leadData.time || '',
        updated_on: new Date(),
      }

      const result = await new QueryBuilder('leads')
        .setConnection(transactionConnection)
        .insert(lead);

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }
} 