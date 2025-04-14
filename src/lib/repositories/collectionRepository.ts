import { LeadFormValues } from "@/app/dashboard/customer-boarding/leads/blocks/CreateLead";
import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"
import { EditLeadFormValues } from "@/app/dashboard/customer-boarding/leads/blocks/EditLead";
import { ProcessRepository } from "./processRepository";
import { DirectCollectionAccountValues } from "@/app/dashboard/collection/collection-accounts/blocks/CreateAccount";


export type CollectionAccount = {
  id: number,
  customer_name: string,
  customer_phone: string,
  customer_address: string,
  loan_ref: string,
  loan_amount: number,
  loan_emi_amount: number,
  loan_type: string,
  loan_tenure: number,
  loan_start_date: string,
  interest_rate: string,
  lendor_name: string,
  lendor_id: string,
  status: number,
  updated_on: string,
  created_on: string
}


export class CollectionRepository extends RepositoryBase {
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.companyId = companyId;
  }

  async createAccount(
    userId: string,
    data: DirectCollectionAccountValues,
    transactionConnection?: mysql.Connection
  ) {
    try {
      const lead = {
        ...data,
        updated_by: userId,
        company_id: this.companyId
      }

      const result = await new QueryBuilder('direct_collection_accounts')
        .setConnection(transactionConnection)
        .insert(lead);

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }
} 