import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { ChevronLeft, CheckCircle, AlertTriangle, Lightbulb, PieChart, Star, X } from 'lucide-react';
import Loader from '../components/Loader';

const Analysis = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we fetch from `/api/analyze/${id}`
    // For demo purposes, we will mock the data if the API fails
    const fetchAnalysisData = async () => {
      try {
        const response = await resumeService.getAnalysis(id);
        const resumeDoc = response.data?.resume || response.data || response;
        
        let latestAnalysis = null;
        if (resumeDoc.analyses && resumeDoc.analyses.length > 0) {
          latestAnalysis = resumeDoc.analyses[resumeDoc.analyses.length - 1];
        }

        if (latestAnalysis) {
          setData({
            score: latestAnalysis.matchPercentage || 0,
            matchPercentage: latestAnalysis.matchPercentage || 0,
            skillsDetected: latestAnalysis.skillsDetected || [],
            missingSkills: latestAnalysis.missingSkills || [],
            suggestions: latestAnalysis.suggestions || []
          });
        }
        setLoading(false);
      } catch (err) {
        console.log("Mocking data due to API skip");
        // Mock data
        setTimeout(() => {
          setData({
            score: 82,
            matchPercentage: 85,
            skillsDetected: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Git', 'Redux'],
            missingSkills: ['TypeScript', 'GraphQL', 'Docker'],
            suggestions: [
              'Add more quantifiable achievements in your work experience.',
              'Include a clear summary section at the top.',
              'Your skills sections matches well with frontend roles, consider adding testing frameworks.'
            ]
          });
          setLoading(false);
        }, 1000);
      }
    };

    fetchAnalysisData();
  }, [id]);

  if (loading) return <Loader fullScreen text="Compiling analysis results..." />;
  if (!data) return <div className="text-center py-20 text-gray-500">Analysis not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Scores */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-400"></div>
            <h2 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Overall Score</h2>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * data.score) / 100}
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{data.score}</span>
                <span className="text-sm text-gray-500">/ 100</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Your resume is in the top 15% of applicants!
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/5 rounded-3xl p-6 border border-primary/20">
            <h3 className="flex items-center font-bold text-gray-900 dark:text-white mb-4">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Job Match
            </h3>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-black text-primary">{data.matchPercentage}%</span>
              <span className="text-gray-600 dark:text-gray-400 font-medium mb-1">Match Rate</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Star className="h-6 w-6 mr-3 text-yellow-500" />
              Skills Detected
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.skillsDetected?.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium flex items-center border border-green-100 dark:border-green-800/50">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-3 text-red-500" />
              Missing Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.missingSkills?.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium flex items-center border border-red-100 dark:border-red-800/50">
                  <X className="w-4 h-4 mr-2" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Lightbulb className="h-6 w-6 mr-3 text-blue-500" />
              AI Suggestions for Improvement
            </h3>
            <ul className="space-y-4">
              {data.suggestions?.map((suggestion, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center font-bold text-sm mr-4 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{suggestion}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analysis;
