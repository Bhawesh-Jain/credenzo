import { UserData } from "../actions/auth";
import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import bcrypt from 'bcryptjs';
import { RepositoryBase } from "../helpers/repository-base";
import { UserFormValues } from "@/app/dashboard/settings/user-management/blocks/AddUser";
import { BranchRepository } from "./branchRepository";

type LoginResponse = {
  success: boolean;
  user?: UserData;
  error: string;
};

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

export class UserAuthRepository extends RepositoryBase {
  private builder: QueryBuilder;

  constructor() {
    super()
    this.builder = new QueryBuilder('users');
  }

  private async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return password == hashedPassword;
    // return bcrypt.compare(password, hashedPassword);
  }

  private async logAttempt(
    userId: number | null,
    identifier: string,
    password: string,
    success: boolean,
    ipAddress: string
  ): Promise<number> {
    const attemptBuilder = new QueryBuilder('login_attempts');

    const logId = await attemptBuilder.insert({
      user_id: userId,
      identifier_used: identifier,
      password_used: 'N/A',
      success,
      ip_address: ipAddress
    });

    return logId;
  }

  async login(
    identifier: string,
    password: string,
    ipAddress: string
  ): Promise<LoginResponse> {
    try {
      const recentAttempts = await executeQuery<any[]>(`
        SELECT COUNT(*) as count 
        FROM login_attempts 
        WHERE ip_address = ? 
        AND success = false 
        AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
      `, [ipAddress]);

      if (recentAttempts[0].count >= 5) {
        return {
          success: false,
          error: "Too many failed attempts. Please try again later."
        };
      }


      const users = await executeQuery<any[]>(`
        SELECT iu.*, 
        cm.company_id, cm.company_name, cm.abbr
        FROM users iu
        LEFT JOIN company_master cm
          ON cm.company_id = iu.company_id
          AND cm.is_active = 1
        WHERE (iu.id = ? 
          OR iu.employee_code = ? 
          OR iu.email = ? 
          OR iu.phone = ?)
          AND iu.status = 1
        LIMIT 1
      `, [identifier, identifier, identifier, identifier]);

      if (users.length === 0) {
        await this.logAttempt(null, identifier, password, false, ipAddress);
        return {
          success: false,
          error: "Invalid credentials"
        };
      }

      const user = users[0];

      const isValidPassword = await this.validatePassword(
        password,
        user.password
      );

      if (!isValidPassword) {
        await this.logAttempt(user.id, identifier, password, false, ipAddress);
        return {
          success: false,
          error: "Invalid credentials"
        };
      }

      await this.builder
        .where('id = ?', user.id)
        .update({ last_login: new Date() });

      await this.logAttempt(user.id, identifier, password, true, ipAddress);


      const userObj = {
        user_id: user.id,
        user_phone: user.phone,
        user_email: user.email,
        user_avatar: user.image,
        user_name: user.name,
        company_name: user.company_name,
        company_id: user.company_id,
        company_abbr: user.abbr,
        role: user.role,
      }

      return {
        success: true,
        user: userObj,
        error: ''
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
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
          SELECT *
          FROM users
          WHERE id = ?
            AND company_id = ?
            AND status > 0
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
        .update({ status: status });

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

}
