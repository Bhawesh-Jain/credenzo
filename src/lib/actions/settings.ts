'use server'

import { UserFormValues } from "@/app/dashboard/settings/user-management/blocks/AddUser";
import { AccessRepository } from "../repositories/accessRepository";
import { BranchRepository } from "../repositories/branchRepository";
import { UserRepository } from "../repositories/userRepository";

import { getSession } from "../session";
import { ProductRepository } from "../repositories/productRepository";
import { DirectCollectionAccountValues } from "@/app/dashboard/settings/product-management/blocks/AddProduct";
import { EditProductsValues } from "@/app/dashboard/settings/product-management/blocks/EditProduct";

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

// export async function createProducts(name: string, minimum_tenure: string, maximum_tenure: string, type: string, mimimum_cibil_score: string, minimum_age: number,interest_rate: Number) {
//   const session = await getSession();

//   const porductRepository = new ProductRepository(session.company_id);
//   return await porductRepository.createProducts(name,minimum_tenure , maximum_tenure, type, mimimum_cibil_score, minimum_age, interest_rate, session.user_id);
// }
export async function createProducts(data: DirectCollectionAccountValues) {
  const session = await getSession();
  const porductRepository = new ProductRepository(session.company_id);
  return await porductRepository.createProducts( session.user_id,data);
}
export async function createProductsType(data: string) {
  const session = await getSession();
  const porductRepository = new ProductRepository(session.company_id);
  return await porductRepository.createProductsType( session.user_id,data);
}
export async function getProductsType() {
  const session = await getSession();
  const porductRepository = new ProductRepository(session.company_id);
  return await porductRepository.getProductsType();
}

export async function updateProducts(data: EditProductsValues){
  const session = await getSession();
  const porductRepository = new ProductRepository(session.company_id);
  return await porductRepository.updateProducts( data.id,
    session.user_id,
    data
  );
}
export async function getProducts() {
    const session = await getSession();
  const porductRepository = new ProductRepository(session.company_id);
  return await porductRepository.getProducts();
}

