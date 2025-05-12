import bcrypt from 'bcryptjs';
import { RepositoryBase } from '../helpers/repository-base';
import { executeQuery, QueryBuilder } from '../helpers/db-helper';
import { UserData } from '../actions/auth';

type LoginResponse = {
  success: boolean;
  user?: UserData;
  error: string;
};

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
