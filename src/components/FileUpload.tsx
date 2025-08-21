import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, AlertCircle, CheckCircle, UploadCloud as CloudUpload, Sparkles } from 'lucide-react';

interface FileUploadProps {
  onProteinLoaded: (proteinId: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onProteinLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(pdb|cif)$/i)) {
      setError('Please upload a .pdb or .cif file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock protein ID
      const proteinId = `protein_${Date.now()}`;
      
      setSuccess(true);
      setTimeout(() => {
        onProteinLoaded(proteinId);
      }, 1000);
      
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all backdrop-blur-sm ${
          isDragging 
            ? 'border-cyan-400 bg-cyan-400/15 shadow-lg shadow-cyan-400/25' 
            : success
            ? 'border-green-400 bg-green-400/15 shadow-lg shadow-green-400/25'
            : error
            ? 'border-red-400 bg-red-400/15 shadow-lg shadow-red-400/25'
            : 'border-slate-600 hover:border-cyan-500/50 hover:bg-slate-700/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          accept=".pdb,.cif"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-6">
            {uploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <CloudUpload className="w-16 h-16 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
              </motion.div>
            ) : success ? (
              <div className="relative">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
              </div>
            ) : error ? (
              <div className="relative">
                <AlertCircle className="w-16 h-16 text-red-400" />
                <div className="absolute inset-0 bg-red-400/20 rounded-full blur-xl animate-pulse" />
              </div>
            ) : (
              <div className="relative">
                <File className="w-16 h-16 text-slate-400" />
                <Sparkles className="w-6 h-6 text-cyan-400 absolute -top-2 -right-2" />
              </div>
            )}
            
            <div>
              <p className="text-xl font-semibold text-white mb-2">
                {uploading ? 'Processing...' : 
                 success ? 'Upload Complete!' :
                 error ? 'Upload Failed' :
                 'Drop your .pdb file here'}
              </p>
              <p className="text-base text-slate-400">
                {uploading ? 'Analyzing structure...' :
                 success ? 'Redirecting to viewer...' :
                 error ? error :
                 'or click to browse files'}
              </p>
            </div>
          </div>
        </label>
      </motion.div>

      <div className="text-center bg-slate-800/30 rounded-xl p-4 backdrop-blur-sm">
        <p className="text-sm text-slate-500 font-medium">
          Supported formats: .pdb, .cif • Max file size: 50MB
        </p>
      </div>
    </div>
  );
};

export default FileUpload;