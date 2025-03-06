import { LeadFormValues } from "@/app/dashboard/customer-boarding/create-lead/page";
import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";

export class LeadRepository extends RepositoryBase {
  private builder: QueryBuilder;

  constructor() {
    super()
    this.builder = new QueryBuilder('leads');
  }

  async createLead(
    userId: string,
    leadData: LeadFormValues
  ) {
    try {
      const lead = {
        updated_by: userId,
        customer_name: leadData.firstName + " " + leadData.lastName,
        phone: leadData.phone,
        email: leadData.email,
        gender: leadData.gender,
        product_type: leadData.loanType,
        loan_amount: leadData.amount,
        loan_purpose: leadData.purpose,
        term: leadData.term,
        remark: leadData.notes,
        status: 1,
        updated_on: new Date(),
      }


      const result = await this.builder.insert(lead);

      return this.success(result);
    } catch (error) {
      return this.handleError(error);
    }
  }
} 