import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { UserRepository } from "./userRepository";

interface MenuItem {
  id: number;
  parent_id: number;
  url: string;
  title: string;
  menu_order: number;
  items?: MenuItem[];
}

const buildTree = (items: MenuItem[], parentId: number = 0): MenuItem[] => {
  return items
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      ...item,
      items: buildTree(items, item.id),
    }));
};

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

      const permissions = await executeQuery<MenuItem[]>(`
          SELECT im.id, im.parent_id, im.url, im.title, im.menu_order
          FROM info_modules im
          JOIN info_roles ir ON FIND_IN_SET(im.id, ir.permissions) > 0
          WHERE ir.id = ?
          ORDER BY im.parent_id ASC, im.menu_order ASC
       `, [user.result.role]);
      const nestedMenu = buildTree(permissions);

      const filtered = nestedMenu.filter((item) => item.items != null && item.items.length > 0)

      return this.success(filtered);
    } catch (error) {
      return this.handleError(error)
    }
  }
}