import { executeQuery, QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";


export class BranchRepository extends RepositoryBase {
  private queryBuilder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super();
    this.queryBuilder = new QueryBuilder('info_branch');
    this.companyId = companyId;
  }

  async generateUniqueBranchId() {
    const query = await executeQuery<any[]>(`
      SELECT abbr
      FROM company_master
      WHERE company_id = ?
        AND is_active = '1'
      LIMIT 1
    `, [this.companyId]);

    const abbr = `${query[0].abbr}-` || '';

    return abbr + Math.random().toString(36).substring(2, 15);
  }

  async createBranch(
    name: string,
    branch_code: string,
    pincode: string,
    location: string,
    userId: string
  ) {
    try {
      const uniqueId = await this.generateUniqueBranchId();

      if (!uniqueId) {
        return this.failure('Failed to generate unique branch id');
      }

      const insert = await this.queryBuilder.insert({
        branch_code: branch_code,
        location: location,
        pincode: pincode,
        name: name,
        unique_id: uniqueId,
        status: 1,
        expire_date: null,
        company_id: this.companyId,
        updated_by: userId,
        updated_on: new Date(),
      })

      if (insert) {
        var branchId = 1000 + insert;
        console.log(branchId, insert);
        
        await this.queryBuilder
          .where('id = ?', insert)
          .update({ branch_id: branchId })

        return this.success(insert);
      } else {
        return this.failure('Failed to create branch');
      }
    } catch (error) {
      return this.handleError(error);
    }
  }


}
