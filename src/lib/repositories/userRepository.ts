import { UserData } from "../actions/auth";
import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import bcrypt from 'bcryptjs';
import { RepositoryBase } from "../helpers/repository-base";

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
    this.builder = new QueryBuilder('info_user');
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
        FROM info_user iu
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
    this.queryBuilder = new QueryBuilder('info_user');
    this.companyId = companyId;
  }

  async getUserById(
    userId: string
  ) {
    try {
      var user = await executeQuery<any[]>(`
          SELECT *
          FROM info_user
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
}