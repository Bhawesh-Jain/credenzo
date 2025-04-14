"use server"

import { DirectCollectionAccountValues } from "@/app/dashboard/collection/collection-accounts/blocks/CreateAccount";
import { getSession } from "../session";
import { CollectionRepository } from "../repositories/collectionRepository";


export async function createDirectCollectionAccount(data: DirectCollectionAccountValues) {
  const session = await getSession();

  const collectionRepository = new CollectionRepository(session.company_id);
  const result = collectionRepository.createAccount(session.user_id, data)

  return result;
}

export async function getAccountList() {
  const session = await getSession();

  const collectionRepository = new CollectionRepository(session.company_id);
  const result = collectionRepository.getAccountList()

  return result;
}