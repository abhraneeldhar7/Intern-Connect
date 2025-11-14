import React, { useState } from 'react';
import { getInternships, applyToInternship } from '../../services/mockData';
import { Search, MapPin, DollarSign, Filter, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Internship } from '../../types';

const BrowseInternships = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // Fetch every render to ensure we see new updates from other tabs if simulated correctly
  const internships = getInternships();

  const filtered = internships.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          i.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || i.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleApply = (internship: Internship) => {
    if (!user) return;
    setApplyingId(internship.id);
    setTimeout(() => {
      applyToInternship(user, internship);
      setApplyingId(null);
      alert(`Application successfully sent to ${internship.companyName}!`);
    }, 800);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Find your next opportunity</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by job title, skill, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="relative w-full md:w-64">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <select 
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
             >
               <option value="All">All Types</option>
               <option value="Remote">Remote</option>
               <option value="On-site">On-site</option>
               <option value="Hybrid">Hybrid</option>
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
             </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filtered.map(internship => (
          <div key={internship.id} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                     <Briefcase size={20} />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{internship.title}</h3>
                     <p className="text-slate-500 font-medium">{internship.companyName}</p>
                   </div>
                </div>
                
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-500 mt-4 mb-4">
                  <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {internship.location}</span>
                  <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-slate-400" /> {internship.salary}</span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-md text-xs font-bold text-slate-600 uppercase tracking-wide">{internship.type}</span>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6 max-w-3xl">{internship.description}</p>

                <div className="flex gap-2 flex-wrap">
                  {internship.requirements.map(req => (
                    <span key={req} className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium shadow-sm">{req}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[140px] pt-2">
                <button 
                  onClick={() => handleApply(internship)}
                  disabled={!!applyingId}
                  className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {applyingId === internship.id ? 'Sending...' : 'Apply Now'}
                </button>
                <button className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Save
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
                <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No internships found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseInternships;