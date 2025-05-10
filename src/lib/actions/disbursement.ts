"use server"

import { DisbursementRepository } from "../repositories/disbursementRepository";
import { getSession } from "../session";

export async function getDisbursementCases() {
  const session = await getSession();
    
  const disbursementRepository = new DisbursementRepository(session.company_id);
  const result = await disbursementRepository.getDisbursementList(session.user_id);

  return result;
}