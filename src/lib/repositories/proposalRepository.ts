import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { ProposalFormValues } from "@/app/dashboard/customer-boarding/create-proposal/page";

export class ProposalRepository extends RepositoryBase {
  private builder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.builder = new QueryBuilder('loan');
    this.companyId = companyId;
  }

  async createProposal(data: ProposalFormValues, userId: string) {
    try {

      var propItem = {
        customer_name: `${data.firstName} ${data.lastName}`,
        email_id: data.email,
        mobile_no: data.phone,
        pan: data.panCard,
        product_id: data.productType,
        loan_amount: data.loanAmount,
        
      }

      const proposal = await this.builder

      return this.failure('Failed!')
      
    } catch (error) {
      return this.handleError(error)
    }
  }
} 