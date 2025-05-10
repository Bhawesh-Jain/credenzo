import { TeleverificationFormValues } from "@/app/dashboard/applications/televerification/blocks/TeleverificationTab";
import { executeQuery, QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { BranchRepository } from "./branchRepository";
import { ProcessRepository } from "./processRepository";
import { UserRepository } from "./userRepository";
import { FieldInvestigationFormValues } from "@/app/dashboard/applications/field-investigation/blocks/FieldInvestigationTab";

export interface Application {
  id: number;
  prop_no: string;
  lead_id: number;
  client_id: number;
  proposal_loan_id: string | null;
  handler_id: number;
  company_id: number;
  proposal_status: number;
  customer_name: string;
  email_id: string;
  mobile_no: string;
  pan: string;
  product_id: number;
  loan_amount: string;
  emi_amount: string;
  tenure: string;
  branch_id: number;
  city: string;
  state: string;
  login_date: string;
  proposal_updated_on: string;
  proposal_created_on: string;
  branch_name: string;
  branch_status: number;
  product_name: string;
  status_label: string;
  handler_name: string;
  current_process: string;
}

export interface QueueItem {
  id: number;
  client_id: number;
  prop_no: string;
  customer_name: string;
  loan_amount: string;
  mobile_no: string;
  date: string;
  branch_name: string;
  product_name: string;
  handler_name: string;
}

export class ApplicationsRepository extends RepositoryBase {
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.companyId = companyId;
  }

  async getApprovedCases(
    userId: string
  ) {
    try {
      const userBranches = await new UserRepository(this.companyId).getUserBranchesById(userId);

      let branchList = userBranches.result as any[];

      branchList = branchList.map(item => item.branch_id)

      let branches = branchList.join(',').toString();

      let sql = `
              SELECT 
                  p.*,  
                  br.name AS branch_name, br.status AS branch_status,  
                  lpt.name AS product_name,  
                  ms.label AS status_label,  
                  u.name AS handler_name  
              FROM proposals p  
              LEFT JOIN branches br ON p.branch_id = br.id  
              LEFT JOIN loan_product_type lpt ON lpt.id = p.product_id  
              LEFT JOIN master_status ms ON ms.status = p.status  
              LEFT JOIN users u ON u.id = p.handler_id  
              WHERE p.branch_id IN (${branches})  
                AND p.status > 5  
                AND p.status < 20  
                AND p.company_id = ?  
          `

      const result = await executeQuery<any[]>(sql, [this.companyId]);

      if (result.length > 0) {
        return this.success(result)
      }

      return this.failure('No Cases Found!')
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getTeleverificationCases(
    userId: string
  ) {
    try {
      const userBranches = await new UserRepository(this.companyId).getUserBranchesById(userId);

      let branchList = userBranches.result as any[];

      branchList = branchList.map(item => item.branch_id)

      let branches = branchList.join(',').toString();

      let sql = `
              SELECT 
                  p.id,  
                  p.client_id,  
                  p.prop_no,  
                  p.customer_name,  
                  p.loan_amount,  
                  p.mobile_no,  
                  pl.approval_process as date,  
                  br.name AS branch_name,  
                  lpt.name AS product_name,  
                  u.name AS handler_name  
              FROM proposals p  
              LEFT JOIN branches br ON p.branch_id = br.id  
              LEFT JOIN loan_product_type lpt ON lpt.id = p.product_id  
              LEFT JOIN users u ON u.id = p.handler_id  
              LEFT JOIN process_status ps ON ps.prop_id = p.id
                AND ps.lead_id = p.lead_id
              LEFT JOIN process_log pl ON pl.prop_id = p.id
                AND pl.lead_id = p.lead_id
              WHERE p.branch_id IN (${branches})  
                AND p.status > 5  
                AND p.status < 20  
                AND p.company_id = ?  
                AND ps.televerification_process = 0
          `

      const result = await executeQuery<any[]>(sql, [this.companyId]);

      if (result.length > 0) {
        return this.success(result)
      }

      return this.failure('No Cases Found!')
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getFiCases(
    userId: string
  ) {
    try {
      const userBranches = await new UserRepository(this.companyId).getUserBranchesById(userId);

      let branchList = userBranches.result as any[];

      branchList = branchList.map(item => item.branch_id)

      let branches = branchList.join(',').toString();

      let sql = `
              SELECT 
                  p.id,  
                  p.client_id,  
                  p.prop_no,  
                  p.customer_name,  
                  p.loan_amount,  
                  p.mobile_no,  
                  pl.approval_process as date,  
                  br.name AS branch_name,  
                  lpt.name AS product_name,  
                  u.name AS handler_name  
              FROM proposals p  
              LEFT JOIN branches br ON p.branch_id = br.id  
              LEFT JOIN loan_product_type lpt ON lpt.id = p.product_id  
              LEFT JOIN users u ON u.id = p.handler_id  
              LEFT JOIN process_status ps ON ps.prop_id = p.id
                AND ps.lead_id = p.lead_id
              LEFT JOIN process_log pl ON pl.prop_id = p.id
                AND pl.lead_id = p.lead_id
              WHERE p.branch_id IN (${branches})  
                AND p.status > 5  
                AND p.status < 20  
                AND p.company_id = ?  
                AND ps.fi_process = 0
          `

      const result = await executeQuery<any[]>(sql, [this.companyId]);

      if (result.length > 0) {
        return this.success(result)
      }

      return this.failure('No Cases Found!')
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getApplicationsList(
    userId: string
  ) {
    try {
      const userBranches = await new BranchRepository(this.companyId).getBranchStringByUserId(userId);

      if (!userBranches.success) {
        return this.failure(userBranches.result)
      }

      let branches = userBranches.result;

      let sql = `
                SELECT
                  p.id,
                  p.prop_no,
                  p.lead_id,
                  p.client_id,
                  p.loan_id     AS proposal_loan_id,
                  p.handler_id,
                  p.company_id,
                  p.status      AS proposal_status,
                  p.customer_name,
                  p.email_id,
                  p.mobile_no,
                  p.pan,
                  p.product_id,
                  p.loan_amount,
                  p.emi_amount,
                  p.tenure,
                  p.branch_id,
                  p.city,
                  p.state,
                  p.login_date,
                  p.updated_on AS proposal_updated_on,
                  p.created_on AS proposal_created_on,

                  br.name       AS branch_name,
                  br.status     AS branch_status,

                  lpt.name      AS product_name,

                  ms.label      AS status_label,

                  u.name        AS handler_name,

                  COALESCE(t.process, 'Completed') AS current_process

                  FROM proposals p
                  LEFT JOIN branches br
                  ON p.branch_id = br.id
                  LEFT JOIN loan_product_type lpt
                  ON lpt.id = p.product_id
                  LEFT JOIN master_status ms
                  ON ms.status = p.status
                  LEFT JOIN users u
                  ON u.id = p.handler_id

                  LEFT JOIN process_status ps
                  ON ps.prop_id = p.id
                  AND ps.lead_id = p.lead_id

                  LEFT JOIN LATERAL (
                  SELECT process
                  FROM (
                    SELECT 'lead_process'               AS process, ps.lead_process     AS status UNION ALL
                    SELECT 'proposal_process',          ps.proposal_process                       UNION ALL
                    SELECT 'kyc_process',               ps.kyc_process                            UNION ALL
                    SELECT 'imd_process',               ps.imd_process                            UNION ALL
                    SELECT 'sales_process',             ps.sales_process                          UNION ALL
                    SELECT 'approval_process',          ps.approval_process                       UNION ALL
                    SELECT 'televerification_process',  ps.televerification_process               UNION ALL
                    SELECT 'fi_process',                ps.fi_process                             UNION ALL
                    SELECT 'legal_process',             ps.legal_process                          UNION ALL
                    SELECT 'technical_process',         ps.technical_process                      UNION ALL
                    SELECT 'sanction_process',          ps.sanction_process                       UNION ALL
                    SELECT 'disbursement_process',      ps.disbursement_process
                  ) AS unpiv
                  WHERE status = 0
                  ORDER BY FIELD(
                    process,
                    'lead_process',
                    'proposal_process',
                    'kyc_process',
                    'imd_process',
                    'sales_process',
                    'approval_process',
                    'televerification_process',
                    'fi_process',
                    'legal_process',
                    'technical_process',
                    'sanction_process',
                    'disbursement_process'
                  )
                  LIMIT 1
                  ) AS t ON TRUE

                WHERE p.branch_id IN (${branches})
                  AND p.status > 5
                  AND p.status < 20
                  AND p.company_id = ?
        `

      const result = await executeQuery<any[]>(sql, [this.companyId]);

      if (result.length > 0) {
        return this.success(result)
      }

      return this.failure('No Cases Found!')
    } catch (error) {
      return this.handleError(error)
    }
  }

  async submitTeleverification(
    userId: string,
    propId: string,
    clientId: string,
    data: TeleverificationFormValues
  ) {
    try {
      const record = {
        ...data,
        user_id: userId,
        prop_id: propId,
        client_id: clientId
      }

      const result = await new QueryBuilder('televerification_log')
        .insert(record);

      await new ProcessRepository().updateProcess({
        processName: 'televerification_process',
        processValue: 1,
        propId: propId
      });

      if (result > 0) {
        return this.success('Record Updated!');
      }

      return this.failure('Request Failed');

    } catch (error) {
      return this.handleError(error)
    }
  }

  async submitFieldInvestigation(
    userId: string,
    propId: string,
    data: FieldInvestigationFormValues
  ) {
    try {
      const record = {
        ...data,
        handler_id: userId,
        prop_id: propId,
        status: 1,
      }

      const result = await new QueryBuilder('fi_log')
        .insert(record);

      await new ProcessRepository().updateProcess({
        processName: 'fi_process',
        processValue: 1,
        propId: propId
      });

      if (result > 0) {
        return this.success('Record Updated!');
      }

      return this.failure('Request Failed');

    } catch (error) {
      return this.handleError(error)
    }
  }
}