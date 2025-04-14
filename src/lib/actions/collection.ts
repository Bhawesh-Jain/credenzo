"use server"

import { DirectCollectionAccountValues } from "@/app/dashboard/collection/collection-accounts/blocks/CreateAccount";
import { getSession } from "../session";
import { CollectionRepository } from "../repositories/collectionRepository";
import { EditDirectCollectionAccountValues } from "@/app/dashboard/collection/collection-accounts/blocks/EditAccount";
import { CollectionFormValues } from "@/app/dashboard/collection/collection-accounts/blocks/AddCollection";


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

export async function updateDirectCollectionAccount(data: EditDirectCollectionAccountValues) {
  const session = await getSession();
  const collectionRepository = new CollectionRepository(session.company_id);
  const result = await collectionRepository.updateAccount(
    data.id,
    session.user_id,
    data
  );
  return result;
}

export async function createCollection(data: CollectionFormValues) {
  const session = await getSession();

  const collectionRepository = new CollectionRepository(session.company_id);
  const result = collectionRepository.createCollection(session.user_id, data)

  return result;
}
