import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { UserFormValues } from "@/app/dashboard/settings/user-management/blocks/AddUser";
import { BranchRepository } from "./branchRepository";
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  status: number;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
  company_id: string;
  branch_id: string;
}

export class UserRepository extends RepositoryBase {
  private queryBuilder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.queryBuilder = new QueryBuilder('users');
    this.companyId = companyId;
  }

  async getUserById(
    userId: string
  ) {
    try {
      var user = await executeQuery<any[]>(`
          SELECT u.*,
            GROUP_CONCAT(ub.branch_id) as branch
          FROM users u
          LEFT JOIN user_branches ub
            ON ub.user_id = u.id
          WHERE u.id = ?
            AND u.company_id = ?
            AND u.status > 0
          GROUP BY u.id
          LIMIT 1
        `, [userId, this.companyId]);

      if (user && user.length > 0) {
        return this.success(user[0])
      }
      return this.failure('Invalid User!')
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserBranchesById(
    userId: string
  ) {
    try {
      var user = await executeQuery<any[]>(`
          SELECT branch_id
          FROM user_branches
          WHERE user_id = ?
        `, [userId]);

      if (user && user.length > 0) {
        return this.success(user)
      }
      return this.failure('No Branches Found!')
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUsersByRoleId(
    roleId: string
  ) {
    try {
      var users = await this.queryBuilder
        .where('role = ?', roleId)
        .where('company_id = ?', this.companyId)
        .select(['*']);

      if (users && users.length > 0) {
        return this.success(users);
      }
      return this.failure('No users found');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async disableUser(
    userId: number,
    status: number,
    updatedBy: string
  ) {
    try {
      const result = await this.queryBuilder
        .where('id = ?', userId)
        .update({ status: status, updated_by: updatedBy });

      if (result > 0) {
        return this.success('User disabled successfully');
      }
      return this.failure('User not found');
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async checkExisting(
    employee_code: string,
    email: string,
    phone: string
  ) {
    try {
      const result = await this.queryBuilder
        .where('employee_code = ?', employee_code)
        .where('email = ?', email)
        .where('phone = ?', phone)
        .select(['id']);

      if (result && result.length > 0) {
        return this.success('User already exists');
      }
      return this.failure('User not found');
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async passwordHash(
    password: string
  ) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async createUser(
    data: UserFormValues,
    updated_by: string
  ) {
    try {
      const existing = await this.checkExisting(data.employee_code, data.email || '', data.phone || '');
      if (existing.success) {
        return this.failure(existing.error);
      }

      var branches = data.branch.split(',')

      const result = await this.queryBuilder
        .insert({
          employee_code: data.employee_code,
          name: data.name,
          email: data.email,
          phone: data.phone,
          // password: this.passwordHash(data.password),
          password: data.password,
          role: data.role,
          company_id: this.companyId,
          created_by: updated_by,
          status: 1,
          updated_at: new Date()
        });

      if (result > 0) {

        for (let i = 0; i < branches.length; i++) {
          const element = branches[i];

          const branchRepository = new BranchRepository(this.companyId);
          await branchRepository.addUserBranch(String(result), element);
        }

        await executeQuery<any[]>(`
          UPDATE roles
          SET user_count = (select count(*) from users where role = ? and company_id = ?)
          WHERE id = ?
            AND company_id = ?
        `, [data.role, this.companyId, data.role, this.companyId]);

        return this.success('User created successfully');
      }
      return this.failure('User not created');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async editUser(
    id: number,
    data: UserFormValues,
    updated_by: string
  ) {
    try {
      var branches = data.branch.split(',')

      const existingBranches = await new BranchRepository(this.companyId).getBranchListByUserId(String(id));
      let addableBranches = [] as string[];
      let removableBranches = [] as string[];

      if (existingBranches.success) {
        const currentBranchList = existingBranches.result.map((role: any) => (role.id.toString())) as string[];

        addableBranches = branches.filter(x => !currentBranchList.includes(x));
        removableBranches = currentBranchList.filter(x => !branches.includes(x));
      }

      for (let i = 0; i < addableBranches.length; i++) {
        const element = addableBranches[i];

        const branchRepository = new BranchRepository(this.companyId);
        await branchRepository.addUserBranch(String(id), element);
      }

      for (let i = 0; i < removableBranches.length; i++) {
        const element = removableBranches[i];

        const branchRepository = new BranchRepository(this.companyId);
        await branchRepository.removeUserBranch(String(id), element);
      }

      const result = await this.queryBuilder
        .where('id = ?', id)
        .update({
          employee_code: data.employee_code,
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: data.role,
          company_id: this.companyId,
          updated_by: updated_by,
          updated_at: new Date()
        });


      if (result > 0) {
        return this.success('User updated successfully');
      }

      return this.failure('User not updated');
    } catch (error) {
      return this.handleError(error);
    }
  }

}
