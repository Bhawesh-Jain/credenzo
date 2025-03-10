import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { ProposalFormValues } from "@/app/dashboard/customer-boarding/create-proposal/page";
import { LeadRepository } from "./leadRepository";
import { LeadFormValues } from "@/app/dashboard/customer-boarding/create-lead/page";
import { Client, ClientAddress, ClientRepository } from "./clientRepository";
import { withTransaction } from "../helpers/db-helper";
import formatDate from "../utils/date";
import mysql from 'mysql2/promise';

export class ProposalRepository extends RepositoryBase {
  private builder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.builder = new QueryBuilder('proposals');
    this.companyId = companyId;
  }

  async createProposalWithTransaction(
    data: ProposalFormValues,
    userId: string,
    companyId: string
  ) {
    return withTransaction(async (connection) => {
      const proposalRepo = new ProposalRepository(companyId);
      return proposalRepo.createProposal(data, userId, connection);
    });
  };


  async createProposal(
    data: ProposalFormValues,
    userId: string,
    transactionConnection?: mysql.Connection
  ) {
    try {
      const lead: LeadFormValues = {
        firstName: data.firstName,
        lastName: data.lastName,
        amount: data.loanAmount,
        email: String(data.email),
        gender: data.gender,
        loanType: data.productType,
        phone: data.phone,
        purpose: data.purpose,
        term: 0,
        notes: 'Direct proposal'
      }

      const leadResult = await new LeadRepository(this.companyId).createLead(userId, lead, 10, transactionConnection)

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
        email: String(data.email),
        dob: formatDate(data.dob.toString()),
        type: '',
        status: '1'
      }

      const clientResult = await new ClientRepository(this.companyId).createClient(client, transactionConnection);

      var propItem = {
        lead_id: leadResult.result,
        client_id: clientResult.result.clientId,
        lan: null,
        loan_id: null,
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
        login_date: new Date(),
        updated_on: new Date(),
      }

      const proposalResult = await this.builder
        .setConnection(transactionConnection)
        .insert(propItem);

      const clientLoanUpdate = await new QueryBuilder('client')
        .setConnection(transactionConnection)
        .where("id = ?", clientResult.result.insertId)
        .update({
          prop_id: proposalResult
        })

      const address: ClientAddress = {
        id: 0,
        client_id: clientResult.result.clientId,
        prop_id: String(proposalResult),
        lan: '',
        line_1: data.add_line_1,
        line_2: data.add_line_2,
        line_3: data.add_line_3,
        landmark: data.landmark,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        country: String(process.env.DEFAULT_COUNTRY),
        type: 'PERMANENT',
        ownership: data.ownership,
        since: data.since,
        status: 1,
        updated_by: userId,
      }

      const addressResult = await new ClientRepository(this.companyId).addClientAddress(
        address,
        transactionConnection
      )

      return this.success("Proposal Created!")
    } catch (error) {
      return this.handleError(error)
    }
  }
} 