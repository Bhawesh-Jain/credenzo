"use server"

import { ApprovedCasesRepository } from "../repositories/approvedCaseRepository";
import { getSession } from "../session";


export async function getApprovedCases() {
  const session = await getSession();
  
  const approvedCasesRepository = new ApprovedCasesRepository(session.company_id);
  const result = await approvedCasesRepository.getApprovedCases(session.user_id);

  return result;
}
