"use server"

import { LoanProductRepository } from "../repositories/loadProductRepository";
import { getSession } from "../session";


export async function getLoanProductTypes() {
  const session = await getSession();
  
  const loanProductRepository = new LoanProductRepository(session.company_id);
  const result = await loanProductRepository.getLoanProductTypes();


  return result;
}