import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { ProposalFormValues } from "@/app/dashboard/customer-boarding/create-proposal/page";
import { LeadRepository } from "./leadRepository";
import { LeadFormValues } from "@/app/dashboard/customer-boarding/create-lead/page";
import { Client, ClientRepository } from "./clientRepository";
import formatDate from "../utils/date";

export class ProposalRepository extends RepositoryBase {
  private builder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.builder = new QueryBuilder('proposals');
    this.companyId = companyId;
  }

  async createProposal(data: ProposalFormValues, userId: string) {
    try {

      const lead: LeadFormValues = {
        firstName: data.firstName,
        lastName: data.lastName,
        amount: data.loanAmount,
        email: data.email,
        gender: data.gender,
        loanType: 'auto',
        phone: data.phone,
        purpose: data.purpose,
        term: 0,
      }

      const leadResult = await new LeadRepository(this.companyId).createLead(userId, lead, 10)

      const client: Client = {
        id: 0,
        client_id: '',
        lead_id: leadResult.result,
        prop_id: '',
        lan: '',
        first_name: data.firstName,
        middle_name: '',
        last_name: data.lastName,
        product_type: data.productType,
        phone: data.phone,
        pan: data.panCard,
        email: data.email,
        dob: formatDate(data.dob.toString()),
        type: '',
        status: '1'
      }

      const clientResult = await new ClientRepository(this.companyId).createClient(client);

      var propItem = {
        lead_id: leadResult.result,
        client_id: clientResult.result,
        handler_id: userId,
        status: 5,
        customer_name: `${data.firstName} ${data.lastName}`,
        email_id: data.email,
        mobile_no: data.phone,
        pan: data.panCard,
        product_id: data.productType,
        loan_amount: data.loanAmount,
        branch_id: data.branch,
        city: data.city,
        state: data.state,
        login_data: new Date(),
        updated_on: new Date(),
      }

      const proposalResult = await this.builder.insert(propItem);

      const clientLoanUpdate = await new QueryBuilder('client')
        .where("id = ?", clientResult.result)
        .update({
          prop_id: proposalResult
        })

      return this.success("Proposal Created!")

      return this.failure('Failed!')

    } catch (error) {
      return this.handleError(error)
    }
  }
} 