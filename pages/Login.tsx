import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [email, setEmail] = useState('alex@student.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API network delay
    setTimeout(() => {
      login(email, role);
      if (role === UserRole.STUDENT) {
        navigate('/dashboard');
      } else {
        navigate('/company/dashboard');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-['Inter']">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4 text-white shadow-lg shadow-indigo-200 transition-transform hover:scale-105">
              <Sparkles size={24} />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 font-['Plus_Jakarta_Sans']">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Sign in to access your dashboard</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8">
          <button 
            type="button"
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${role === UserRole.STUDENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setRole(UserRole.STUDENT); setEmail('alex@student.com'); }}
          >
            Student
          </button>
          <button 
            type="button"
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${role === UserRole.COMPANY ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => { setRole(UserRole.COMPANY); setEmail('jobs@techcorp.com'); }}
          >
            Company
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
              required 
            />
            <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                <strong>Demo Hint:</strong> Use default email for existing mock data, or any other email to auto-register a new user.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm font-medium">Don't have an account? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign up</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;