import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCompanyApplications, updateApplicationStatus } from '../../services/mockData';
import { Application, ApplicationStatus } from '../../types';
import { analyzeResumeMatch } from '../../services/geminiService';

const ViewApplicants = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>(user ? getCompanyApplications(user.id) : []);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(appId, newStatus);
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
  };

  const handleAnalyze = async (appId: string) => {
    setAiAnalysis(prev => ({...prev, [appId]: 'Analyzing...'}));
    // Mock analysis since we don't have full resume text in the mock data
    const result = await analyzeResumeMatch("React, TS, Node experience", "Frontend Engineering Intern");
    setAiAnalysis(prev => ({...prev, [appId]: result}));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Applicants</h1>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
         {applications.length === 0 ? (
             <div className="p-12 text-center text-slate-500">No applicants found yet.</div>
         ) : (
             <div className="divide-y divide-slate-100">
                 {applications.map(app => (
                     <div key={app.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                         <div className="flex-1">
                             <div className="flex items-center gap-3 mb-1">
                                 <h3 className="font-bold text-slate-900">{app.studentName}</h3>
                                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Applied: {app.appliedDate}</span>
                             </div>
                             <p className="text-sm text-indigo-600 font-medium mb-2">{app.internshipTitle}</p>
                             <p className="text-sm text-slate-600 line-clamp-2 mb-2">"{app.coverLetter}"</p>
                             
                             {/* AI Analysis Result */}
                             {aiAnalysis[app.id] && (
                                 <div className="mt-2 p-3 bg-indigo-50 text-indigo-900 text-xs rounded border border-indigo-100">
                                     <strong>AI Insight:</strong> {aiAnalysis[app.id]}
                                 </div>
                             )}
                         </div>
                         
                         <div className="flex flex-col items-end gap-3 min-w-[200px]">
                             <div className="flex items-center gap-2">
                                 <select 
                                     value={app.status}
                                     onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                     className="text-sm border-slate-200 rounded-lg shadow-sm focus:ring-indigo-500 py-1.5 pl-3 pr-8"
                                 >
                                     <option value={ApplicationStatus.PENDING}>Pending</option>
                                     <option value={ApplicationStatus.SHORTLISTED}>Shortlist</option>
                                     <option value={ApplicationStatus.ACCEPTED}>Accept</option>
                                     <option value={ApplicationStatus.REJECTED}>Reject</option>
                                 </select>
                             </div>
                             <button 
                                onClick={() => handleAnalyze(app.id)}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
                             >
                                Analyze Resume Match
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>
    </div>
  );
};

export default ViewApplicants;