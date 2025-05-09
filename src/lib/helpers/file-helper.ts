import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { FileRepository } from '../repositories/fileRepository';
import { getSession } from '../session';

// Maximum file size in megabytes
const MAX_FILE_SIZE_MB = 20;
const DEFAULT_UPLOAD_DIR = './uploads';

export interface SaveFileResult {
    image: string;
    fileId: number;
    success: true;
}

export interface ErrorResult {
    error: string;
    success: false;
}

type FileResult = SaveFileResult | ErrorResult;

export interface FileLog {
    id: number;
    associated_type: string;
    associated_id: string;
    identifier: string;
    file_name: string;
    file_mime: string;
    dir: string;
    path: string;
    is_protected: number;
    status: number;
    created_on: Date;
    updated_on: Date;
    file_size: string;
}

/**
 * Save or overwrite a file to disk and record it in the database
 */
export async function saveFile(
    file: File,
    fileName: string,
    associatedId = '',
    associatedType = '',
    dirPath = '',
    addedFrom = 'Frontend',
    isProtected = 0
): Promise<FileResult> {
    const uploadDir = dirPath || DEFAULT_UPLOAD_DIR;
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        if (!file) {
            return { error: 'Invalid file', success: false };
        }

        var session = await getSession();

        if (!session) {
            return { error: 'Not Authorized', success: false };
        }

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            return { error: `File exceeds maximum size of ${MAX_FILE_SIZE_MB} MB`, success: false };
        }

        let finalFileName: string;
        let targetPath = path.join(uploadDir, fileName);

        const bufferData = Buffer.from(await file.arrayBuffer());

        finalFileName = `${fileName}_${Date.now()}${path.extname(file.name)}`;
        targetPath = path.join(uploadDir, finalFileName);

        await fsPromises.writeFile(targetPath, bufferData);

        var logResult = await new FileRepository(session.company_id).saveLog({
            associatedType,
            associatedId,
            filePath: targetPath,
            dir: uploadDir,
            fileName: finalFileName,
            fileSize: file.size,
            fileMime: file.type,
            addedFrom,
            is_protected: isProtected
        });

        if (!logResult.success) {
            fsPromises.unlink(targetPath).catch((err) => {
                console.error('Error deleting file after log failure:', err);  
            });
            return { error: logResult.error, success: false };
        }

        const fileId = logResult.result.id;


        return { image: finalFileName, fileId, success: true };
    } catch (err: any) {
        console.error('Error in saveFile:', err);
        return { error: err.message, success: false };
    }
}

/**
 * Get maximum allowed file size
 */
export function getMaxFileSize(readable = false): string | number {
    return readable ? `${MAX_FILE_SIZE_MB} MB` : MAX_FILE_SIZE_MB * 1024 * 1024;
}

/**
 * Retrieve a file record by its identifier
 */
// export async function getFileRecord(identifier: string): Promise<FileLog | null> {
   
// }

/**
 * Construct public URL for a stored file
 */
export function getFileUrl(identifier: string): string {
    return identifier ? `${process.env.BASE_URL}/uploads/${identifier}` : '';
}

/**
 * Deletes a file from disk and marks its database record inactive
 */
export async function deleteFile(
    fileName: string,
    dirPath = ''
): Promise<{ message: string; success: true } | ErrorResult> {
    const uploadDir = dirPath || DEFAULT_UPLOAD_DIR;
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
        return { error: 'File not found', success: false };
    }

    try {
        // TODO: Mark the file as inactive in the database
        
        await fsPromises.unlink(filePath);
       
        
        return { message: 'File deleted successfully', success: true };
    } catch (err: any) {
        console.error('Error deleting file:', err);
        return { error: err.message, success: false };
    }
}
