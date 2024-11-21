import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onAnalysisComplete: (data: any) => void;
}

function FileUpload({ onFileUpload, onAnalysisComplete }: FileUploadProps) {
  const validateFileType = (file: File) => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a CSV file');
      return false;
    }
    return true;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (!validateFileType(file)) {
        return;
      }

      onFileUpload(file);
      const formData = new FormData();
      formData.append('file', file);

      try {
        toast.loading('Analyzing data...', { id: 'analyzing' });
        const response = await axios.post('/api/analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data.error) {
          toast.error(response.data.error, { id: 'analyzing' });
          return;
        }

        toast.success('Analysis complete!', { id: 'analyzing' });
        onAnalysisComplete(response.data);
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Error analyzing file';
        toast.error(errorMessage, { id: 'analyzing' });
        console.error('Error:', error);
      }
    }
  }, [onFileUpload, onAnalysisComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
      {isDragActive ? (
        <p className="text-sm text-gray-600">Drop your CSV file here...</p>
      ) : (
        <div>
          <p className="text-sm text-gray-600">
            Drag & drop your CSV file here, or click to select
          </p>
          <p className="text-xs text-gray-500 mt-1">
            CSV must contain:
            <br />
            - 'ds' column with dates (YYYY-MM-DD)
            <br />
            - 'y' column with numeric values
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;