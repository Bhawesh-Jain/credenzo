import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";

export class LoanProductRepository extends RepositoryBase {
  private builder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.companyId = companyId;
    this.builder = new QueryBuilder('loan_product_type');
  }

  async getLoanProductTypes() {
    try {
      const result = await this.builder
        .where('status = ?', 1)
        .where('company_id = ?', this.companyId)
        .select(['id', 'name']);

      if (result.length > 0) {
        return this.success(result)
      }

      return this.failure("No product type found!")

    } catch (error) {
      return this.handleError(error)
    }

  }
} 