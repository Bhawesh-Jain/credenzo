import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";

export class CompanyRepository extends RepositoryBase {
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.companyId = companyId;
  }

  async getCurrencySymbol() {
    try {
      const data = await new QueryBuilder('company_master')
        .where('company_id = ?', this.companyId)
        .limit(1)
        .select(['currency_symbol']) as any[]

      if (data.length > 0) {
        return this.success(data[0].currency_symbol)
      }

      return this.failure('No Currency Found!')

    } catch (error) {
      return this.handleError(error);
    }
  }
} 