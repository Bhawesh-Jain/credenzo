'use server'

import { AccessRepository } from "../repositories/accessRepository";
import { BranchRepository } from "../repositories/branchRepository";
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

export async function createRole(name: string, department: string) {
  const session = await getSession();
  const accessRepository = new AccessRepository(session.company_id);
  return await accessRepository.createRole(name, department, session.user_id);
}

export async function createBranch(name: string, branch_code: string, pincode: string, location: string) {
  const session = await getSession();
  const branchRepository = new BranchRepository(session.company_id);
  return await branchRepository.createBranch(name, branch_code, pincode, location, session.user_id);
}

export async function getBranches() {
  const session = await getSession();
  const branchRepository = new BranchRepository(session.company_id);
  return await branchRepository.getBranches();
}

export async function disableBranch(id: number, status: number) {
  const session = await getSession();
  const branchRepository = new BranchRepository(session.company_id);
  return await branchRepository.disableBranch(id, session.user_id, status);
}
