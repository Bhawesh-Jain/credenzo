'use server'

import { AccessRepository } from "../repositories/accessRepository";
import { getSession } from "../session";

export async function getRoles() {
  const session = await getSession();
  const accessRepository = new AccessRepository(session.company_id);
  return await accessRepository.getRoles();
}