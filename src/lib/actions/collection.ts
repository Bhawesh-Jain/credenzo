"use server"

import { DirectCollectionAccountValues } from "@/app/dashboard/collection/collection-accounts/blocks/CreateAccount";
import { getSession } from "../session";
import { CollectionRepository } from "../repositories/collectionRepository";
import { EditDirectCollectionAccountValues } from "@/app/dashboard/collection/collection-accounts/blocks/EditAccount";
import { CollectionFormValues } from "@/app/dashboard/collection/collection-accounts/blocks/AddCollection";
import { PaymentRepository } from "../repositories/paymentRepository";
import { ReceiptFormValues } from "@/app/dashboard/collection/receipting/blocks/create-receipt";


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

export async function getCollectionList() {
  const session = await getSession();

  const collectionRepository = new CollectionRepository(session.company_id);
  const result = collectionRepository.getCollectionList(session.user_id)

  return result;
}

export async function getCollectionUserList(branchId: string) {
  const session = await getSession();

  const collectionRepository = new CollectionRepository(session.company_id);
  const result = collectionRepository.getCollectionUsers(branchId)

  return result;
}

export async function getCollectionDetailById(collectionId: number) {
  const session = await getSession();

  const collectionRepository = new CollectionRepository(session.company_id);
  const result = collectionRepository.getCollectionDetailById(collectionId)

  return result;
}

export async function getPaymentMethod() {
  const session = await getSession();

  const paymentRepository = new PaymentRepository(session.company_id);
  const result = paymentRepository.getPaymentMethod()

  return result;
}

export async function createReceipt(collectionId: number, data: ReceiptFormValues) {
  const session = await getSession();

  const collectionRepository = new CollectionRepository(session.company_id);
  const result = collectionRepository.createReceipt(session.user_id, collectionId, data)

  return result;
}

// EXTERNAL API ACCESS
export async function getReceiptById(receiptId: string) {

  const collectionRepository = new CollectionRepository('1');
  const result = collectionRepository.getReceiptById(receiptId)

  return result;
}