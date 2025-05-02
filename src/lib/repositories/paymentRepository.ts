import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"



export type PaymentMethod = {
    id: string,
    name: string,
    status: number,
    utr_required: number,
    ledger: number,
}

export class PaymentRepository extends RepositoryBase {
    private companyId: string;

    constructor(companyId: string) {
        super()
        this.companyId = companyId;
    }

    async getPaymentMethod(
        transactionConnection?: mysql.Connection
    ) {
        try {
            const result = await new QueryBuilder('payment_methods')
                .setConnection(transactionConnection)
                .where('status > 0')
                .select()

            if (result.length > 0) {
                return this.success(result);
            }
            return this.failure('No payment method found');
        } catch (error) {
            return this.handleError(error);
        }
    }
} 