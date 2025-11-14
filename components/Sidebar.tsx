import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/internships', label: 'Browse Internships', icon: <Briefcase size={20} /> },
    { path: '/applications', label: 'My Applications', icon: <FileText size={20} /> },
  ];

  const companyLinks = [
    { path: '/company/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/company/create', label: 'Post Internship', icon: <Briefcase size={20} /> },
    { path: '/company/applicants', label: 'View Applicants', icon: <FileText size={20} /> },
  ];

  const links = user.role === UserRole.STUDENT ? studentLinks : companyLinks;

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 hidden md:flex">
      <div className="p-6 border-b border-slate-100">
        <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">InternConnect</Link>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
              ${location.pathname === link.path 
                ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 px-2">
           <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full bg-slate-200" />
           <div className="overflow-hidden">
             <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
             <p className="text-xs text-slate-500 capitalize truncate">{user.role}</p>
           </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;