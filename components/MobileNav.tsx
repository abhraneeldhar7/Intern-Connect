import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/internships', label: 'Browse Internships' },
    { path: '/applications', label: 'My Applications' },
  ];

  const companyLinks = [
    { path: '/company/dashboard', label: 'Dashboard' },
    { path: '/company/create', label: 'Post Internship' },
    { path: '/company/applicants', label: 'View Applicants' },
  ];

  const links = user ? (user.role === UserRole.STUDENT ? studentLinks : companyLinks) : [];

  return (
    <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-indigo-600">InternConnect</Link>
        <button onClick={toggleMenu} className="text-slate-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 flex flex-col gap-2">
          {!user ? (
            <div className="flex flex-col gap-2 px-4">
              <Link to="/login" onClick={toggleMenu} className="px-4 py-2 text-center text-indigo-600 font-medium bg-indigo-50 rounded-lg">Login</Link>
            </div>
          ) : (
            <>
              {links.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={toggleMenu}
                  className="px-6 py-3 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <button 
                onClick={() => { logout(); toggleMenu(); }}
                className="mx-6 mt-2 px-4 py-2 text-left text-red-600 font-medium bg-red-50 rounded-lg"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileNav;