"use server"

import { LeadFormValues } from "@/app/dashboard/customer-boarding/leads/blocks/CreateLead";
import { LeadRepository } from "../repositories/leadRepository";
import { ProposalFormValues } from "@/app/dashboard/customer-boarding/create-proposal/page";
import { ProposalRepository } from "../repositories/proposalRepository";
import { getSession } from "../session";
import { EditLeadFormValues } from "@/app/dashboard/customer-boarding/leads/blocks/EditLead";

export async function getLeads() {
  const session = await getSession();
  
  const leadRepository = new LeadRepository(session.company_id);
  const result = await leadRepository.getLeadsByUser(session.user_id);

  return result;
}

export async function getLeadById(leadId: number) {
  const session = await getSession();
  
  const leadRepository = new LeadRepository(session.company_id);
  const result = await leadRepository.getLeadsById(leadId);

  return result;
}

export async function editLead(leadId: number, lead: EditLeadFormValues) {
  const session = await getSession();
  
  const leadRepository = new LeadRepository(session.company_id);
  const result = await leadRepository.editLead(leadId, lead);

  return result;
}

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

export async function getPendingApprovals() {
  const session = await getSession();

  const proposalRepository = new ProposalRepository(session.company_id);
  const result = proposalRepository.getPendingApprovals(session.user_id)

  return result;
}

export async function getApprovalDetails(approvalId: number) {
  const session = await getSession();

  const proposalRepository = new ProposalRepository(session.company_id);
  const result = proposalRepository.getApprovalDetails(approvalId)

  return result;
}

export async function processApproval(approvalId: number, decision: string) {
  const session = await getSession();

  const proposalRepository = new ProposalRepository(session.company_id);
  const result = proposalRepository.processApproval(approvalId, decision)

  return result;
}