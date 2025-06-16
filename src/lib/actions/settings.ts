'use server'

import { UserFormValues } from "@/app/dashboard/settings/user-management/blocks/AddUser";
import { AccessRepository } from "../repositories/accessRepository";
import { BranchRepository } from "../repositories/branchRepository";
import { UserRepository } from "../repositories/userRepository";
import { getSession } from "../session";

import { VehicleFormValues } from "@/app/dashboard/settings/deveshi-test/blocks/CreateVehicle";
import { EditVehicleFormValues } from "@/app/dashboard/settings/deveshi-test/blocks/EditVehicle";
import { VehicleRepository } from "../repositories/vehicleRepository";
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

export async function getBranchById(id: number) {
  const session = await getSession();

  const branchRepository = new BranchRepository(session.company_id);
  return await branchRepository.getBranchById(id);
}

export async function editBranch(branchId: number, name: string, branch_code: string, pincode: string, location: string) {
  const session = await getSession();

  const branchRepository = new BranchRepository(session.company_id);
  return await branchRepository.editBranch(branchId, name, branch_code, pincode, location, session.user_id);
}

export async function getUsersByRoleId(roleId: string) {
  const session = await getSession();

  const userRepository = new UserRepository(session.company_id);
  return await userRepository.getUsersByRoleId(roleId);
}

export async function getUserById(currentId: number) {
  const session = await getSession();

  const userRepository = new UserRepository(session.company_id);
  return await userRepository.getUserById(String(currentId));
}

export async function disableUser(id: number, status: number) {
  const session = await getSession();

  const userRepository = new UserRepository(session.company_id);
  return await userRepository.disableUser(id, status, session.user_id);
}

export async function createUser(data: UserFormValues) {
  const session = await getSession();

  const userRepository = new UserRepository(session.company_id);
  return await userRepository.createUser(data, session.user_id);
}

export async function editUser(id: number, data: UserFormValues) {
  const session = await getSession();

  const userRepository = new UserRepository(session.company_id);
  return await userRepository.editUser(id, data, session.user_id);
}

//deveshi-test createvehicle 
export async function createVehicle(data: VehicleFormValues) {
  const session = await getSession();
  
  const vehicleRepository = new VehicleRepository(session.company_id);
  const result = await vehicleRepository.createVehicle(session.user_id, data);

  return result;
}


export async function getVehicles() {
  const session = await getSession();
  
  const vehicleRepository = new VehicleRepository(session.company_id);
  const result = await vehicleRepository.getVehiclesData();

  return result;
}

export async function getVehicleById(vehicleId: number) {
  const session = await getSession();
  
  const vehicleRepository = new VehicleRepository(session.company_id);
  const result = await vehicleRepository.getVehicleById(vehicleId);

  return result;
}

export async function getVehicleCompany() {
  const session = await getSession();
  
  const vehicleRepository = new VehicleRepository(session.company_id);
  const result = await vehicleRepository.getVehicleCompany();

  return result;
}

export async function editVehicle(vehicleId: number, vehicle: EditVehicleFormValues) {
  const session = await getSession();
  
  const vehicleRepository = new VehicleRepository(session.company_id);
  const result = await vehicleRepository.editVehicle(vehicleId,vehicle);

  return result;
}