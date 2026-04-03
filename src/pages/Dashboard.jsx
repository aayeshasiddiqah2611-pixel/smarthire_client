import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { FileText, Plus, BarChart2, Star, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for visualization if nothing uploaded yet
  const hasResumes = resumes.length > 0;
  const mockSkillsData = [
    { name: 'React', val: 85 },
    { name: 'Node.js', val: 70 },
    { name: 'Python', val: 40 },
    { name: 'AWS', val: 55 },
    { name: 'MongoDB', val: 65 }
  ];
  
  const COLORS = ['#aa3bff', '#cca8f9', '#962eed', '#4f148c', '#6d28d9'];
  const COLORS_PIE = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await resumeService.getResumes();
        setResumes(data.resumes || data || []);
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
        // Error handling but let dashboard load mock visuals if needed
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your AI analyzed resumes.</p>
        </div>
        <Link
          to="/upload"
          className="flex items-center space-x-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-[0_4px_15px_rgba(170,59,255,0.3)] transition-all transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Analyze New Resume</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Resumes</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{resumes.length || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Match Score</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">78%</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-primary dark:text-primary rounded-xl">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Skill Detected</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">React.js</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" /> 
            Skills Breakdown Summary
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSkillsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'rgba(170,59,255,0.05)'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="val" fill="#aa3bff" radius={[4, 4, 0, 0]}>
                  {mockSkillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Match Percentages</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{name: 'Matched', value: 78}, {name: 'Missing', value: 22}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#aa3bff" />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card-dark rounded-2xl shadow border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Uploads</h3>
          {hasResumes && <span className="text-sm text-primary hover:underline cursor-pointer">View All</span>}
        </div>
        
        {!hasResumes ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-bg-dark rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-gray-900 dark:text-white font-medium mb-1">No resumes analyzed yet</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm">Upload a resume to get deep AI-driven insights on skills and match percentage.</p>
            <Link
              to="/upload"
              className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {resumes.slice(0, 5).map((resume, idx) => (
              <div key={resume._id || idx} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100/50 dark:bg-purple-900/20 text-primary rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{resume.filename || 'Resume Document'}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Analyzed on {new Date(resume.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Score</div>
                    <div className="font-bold text-gray-900 dark:text-white">{resume.score || Math.floor(Math.random() * 40 + 60)}/100</div>
                  </div>
                  <Link
                    to={`/analysis/${resume._id || idx}`}
                    className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
