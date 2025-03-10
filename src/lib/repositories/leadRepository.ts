import { LeadFormValues } from "@/app/dashboard/customer-boarding/create-lead/page";
import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"
export class LeadRepository extends RepositoryBase {
  private builder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.builder = new QueryBuilder('leads');
    this.companyId = companyId;
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
        meetting_date: leadData.date,
        meetting_time: leadData.time,
        updated_on: new Date(),
      }

      const result = await this.builder
        .setConnection(transactionConnection)
        .insert(lead);

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }
} 