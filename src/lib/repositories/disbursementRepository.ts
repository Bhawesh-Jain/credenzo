import { executeQuery, QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { BranchRepository } from "./branchRepository";

export interface DisbursementItem {
    id: string
    branch_id: string
    city: string
    client_id: string
    customer_name: string
    login_date: string
    prop_no: string
    mobile_no: string
    branch_name: string
    branch_status: string
    product_name: string
    status_label: string
    handler_name: string
    loan_amount: string
}

export class DisbursementRepository extends RepositoryBase {
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.companyId = companyId;
  }


  async getDisbursementList(
    userId: string
  ) {
    try {
      const branchResult = await new BranchRepository(this.companyId).getBranchStringByUserId(userId);

      if (!branchResult.success) {
        return this.failure('Invalid User Branch!')
      }

      let branches = branchResult.result;

      var sql = `
              SELECT 
                  p.id,  
                  p.branch_id,  
                  p.city,  
                  p.client_id,  
                  p.customer_name,  
                  p.login_date,  
                  p.prop_no,  
                  p.loan_amount,  
                  p.mobile_no,  
                  br.name AS branch_name, br.status AS branch_status,  
                  lpt.name AS product_name,  
                  ms.label AS status_label,  
                  u.name AS handler_name  
              FROM proposals p  
              LEFT JOIN branches br ON p.branch_id = br.id  
              LEFT JOIN loan_product_type lpt ON lpt.id = p.product_id  
              LEFT JOIN master_status ms ON ms.status = p.status  
              LEFT JOIN users u ON u.id = p.handler_id  
              LEFT JOIN process_status ps ON p.id = ps.prop_id
                AND p.lead_id = ps.lead_id 
              WHERE p.branch_id IN (${branches})  
                AND p.status > 5  
                AND p.status < 20  
                AND p.company_id = ?  
                AND ps.disbursement_process = 0
                AND ps.sanction_process > 0
          `

      const data = await executeQuery(sql, [this.companyId]) as any[];

      if (data.length > 0) {
        return this.success(data)
      }

      return this.failure('No Company Found!')

    } catch (error) {
      return this.handleError(error);
    }
  }
}