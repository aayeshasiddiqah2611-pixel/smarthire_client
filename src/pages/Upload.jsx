import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { resumeService } from '../services/resumeService';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      // Upload the file first
      const uploadResp = await resumeService.uploadResume(formData);
      const resumeId = uploadResp.data?.resume?.id || uploadResp._id;
      
      if (!resumeId) throw new Error("Failed to receive resume ID from server");

      // Trigger Analysis
      await resumeService.analyzeResume(resumeId);

      navigate(`/analysis/${resumeId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to analyze resume. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Analyze Your Resume</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Upload your resume below. Our AI will analyze your skills, experience, and formatting to provide you with actionable insights and a match score.
        </p>
      </div>

      <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl shadow-primary/5 border border-gray-100 dark:border-gray-800 p-8 sm:p-12 overflow-hidden relative">
        {/* Background decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl"></div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center border border-red-100 dark:border-red-900/50">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all
              ${isDragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-gray-300 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            
            <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
              <UploadIcon className="h-10 w-10" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drag & Drop your resume here
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">
              Supports: PDF, DOC, DOCX (Max 5MB)
            </p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium transition-colors"
            >
              Browse Files
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="flex items-center p-6 border border-primary/20 bg-primary/5 rounded-2xl mb-8 relative">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl mr-4 shadow-sm text-primary">
                <FileText className="h-8 w-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-gray-900 dark:text-white font-medium truncate pr-8">{file.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={removeFile}
                className="absolute top-6 right-6 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-[0_5px_20px_rgba(170,59,255,0.4)] transition-all font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isUploading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></span>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Start Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
