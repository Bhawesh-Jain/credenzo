import { executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { UserRepository } from "./userRepository";

export class ApprovedCasesRepository extends RepositoryBase {
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


}