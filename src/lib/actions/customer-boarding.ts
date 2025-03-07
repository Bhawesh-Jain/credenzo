"use server"

import { LeadFormValues } from "@/app/dashboard/customer-boarding/create-lead/page";
import { LeadRepository } from "../repositories/leadRepository";
import { ProposalFormValues } from "@/app/dashboard/customer-boarding/create-proposal/page";
import { ProposalRepository } from "../repositories/proposalRepository";
import { getSession } from "../session";

export async function createLead(userId: string, data: LeadFormValues) {
  const session = await getSession();
  
  const leadRepository = new LeadRepository(session.company_id);
  const result = await leadRepository.createLead(userId, data);

  return result;
}

export async function createProposal(data:ProposalFormValues) {
  const session = await getSession();

  const proposalRepository = new ProposalRepository(session.company_id);
  const result = proposalRepository.createProposal(data, session.user_id)

  return result;
}