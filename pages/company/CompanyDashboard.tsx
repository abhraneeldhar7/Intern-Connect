import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCompanyInternships, getCompanyApplications, deleteInternship } from '../../services/mockData';
import { Users, Briefcase, Eye, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const internships = user ? getCompanyInternships(user.id) : [];
  const applications = user ? getCompanyApplications(user.id) : [];

  const handleDelete = (id: string) => {
      if (confirm("Are you sure you want to delete this internship listing? This action cannot be undone.")) {
          deleteInternship(id);
          setRefreshTrigger(prev => prev + 1);
      }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Company Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your recruitment pipeline.</p>
        </div>
        <Link to="/company/create" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2">
            <Plus size={20} /> Post New Internship
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={22}/></div>
                <span className="text-slate-500 font-bold text-sm uppercase">Active Listings</span>
            </div>
            <p className="text-4xl font-bold text-slate-900">{internships.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><Users size={22}/></div>
                <span className="text-slate-500 font-bold text-sm uppercase">Total Applicants</span>
            </div>
            <p className="text-4xl font-bold text-slate-900">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><Eye size={22}/></div>
                <span className="text-slate-500 font-bold text-sm uppercase">Total Views</span>
            </div>
            <p className="text-4xl font-bold text-slate-900">{(internships.length * 45) + 120}</p> {/* Simulated stats */}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900">Your Listings</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">Job Title</th>
                        <th className="px-6 py-4">Posted Date</th>
                        <th className="px-6 py-4">Applicants</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {internships.map(i => (
                        <tr key={i.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-bold text-slate-900">{i.title}</td>
                            <td className="px-6 py-4">{i.postedDate}</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    {i.applicantsCount} Candidates
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-4">
                                    <Link to="/company/applicants" className="text-indigo-600 hover:text-indigo-800 font-medium">View Applicants</Link>
                                    <button 
                                        onClick={() => handleDelete(i.id)}
                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                        title="Delete Listing"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {internships.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                No active internships. Post one to get started!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;