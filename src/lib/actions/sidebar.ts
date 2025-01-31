"use server"
import { SidebarRepository } from "../repositories/sidebarRepository";
import { getSession } from "../session";

export async function getSidebarData() {
  const session = await getSession();

  var userId = session.user_id;

  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized Access',
      result: {}
    }
  }

  const sidebarRepo = new SidebarRepository(userId as string);

  const sidebar = await sidebarRepo.getSidebarData();
  
  return sidebar;
}