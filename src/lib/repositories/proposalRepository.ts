import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import { ProposalFormValues } from "@/app/dashboard/customer-boarding/create-proposal/page";
import { LeadRepository } from "./leadRepository";
import { LeadFormValues } from "@/app/dashboard/customer-boarding/leads/blocks/CreateLead";
import { Client, ClientAddress, ClientRepository } from "./clientRepository";
import { withTransaction } from "../helpers/db-helper";
import formatDate from "../utils/date";
import mysql from 'mysql2/promise';
import { UserRepository } from "./userRepository";
import { getSession } from "../session";

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

  private async generatePropNo(leadId: string) {
    const session = await getSession();
    const abbr = session.company_abbr;
    const totalLength = 16;

    const paddingLength = totalLength - abbr.length - leadId.length;
    const zeros = paddingLength > 0 ? '0'.repeat(paddingLength) : '';

    const propNo = abbr + zeros + leadId;
    return propNo;
  }


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

      const leadResult = await new LeadRepository(this.companyId).createLead(userId, lead, 15, transactionConnection)

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
        status: '1',
        income_emp_type: data.empType,
        income_entity_name: data.entityName,
        income_amount: data.incomeAmount,
        income_freq: 'Monthly',
        income_address: data.incomeAddress,
        income_contact: data.incomeContact,
      }

      const clientResult = await new ClientRepository(this.companyId).createClient(client, transactionConnection);

      let propNo = await this.generatePropNo(String(leadResult.result));

      var propItem = {
        lead_id: leadResult.result,
        client_id: clientResult.result.clientId,
        lan: null,
        loan_id: null,
        prop_no: propNo,
        handler_id: userId,
        company_id: this.companyId,
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

  async getPendingApprovals(
    userId: string,
  ) {
    try {

      const userResult = await new UserRepository(this.companyId).getUserById(userId);

      if (!userResult.success) {
        return this.failure(userResult.error)
      }

      const userBranches = await new UserRepository(this.companyId).getUserBranchesById(userId);

      let branchList = userBranches.result as any[];

      branchList = branchList.map(item => item.branch_id)

      let branches = branchList.join(',').toString();

      const user = userResult.result;

      let sql = `
        SELECT 
            p.*,  
            br.name AS branch_name, br.status AS branch_status,  
            lpt.name AS product_name,  
            ms.label AS status_label,  
            u.name AS handler_name  
        FROM proposals p  
        LEFT JOIN branches br ON p.branch_id = br.id  
        LEFT JOIN loan_product_type lpt ON lpt.id = p.product_id  
        LEFT JOIN master_status ms ON ms.status = p.status  
        LEFT JOIN users u ON u.id = p.handler_id  
        WHERE p.branch_id IN (${branches})  
          AND p.status > 0  
          AND p.company_id = ?  
    `

      const result = await executeQuery<any[]>(sql, [this.companyId]);
      
      if (result.length > 0) {
        return this.success(result)
      }

      return this.failure('No Proposals Found!')
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getApprovalDetails(
    approvalId: number,
  ) {
    try {

      let sql = `
        SELECT 
            p.*,  
            br.name AS branch_name, br.status AS branch_status,  
            c.phone, c.email, c.type as customer_type,
            lpt.name AS product_name,  
            ms.label AS status_label,  
            u.name AS handler_name
        FROM proposals p  
        LEFT JOIN branches br ON p.branch_id = br.id  
        LEFT JOIN loan_product_type lpt ON lpt.id = p.product_id  
        LEFT JOIN master_status ms ON ms.status = p.status  
        LEFT JOIN users u ON u.id = p.handler_id  
        LEFT JOIN client c ON c.client_id = p.client_id
          AND c.prop_id = p.id
        WHERE p.id = ?
      `

      const result = await executeQuery<any[]>(sql, [approvalId]);
      
      if (result.length > 0) {
        return this.success(result[0])
      }

      return this.failure('No Proposals Found!')
    } catch (error) {
      return this.handleError(error)
    }
  }
} 