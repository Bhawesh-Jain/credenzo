import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base"

export class AccessRepository extends RepositoryBase {
  private roleBuilder: QueryBuilder;
  private moduleBuilder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.roleBuilder = new QueryBuilder('info_roles');
    this.moduleBuilder = new QueryBuilder('info_modules');
    this.companyId = companyId;
  }


  async getRoles() {
    try {
      const result = await this.roleBuilder
        .where('company_id = ?', this.companyId)
        .where('status = ?', 1)
        .select(['id', 'role_name'])

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }



}

