import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"
import { DirectCollectionAccountValues } from "@/app/dashboard/collection/collection-accounts/blocks/CreateAccount";
import { CollectionFormValues } from "@/app/dashboard/collection/collection-accounts/blocks/AddCollection";
import { BranchRepository } from "./branchRepository";
import { CompanyRepository } from "./companyRepository";
import { ReceiptFormValues } from "@/app/dashboard/collection/receipting/blocks/create-receipt";


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
  currency_symbol: string,
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
      const account = await new QueryBuilder('direct_collection_accounts')
        .setConnection(transactionConnection)
        .where('loan_ref = ?', data.ref)
        .limit(1)
        .select(['handler_id', 'branch_id']) as any[]

      const lead = {
        ...data,
        // handler_id: account[0].handler_id,
        branch_id: account[0].branch_id,
        amount: data.amount,
        status: 1,
        ref_type: 'Direct',
        created_by: userId,
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
      const branches = await new BranchRepository(this.companyId)
        .getBranchStringByUserId(userId)

      if (branches.error) {
        return this.failure(branches.error)
      }

      const branchIds = branches.result as string

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
          AND cl.status < 10
          AND cl.company_id = ?
          AND (cl.handler_id IS NULL OR cl.handler_id = ?)
          AND dca.branch_id IN (${branchIds})
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

      if (data.length > 0) {
        return this.success(data)
      }

      return this.failure('No Collection Users Found!')

    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCollectionDetailById(
    collectionId: number
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
        WHERE cl.id = ?
          AND cl.company_id = ?
          AND cl.status > 0
        LIMIT 1
      `;

      const data = await executeQuery(sql, [collectionId, this.companyId]) as any
      const currencySymbol = await new CompanyRepository(this.companyId).getCurrencySymbol();

      if (data.length > 0) {
        return this.success({
          ...data[0],
          currency_symbol: currencySymbol.result,
        })
      }

      return this.failure('No Collection Found!')

    } catch (error) {
      return this.handleError(error);
    }
  }

  async createReceipt(
    userId: string,
    collectionId: number,
    data: ReceiptFormValues,
  ) {
    try {
      const receipt = {
        payment_method: data.payment_method,
        status: 10,
        updated_by: userId,
        paid_amount: data.amount,
        payment_date: data.payment_date,
        receipt_on: new Date()
      }

      const result = await new QueryBuilder('collections')
        .setConnection()
        .where('id = ?', collectionId)
        .update(receipt)

      if (result > 0) {
        return this.success(collectionId);
      }
      return this.failure('Failed to create receipt');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getReceiptById(
    receiptId: string,
  ) {
    try {
      var sql = `
          SELECT cl.*,
            pm.name as collection_type,
            pm.utr_required,
            br.name as branch_name,
            ds.name as status_name,
            dca.customer_name,
            dca.loan_amount,
            dca.loan_emi_amount,
            dca.loan_type,
            dca.loan_tenure,
            dca.interest_rate,
            dca.loan_start_date,
            dca.lendor_name
          FROM collections cl
          LEFT JOIN direct_collection_accounts dca
            ON dca.loan_ref = cl.ref
          LEFT JOIN payment_methods pm
            ON pm.id = cl.payment_method
          LEFT JOIN branches br
            ON br.id = cl.branch_id
          LEFT JOIN data_status ds
            ON ds.id = cl.status
          WHERE AND cl.id = ?
          LIMIT 1
        `

      const receipt = await executeQuery(sql, [receiptId]) as any[]
      if (receipt.length > 0) {
        return this.success(receipt[0]);
      }
      return this.failure('Failed to create receipt');
    } catch (error) {
      return this.handleError(error);
    }
  }


} 