import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"
import { DirectCollectionAccountValues } from "@/app/dashboard/collection/collection-accounts/blocks/CreateAccount";
import { CollectionFormValues } from "@/app/dashboard/collection/collection-accounts/blocks/AddCollection";
import { BranchRepository } from "./branchRepository";
import { CompanyRepository } from "./companyRepository";
import { ReceiptFormValues } from "@/app/dashboard/collection/receipting/blocks/create-receipt";

export class CollectionRepository extends RepositoryBase {
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.companyId = companyId;
  }

  async createTransactionEntry(
    userId: string,
    collectionId: number,
    data: ReceiptFormValues,
  ) {
    try {

      return this.failure('Request Failed!')

    } catch (error) {
      return this.handleError(error);
    }
  }
} 