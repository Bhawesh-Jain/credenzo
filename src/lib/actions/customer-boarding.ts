"use server"

import { LeadFormValues } from "@/app/dashboard/customer-boarding/create-lead/page";
import { LeadRepository } from "../repositories/leadRepository";

export async function createLead(userId: string, data: LeadFormValues) {

  const leadRepository = new LeadRepository();
  const result = await leadRepository.createLead(userId, data);


  return result;
}