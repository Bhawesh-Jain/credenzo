'use server'

import { AccessRepository } from "../repositories/accessRepository";
import { getSession } from "../session";

export async function getRoles() {
  const session = await getSession();
  const accessRepository = new AccessRepository(session.company_id);
  return await accessRepository.getRoles();
}

export async function getAllPermissions() {
  const session = await getSession();
  const accessRepository = new AccessRepository(session.company_id);
  return await accessRepository.getAllPermissions();
}

export async function updateRolePermissions(roleId: string, permissions: number[]) {
  const session = await getSession();
  const accessRepository = new AccessRepository(session.company_id);
  return await accessRepository.updateRolePermissions(roleId, permissions);
} 