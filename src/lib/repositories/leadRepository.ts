import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";

export class LeadRepository extends RepositoryBase {
  private builder: QueryBuilder;

  constructor() {
    super()
    this.builder = new QueryBuilder('info_leads');
  }

  async createLead(
    userId: string, 
    leadData: FormData
  ) {

  }
} 