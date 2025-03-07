"use server"

import { BranchRepository } from "../repositories/branchRepository";
import { getSession } from "../session";


export async function getBranchListById() {
  const session = await getSession();

  const branchRepository = new BranchRepository(session.company_id);
  const result = branchRepository.getBranchListById(session.user_id)

  return result;
}