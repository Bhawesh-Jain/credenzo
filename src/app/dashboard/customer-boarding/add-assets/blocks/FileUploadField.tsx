'use client';

import { useState } from 'react';
import { Upload, FileText, Camera, CheckCircle, X } from 'lucide-react';

interface FileState {
  ownershipProof: File | null;
  propertyTaxReceipt: File | null;
  encumbranceCertificate: File | null;
  propertyPhotos: File[];
}

interface FileUploadFieldProps {
  fieldName: keyof FileState;
  label: string;
  required?: boolean;
  note?: string;
  isMultiple?: boolean;
  accept?: string;
  files: FileState;
  dragOver: string;
  onFileUpload: (fieldName: keyof FileState, uploadedFiles: FileList, isMultiple?: boolean) => void;
  onRemoveFile: (fieldName: keyof FileState, index?: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, fieldName: string) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, fieldName: keyof FileState, isMultiple?: boolean) => void;
}

// Fixed FileUploadField component
export const FileUploadField: React.FC<FileUploadFieldProps> = ({ 
  fieldName, 
  label, 
  required = false, 
  note = '', 
  isMultiple = false,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  files,
  dragOver,
  onFileUpload,
  onRemoveFile,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  const currentFiles: File[] = isMultiple && fieldName === 'propertyPhotos' 
    ? files[fieldName] 
    : (files[fieldName] ? [files[fieldName] as File] : []);
  const hasFiles: boolean = currentFiles.length > 0;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {note && <span className="text-gray-500 text-xs ml-2">({note})</span>}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver === fieldName
            ? 'border-blue-400 bg-blue-50'
            : hasFiles
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => onDragOver(e, fieldName)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, fieldName, isMultiple)}
      >
        {hasFiles ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="space-y-1">
              {currentFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 truncate max-w-48">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveFile(fieldName, isMultiple ? index : undefined)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {isMultiple && (
              <p className="text-sm text-gray-600">
                Click or drag to add more files
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              {fieldName === 'propertyPhotos' ? (
                <Camera className="h-8 w-8 text-gray-400" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Drag and drop your file{isMultiple ? 's' : ''} here, or{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept={accept}
                    multiple={isMultiple}
                    onChange={(e) => {
                      if (e.target.files) {
                        onFileUpload(fieldName, e.target.files, isMultiple);
                      }
                    }}
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};