import api from './api';

export const resumeService = {
  // Get all uploaded resumes for the dashboard
  getResumes: async () => {
    const response = await api.get('/resume');
    return response.data;
  },
  
  // Upload a resume
  uploadResume: async (fileData) => {
    const response = await api.post('/resume/upload', fileData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Analyze uploaded resume
  analyzeResume: async (resumeId, jobDescription = 'General Role') => {
    const response = await api.post(`/analyze/resume/${resumeId}`, { jobDescription });
    return response.data;
  },
  
  // Get analysis results for a specific resume
  getAnalysis: async (id) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  }
};
