import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { UserRepository } from "./userRepository";


export class SidebarRepository extends RepositoryBase {
  private builder: QueryBuilder;
  private userId: string;

  constructor(userId: string) {
    super()
    this.builder = new QueryBuilder('info_modules');
    this.userId = userId;
  }

  async getSidebarData() {
    try {
      const userRepo = new UserRepository();

      const user = await userRepo.getUserById(this.userId)

      if (!user.success) {
        return this.failure(user.error)
      }
      
      const permissions = await executeQuery<any[]>(`
        SELECT ir.*
        FROM info_roles ir
        WHERE ir.id = ?
      `, [user.result.role]);



      return this.success(permissions);
    } catch (error) {
      return this.handleError(error)
    }
  }
}