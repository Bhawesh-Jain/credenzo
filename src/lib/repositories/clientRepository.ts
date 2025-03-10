import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from 'mysql2/promise';

export interface Client {
  id: number
  client_id: string
  lead_id: string
  prop_id: string
  lan: string
  first_name: string
  middle_name: string
  last_name: string
  product_type: string
  phone: string
  pan: string
  email: string
  dob: string
  type: string
  status: string
}

export interface ClientAddress {
  id: number
  client_id: string
  prop_id: string
  lan: string
  line_1: string
  line_2?: string
  line_3?: string
  landmark: string
  pincode: string
  city: string
  state: string
  country: string
  type: string
  ownership: string
  since?: string
  status: number
  updated_by: string
}

export class ClientRepository extends RepositoryBase {
  private builder: QueryBuilder;
  private companyId: string;

  constructor(companyId: string) {
    super()
    this.builder = new QueryBuilder('client');
    this.companyId = companyId;
  }

  private async checkExisting(
    pan: string,
    transactionConnection?: mysql.Connection
  ) {
    try {
      const result = await new QueryBuilder('client')
        .where('pan = ?', pan)
        .where('status = 1')
        .where('company_id = ?', this.companyId)
        .limit(1)
        .setConnection(transactionConnection)
        .select(['client_id'])

      if (result.length > 0) {
        var client = result[0] as any

        return this.success(client['client_id'])
      }

      return this.failure('No Exisiting Record!')

    } catch (error) {
      return this.handleError(error)
    }
  }

  async addClientAddress(
    address: ClientAddress,
    transactionConnection?: mysql.Connection
  ) {
    try {
      const item = {
        client_id: address.client_id,
        prop_id: address.prop_id,
        lan: address.lan,
        line_1: address.line_1,
        line_2: address.line_2,
        line_3: address.line_3,
        landmark: address.landmark,
        pincode: address.pincode,
        city: address.city,
        state: address.state,
        country: address.country,
        type: address.type,
        ownership: address.ownership,
        since: address.since,
        status: address.status,
        updated_by: address.updated_by,
        updated_on: new Date()
      }

      const result = await new QueryBuilder('client_address')
        .setConnection(transactionConnection)
        .insert(item)

      if (result > 0) {
        return this.success("Address Added Successfully!")
      }

      return this.failure("Request Failed!")

    } catch (error) {
      return this.handleError(error)
    }
  }

  async createClient(
    client: Client,
    transactionConnection?: mysql.Connection
  ) {
    try {
      let clientId = '';
      let type = 'EXISTING';
      let clientCheck = await this.checkExisting(client.pan, transactionConnection);

      if (!clientCheck.success) {
        const sql = `
          SELECT max(client_id) as mcid
          FROM client
        `
        let res = await executeQuery(sql, [], transactionConnection) as any
        let mcid = res[0]['mcid']
        clientId = String(mcid + 1);
        type = 'NEW'
      } else {
        clientId = clientCheck.result
      }

      const item = {
        ...client,
        client_id: clientId,
        type,
        company_id: this.companyId,
        updated_on: new Date()
      }

      const result = await this.builder
        .setConnection(transactionConnection)
        .insert(item)

      if (result && result > 0) {
        return this.success({
          insertId: result,
          clientId,
          type
        })
      }

      return this.failure('Failed!')

    } catch (error) {
      return this.handleError(error)
    }
  }
} 