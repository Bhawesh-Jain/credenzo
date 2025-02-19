import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { UserRepository } from "./userRepository";
import { buildTree, PermissionItem } from "../helpers/permission-helper";
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
      console.log("getSidebarData");
      
      const userRepo = new UserRepository();
      const user = await userRepo.getUserById(this.userId)

      if (!user.success) {
        return this.failure(user.error)
      }

      const permissions = await executeQuery<PermissionItem[]>(`
        SELECT 
          im.id, 
          im.parent_id, 
          im.url, 
          im.title, 
          im.menu_order
        FROM info_modules im
        JOIN info_roles ir ON FIND_IN_SET(im.id, ir.permissions) > 0
        WHERE ir.id = ?
        ORDER BY 
          CASE WHEN im.parent_id = 0 THEN 0 ELSE 1 END,
          im.parent_id ASC,
          im.menu_order ASC
      `, [user.result.role]);

      const nestedMenu = buildTree(permissions);
      
      const userData = {
        name: user.result.name,
        email: user.result.email,
        avatar: user.result.avatar,
      }

      return this.success({ menu: nestedMenu, user: userData });
    } catch (error) {
      return this.handleError(error)
    }
  }
}