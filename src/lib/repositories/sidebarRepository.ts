import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { UserRepository } from "./userRepository";

interface MenuItem {
  id: number;
  parent_id: number | null;
  url: string;
  title: string;
  menu_order: number;
  items?: MenuItem[];
}

const buildTree = (items: MenuItem[], parentId: number | null = 0): MenuItem[] => {
  const currentLevelItems = items.filter((item) => {
    if (parentId === 0) {
      return item.parent_id === 0;
    }
    return item.parent_id === parentId;
  });

  const sortedItems = currentLevelItems.sort((a, b) => a.menu_order - b.menu_order);

  return sortedItems.map((item) => {
    const children = buildTree(items, item.id);
    return {
      ...item,
      items: children.length > 0 ? children : undefined
    };
  });
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