import { QueryBuilder } from "../helpers/db-helper";
import { buildTree, PermissionItem } from "../helpers/permission-helper";
import { RepositoryBase } from "../helpers/repository-base"

export interface Role {
  id: string;
  role_name: string;
  user_count: number;
  permissions: string;
  department: string;
}

export class AccessRepository extends RepositoryBase {
  private roleBuilder: QueryBuilder;
  private moduleBuilder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.roleBuilder = new QueryBuilder('roles');
    this.moduleBuilder = new QueryBuilder('info_modules');
    this.companyId = companyId;
  }


  async getRoles() {
    try {
      const result = await this.roleBuilder
        .where('? in (company_id)', this.companyId)
        .where('status = ?', 1)
        .select(['id', 'role_name', 'user_count', 'permissions', 'department'])

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAllPermissions() {
    try {
      const result = await this.moduleBuilder
        .where('? in (company_id)', this.companyId)
        .where('status = ?', 1)
        .select(['id', 'parent_id', 'url', 'title', 'menu_order'])

      const permissions = buildTree(result as PermissionItem[]);

      return this.success(permissions);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateRolePermissions(roleId: string, permissions: number[]) {
    try {
      await this.roleBuilder.where('id = ?', roleId).update({ permissions: permissions.join(',') });
      return this.success(true);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createRole(
    name: string,
    department: string,
    userId: string
  ) {
    try {
      const insert = await this.roleBuilder.insert({
        role_name: name,
        company_id: this.companyId,
        department: department,
        status: 1,
        created_by: userId
      });

      if (insert) {
        return this.success(insert);
      } else {
        return this.failure('Failed to create role');
      }
    } catch (error) {
      return this.handleError(error);
    }
  }
}

