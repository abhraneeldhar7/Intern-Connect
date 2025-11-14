import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getStudentApplications, updateUserProfile, withdrawApplication } from '../../services/mockData';
import { CheckCircle, Clock, XCircle, User as UserIcon, Save, Trash2 } from 'lucide-react';
import { ApplicationStatus } from '../../types';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'profile'>('overview');
  
  // State for data refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refresh = () => setRefreshTrigger(prev => prev + 1);

  const applications = user ? getStudentApplications(user.id) : [];

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
      name: user?.name || '',
      university: user?.university || '',
      skills: user?.skills?.join(', ') || '',
      avatarUrl: user?.avatarUrl || ''
  });

  // Stats
  const applied = applications.length;
  const interview = applications.filter(a => a.status === ApplicationStatus.SHORTLISTED).length;
  const accepted = applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length;
  const rejected = applications.filter(a => a.status === ApplicationStatus.REJECTED).length;

  const chartData = [
    { name: 'Applied', count: applied },
    { name: 'Interview', count: interview },
    { name: 'Offer', count: accepted },
    { name: 'Rejected', count: rejected },
  ];

  const handleProfileUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      if(!user) return;
      updateUserProfile(user.id, {
          name: profileForm.name,
          university: profileForm.university,
          skills: profileForm.skills.split(',').map(s => s.trim()),
          avatarUrl: profileForm.avatarUrl
      });
      alert("Profile updated successfully!");
      window.location.reload(); // Simple reload to reflect context changes fully
  };

  const handleWithdraw = (appId: string) => {
      if(window.confirm("Are you sure you want to withdraw this application?")) {
          withdrawApplication(appId);
          refresh();
      }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';
      case ApplicationStatus.SHORTLISTED: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name} 👋</h1>
        <p className="text-slate-500">Manage your career journey from one place.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-8">
          {['overview', 'applications', 'profile'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 text-sm font-semibold capitalize transition-colors relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
              </button>
          ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Clock size={24} /></div>
                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Applications</span>
                </div>
                <h3 className="text-4xl font-bold text-slate-900">{applied}</h3>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><CheckCircle size={24} /></div>
                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Shortlisted</span>
                </div>
                <h3 className="text-4xl font-bold text-slate-900">{interview}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={24} /></div>
                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Offers</span>
                </div>
                <h3 className="text-4xl font-bold text-slate-900">{accepted}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-6">Application Status</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                            />
                            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={50} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {applications.slice(0, 5).map(app => (
                        <div key={app.id} className="flex items-start gap-4">
                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${app.status === 'accepted' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                            <div>
                                <p className="text-sm font-bold text-slate-900">{app.internshipTitle}</p>
                                <p className="text-xs text-slate-500 mb-1">{app.companyName}</p>
                                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </span>
                            </div>
                        </div>
                        ))}
                        {applications.length === 0 && <p className="text-slate-400 text-sm italic">No activity yet.</p>}
                    </div>
                </div>
            </div>
          </div>
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900">My Applications</h3>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                          <tr>
                              <th className="px-6 py-4">Role</th>
                              <th className="px-6 py-4">Company</th>
                              <th className="px-6 py-4">Applied On</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {applications.map(app => (
                              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-slate-900">{app.internshipTitle}</td>
                                  <td className="px-6 py-4">{app.companyName}</td>
                                  <td className="px-6 py-4">{app.appliedDate}</td>
                                  <td className="px-6 py-4">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                                          {app.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <button 
                                        onClick={() => handleWithdraw(app.id)}
                                        className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                                      >
                                          <Trash2 size={14} /> Withdraw
                                      </button>
                                  </td>
                              </tr>
                          ))}
                          {applications.length === 0 && (
                              <tr>
                                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                      You haven't applied to any internships yet.
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
          <div className="max-w-2xl animate-fade-in">
              <form onSubmit={handleProfileUpdate} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-6 mb-6">
                      <img src={profileForm.avatarUrl || user?.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-100" />
                      <div>
                          <h3 className="text-lg font-bold text-slate-900">Profile Details</h3>
                          <p className="text-sm text-slate-500">Update your public information.</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                          <input 
                              type="text" 
                              value={profileForm.name}
                              onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">University / College</label>
                          <input 
                              type="text" 
                              value={profileForm.university}
                              onChange={e => setProfileForm({...profileForm, university: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Skills (comma separated)</label>
                          <textarea 
                              value={profileForm.skills}
                              onChange={e => setProfileForm({...profileForm, skills: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                              rows={3}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Avatar URL</label>
                          <input 
                              type="text" 
                              value={profileForm.avatarUrl}
                              onChange={e => setProfileForm({...profileForm, avatarUrl: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          />
                      </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                          <Save size={18} /> Save Changes
                      </button>
                  </div>
              </form>
          </div>
      )}
    </div>
  );
};

export default StudentDashboard;