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
  handler_name: string,
  branch_name: string,
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

export type Collection = {
  id: number,
  amount: string,
  due_date: string,
  customer_name: string,
  customer_phone: string,
  customer_address: string,
  loan_ref: string,
  loan_amount: string,
  loan_emi_amount: string,
  loan_type: string,
  loan_tenure: string,
  loan_start_date: string,
  interest_rate: string,
  lendor_name: string,
  status: string,
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
      let sql = `
        SELECT dca.*,
          u.name as handler_name,
          br.name as branch_name
        FROM direct_collection_accounts dca
        LEFT JOIN users u 
          ON dca.handler_id = u.id
          AND u.status = 1
        LEFT JOIN branches br
          ON br.id = dca.branch_id
        WHERE dca.company_id = ?
          AND dca.status >= 0
      `

      const accounts = await executeQuery(sql, [this.companyId]) as any[]


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

  async getCollectionList(
    userId: string,
  ) {
    try {
      let sql = `
        SELECT 
          cl.amount,
          cl.due_date,
          cl.id,
          dca.customer_name,
          dca.customer_phone,
          dca.customer_address,
          dca.loan_ref,
          dca.loan_amount,
          dca.loan_emi_amount,
          dca.loan_type,
          dca.loan_tenure,
          dca.loan_start_date,
          dca.interest_rate,
          dca.lendor_name,
          dca.status
        FROM collections cl
        LEFT JOIN direct_collection_accounts dca
          ON dca.loan_ref = cl.ref
        WHERE cl.status > 0
          AND cl.company_id = ?
          AND (cl.handler_id = '' OR cl.handler_id = ?)
        ORDER BY cl.id DESC
      `;

      const data = await executeQuery(sql, [this.companyId, userId]) as any

      if (data.length > 0) {
        return this.success(data)
      }

      return this.failure('No Collection Found!')

    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCollectionUsers(
    branchId: string
  ) {
    try {
      const companyConfig = await new QueryBuilder('company_master')
        .where('company_id = ?', this.companyId)
        .limit(1)
        .select(['collection_roles']) as any[]

      let sql = `
        SELECT u.id, u.name, roles.role_name, roles.department
        FROM user_branches ub
        LEFT JOIN users u ON ub.user_id = u.id
        LEFT JOIN roles ON u.role = roles.id
        WHERE ub.branch_id = ?
          AND u.company_id = ?
          AND u.role in (${companyConfig[0].collection_roles})
      `

      const data = await executeQuery(sql, [branchId, this.companyId]) as any[]

      console.log(data);

      if (data.length > 0) {
        return this.success(data)
      }

      return this.failure('No Collection Users Found!')

    } catch (error) {
      return this.handleError(error);
    }
  }
} 