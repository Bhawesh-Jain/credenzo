export interface PermissionItem {
  id: number;
  parent_id: number | null;
  url: string;
  title: string;
  parent_name: string;
  menu_order: number;
  items?: PermissionItem[];
  checked?: boolean;
}

export const buildTree = (items: PermissionItem[], parentId: number | null = 0, parentName: string = ''): PermissionItem[] => {
  const currentLevelItems = items.filter((item) => {
    if (parentId === 0) {
      return item.parent_id === 0;
    }
    return item.parent_id === parentId;
  });

  const sortedItems = currentLevelItems.sort((a, b) => a.menu_order - b.menu_order);

  return sortedItems.map((item) => {
    const children = buildTree(items, item.id, item.title);
    return {
      ...item,
      parent_name: parentName || '',
      items: children.length > 0 ? children : undefined
    };
  });
};


export function collectCheckedPermissions(permissionsList: any[], collected: number[] = []) {
  for (const perm of permissionsList) {
    if (perm.checked) {
      collected.push(perm.id);
    }
    
    // If there are nested items, recursively check them
    if (perm.items && Array.isArray(perm.items)) {
      collectCheckedPermissions(perm.items, collected);
    }
  }
  return collected;
}