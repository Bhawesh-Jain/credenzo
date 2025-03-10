"use server"

import { LeadFormValues } from "@/app/dashboard/customer-boarding/create-lead/page";
import { LeadRepository } from "../repositories/leadRepository";
import { ProposalFormValues } from "@/app/dashboard/customer-boarding/create-proposal/page";
import { ProposalRepository } from "../repositories/proposalRepository";
import { getSession } from "../session";

export async function createLead(data: LeadFormValues) {
  const session = await getSession();
  
  const leadRepository = new LeadRepository(session.company_id);
  const result = await leadRepository.createLead(session.user_id, data);

  return result;
}

export async function createProposal(data:ProposalFormValues) {
  const session = await getSession();

  const proposalRepository = new ProposalRepository(session.company_id);
  const result = proposalRepository.createProposalWithTransaction(data, session.user_id, session.company_id)

  return result;
}