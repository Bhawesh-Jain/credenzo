"use server"

import { ApplicationsRepository } from "../repositories/applicationsRepository";
import { getSession } from "../session";


export async function getApplicationsList() {
  const session = await getSession();
  
  const approvedCasesRepository = new ApplicationsRepository(session.company_id);
  const result = await approvedCasesRepository.getApplicationsList(session.user_id);

  return result;
}

export async function getApprovedCases() {
  const session = await getSession();
  
  const approvedCasesRepository = new ApplicationsRepository(session.company_id);
  const result = await approvedCasesRepository.getApprovedCases(session.user_id);

  return result;
}
