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
      console.log('pan', pan);

      const result = await new QueryBuilder('client')
        .where('pan = ?', pan)
        .where('status = 1')
        .where('company_id = ?', this.companyId)
        .limit(1)
        .setConnection(transactionConnection)
        .select(['client_id'])

      console.log('result', result);
      

      if (result.length > 0) {
        var client = result[0] as any

        return this.success(client['client_id'])
      }

      return this.failure('No Exisiting Record!')

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
      console.log('check', clientCheck);
      
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