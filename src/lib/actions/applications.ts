"use server"

import { TeleverificationFormValues } from "@/app/dashboard/applications/televerification/blocks/TeleverificationTab";
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

export async function getTeleverificationCases() {
  const session = await getSession();
  
  const approvedCasesRepository = new ApplicationsRepository(session.company_id);
  const result = await approvedCasesRepository.getTeleverificationCases(session.user_id);

  return result;
}

export async function getFiCases() {
  const session = await getSession();
  
  const approvedCasesRepository = new ApplicationsRepository(session.company_id);
  const result = await approvedCasesRepository.getFiCases(session.user_id);

  return result;
}

export async function submitTeleverification(propId: string, clientId: string, data: TeleverificationFormValues) {
  const session = await getSession();
  
  const approvedCasesRepository = new ApplicationsRepository(session.company_id);
  const result = await approvedCasesRepository.submitTeleverification(session.user_id, propId, clientId, data);

  return result;
}
