
import { useState } from 'react';
import { Upload, FileText, Camera, CheckCircle, X } from 'lucide-react';
import { FileUploadField } from './FileUploadField';


export default function Documents({
  form
}: {
  form: any
}) {
 const [files, setFiles] = useState<FileState>({
    ownershipProof: null,
    propertyTaxReceipt: null,
    encumbranceCertificate: null,
    propertyPhotos: []
  });

  const [dragOver, setDragOver] = useState<string>('');

  const handleFileUpload = (
    fieldName: keyof FileState, 
    uploadedFiles: FileList, 
    isMultiple: boolean = false
  ): void => {
    if (isMultiple && fieldName === 'propertyPhotos') {
      setFiles(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...Array.from(uploadedFiles)]
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        [fieldName]: uploadedFiles[0]
      }));
    }
  };

  const removeFile = (fieldName: keyof FileState, index?: number): void => {
    if (index !== undefined && fieldName === 'propertyPhotos') {
      setFiles(prev => ({
        ...prev,
        [fieldName]: prev[fieldName].filter((_, i) => i !== index)
      }));
    } else {
      setFiles(prev => ({
        ...prev,
        [fieldName]: fieldName === 'propertyPhotos' ? [] : null
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, fieldName: string): void => {
    e.preventDefault();
    setDragOver(fieldName);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver('');
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>, 
    fieldName: keyof FileState, 
    isMultiple: boolean = false
  ): void => {
    e.preventDefault();
    setDragOver('');
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(fieldName, droppedFiles, isMultiple);
    }
  };

  const handleSubmit = (): void => {
    console.log('Files to upload:', files);
    alert('Form submitted! Check console for file details.');
  };

  const isFormValid: boolean = Boolean(files.ownershipProof && files.propertyTaxReceipt);


  return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Property Document Upload
        </h1>
        <p className="text-gray-600">
          Please upload the required documents to proceed with your property verification.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6">
          <FileUploadField
            fieldName="ownershipProof"
            label="Upload Ownership Proof"
            required={true}
            files={files}
            dragOver={dragOver}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />

          <FileUploadField
            fieldName="propertyTaxReceipt"
            label="Property Tax Receipt"
            required={true}
            files={files}
            dragOver={dragOver}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />

          <FileUploadField
            fieldName="encumbranceCertificate"
            label="Encumbrance Certificate"
            note="Optional but useful"
            files={files}
            dragOver={dragOver}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />

          <FileUploadField
            fieldName="propertyPhotos"
            label="Photographs of Property"
            note="Optional"
            isMultiple={true}
            accept=".jpg,.jpeg,.png,.webp"
            files={files}
            dragOver={dragOver}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="text-red-500">*</span> Required fields
            </div>
          
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`px-6 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isFormValid
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                Submit Documents
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}