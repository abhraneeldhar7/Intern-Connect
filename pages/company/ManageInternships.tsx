import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createInternship } from '../../services/mockData';
import { generateJobDescription } from '../../services/geminiService';
import { Sparkles, ArrowLeft } from 'lucide-react';

const ManageInternships = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'On-site',
    salary: '',
    description: '',
    requirements: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIGenerate = async () => {
    if (!formData.title) {
      alert("Please enter a Job Title first.");
      return;
    }
    setIsGenerating(true);
    const description = await generateJobDescription(formData.title, formData.requirements || "General skills");
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    createInternship({
      companyId: user.id,
      companyName: user.companyName || 'Company',
      title: formData.title,
      location: formData.location,
      type: formData.type as any,
      description: formData.description,
      requirements: formData.requirements.split(',').map(s => s.trim()),
      salary: formData.salary
    });

    navigate('/company/dashboard');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <button onClick={() => navigate('/company/dashboard')} className="mb-6 flex items-center text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Post New Internship</h1>
        <p className="text-slate-500 mt-2">Create a compelling listing to attract top students.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Job Title</label>
                <input 
                    type="text" name="title" required
                    value={formData.title} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. Software Engineer Intern"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Location</label>
                <input 
                    type="text" name="location" required
                    value={formData.location} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. New York, NY"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Work Type</label>
                <div className="relative">
                    <select 
                        name="type"
                        value={formData.type} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
                    >
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
            </div>
             <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Salary / Stipend</label>
                <input 
                    type="text" name="salary" required
                    value={formData.salary} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. $25/hr or Unpaid"
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Requirements (comma separated)</label>
            <input 
                type="text" name="requirements" required
                value={formData.requirements} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="React, TypeScript, Figma, Communication..."
            />
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-slate-700">Job Description</label>
                <button 
                    type="button" 
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                    <Sparkles size={14} />
                    {isGenerating ? 'Generating...' : 'Auto-Generate with AI'}
                </button>
            </div>
            <textarea 
                name="description" required
                value={formData.description} onChange={handleChange}
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
                placeholder="Describe the role, responsibilities, and what the student will learn..."
            ></textarea>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button 
                type="button" 
                onClick={() => navigate('/company/dashboard')}
                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all"
            >
                Post Internship
            </button>
        </div>
      </form>
    </div>
  );
};

export default ManageInternships;