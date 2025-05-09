import { QueryBuilder } from "../helpers/db-helper";
import { RepositoryBase } from "../helpers/repository-base";
import mysql from "mysql2/promise"



export type FileLog = {
    id: string,
    name: string,
    status: number,
    utr_required: number,
    ledger: number,
}

export class FileRepository extends RepositoryBase {
    private companyId: string;

    constructor(companyId: string) {
        super()
        this.companyId = companyId;
    }

    async saveLog({
        associatedType,
        associatedId,
        filePath,
        dir,
        fileName,
        fileSize,
        fileMime,
        fileType = 'image',
        addedFrom = 'default',
        is_protected = 0,
        transactionConnection
    }: {
        associatedType: string,
        associatedId: string,
        filePath: string,
        dir: string,
        fileName: string,
        fileSize: number,
        fileMime: string,
        fileType?: string,
        addedFrom?: string,
        is_protected?: number,
        transactionConnection?: mysql.Connection
    }) {
        try {
            const result = await new QueryBuilder('file_log')
                .setConnection(transactionConnection)
                .insert({
                    associated_type: associatedType,
                    associated_id: associatedId,
                    added_from: addedFrom,
                    dir: dir,
                    path: filePath,
                    file_name: fileName,
                    file_size: fileSize,
                    file_mime: fileMime,
                    file_type: fileType,
                    is_protected: is_protected,
                    copmany_id: this.companyId,
                    status: 1,
                })

            if (result > 0) {
                return this.success(result);
            }
            return this.failure('Failed to save file log');
        } catch (error) {
            return this.handleError(error);
        }
    }
} 