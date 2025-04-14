import { LeadFormValues } from "@/app/dashboard/customer-boarding/leads/blocks/CreateLead";
import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"
import { EditLeadFormValues } from "@/app/dashboard/customer-boarding/leads/blocks/EditLead";
import { ProcessRepository } from "./processRepository";
import { DirectCollectionAccountValues } from "@/app/dashboard/collection/collection-accounts/blocks/CreateAccount";
import { CollectionFormValues } from "@/app/dashboard/collection/collection-accounts/blocks/AddCollection";


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

  async createCollection(
    userId: string,
    data: CollectionFormValues,
    transactionConnection?: mysql.Connection
  ) {
    try {
      const lead = {
        ...data,
        status: 1,
        ref_type: 'Direct',
        updated_by: userId,
        company_id: this.companyId
      }

      const result = await new QueryBuilder('collections')
        .setConnection(transactionConnection)
        .insert(lead);

      if (result > 0) {
        return this.success('Collection Added!');
      }
      return this.failure('Failed to add collection');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createAccount(
    userId: string,
    data: DirectCollectionAccountValues,
    transactionConnection?: mysql.Connection
  ) {
    try {
      const lead = {
        ...data,
        status: 1,
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

  async getAccountList() {
    try {
      const accounts = await new QueryBuilder('direct_collection_accounts')
        .where('company_id = ?', this.companyId)
        .where('status >= 0')
        .select(['*']) as any[]

      if (accounts.length > 0) {
        return this.success(accounts)
      }

      return this.failure('No Account Found!')

    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateAccount(
    accountId: number,
    userId: string,
    data: Partial<DirectCollectionAccountValues>,
    transactionConnection?: mysql.Connection
  ) {
    try {
      const updateData = {
        ...data,
        updated_by: userId,
      };

      const result = await new QueryBuilder("direct_collection_accounts")
        .setConnection(transactionConnection)
        .where("id = ?", accountId)
        .update(updateData);

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }
} 