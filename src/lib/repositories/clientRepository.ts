import { QueryBuilder, executeQuery } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";

export interface Client {
  id: number
  client_id: string
  lead_id: string
  loan_id: string
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
    pan: string
  ) {
    try {

      const result = await this.builder
        .where('pan = ?', pan)
        .where('status = 1')
        .limit(1)
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

  async createClient(client: Client) {
    try {
      let clientId = '';
      let type = 'NEW';
      let clientCheck = await this.checkExisting(client.pan);

      if (!clientCheck.success) {
        const sql = `
          SELECT max(client_id) as mcid
          FROM client
        `
        let res = await executeQuery(sql) as any
        let mcid = res[0]['mcid']
        clientId = String(mcid + 1);
        type = 'EXISTING'
      } else {
        clientId = clientCheck.result
      }

      const item = {
        ...client,
        client_id: clientId,
        type,
        updated_on: new Date()
      }

      const result = await this.builder.insert(item)

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