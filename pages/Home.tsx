import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Briefcase, Users, TrendingUp, CheckCircle2, Sparkles, 
  Zap, Shield, Globe, Star, ChevronRight, Play 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleRoleSelect = (role: UserRole) => {
    navigate('/login');
  };

  if (user) {
      if (user.role === UserRole.STUDENT) navigate('/dashboard');
      else navigate('/company/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass-nav border-b border-slate-100/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">InternConnect</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#showcase" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Platform</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
          </div>

          <div className="flex gap-4">
            <Link to="/login" className="hidden sm:block px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Sign In</Link>
            <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 flex items-center gap-2">
              Get Started <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-3xl -z-10 opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl -z-10 opacity-60"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v2.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Unlock your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[200%_auto] animate-gradient">
                career potential.
              </span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              The modern ecosystem connecting ambitious students with world-class companies. AI-matched internships, streamlined tracking, and zero hassle.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button 
                onClick={() => handleRoleSelect(UserRole.STUDENT)}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Find Internships <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => handleRoleSelect(UserRole.COMPANY)}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <Briefcase size={20} className="text-slate-400" /> Post a Job
              </button>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*123}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white bg-slate-100" />
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-600">
                <span className="text-indigo-600">2,000+</span> students joined this week
              </p>
            </div>
          </div>

          {/* Hero Mockup */}
          <div className="relative hidden lg:block perspective-[2000px] group">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-[2rem] rotate-6 opacity-20 blur-2xl scale-90 group-hover:rotate-3 transition-transform duration-700"></div>
             <div className="relative bg-white rounded-[2rem] border border-slate-200/60 shadow-2xl overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] group-hover:rotate-0 transition-transform duration-700 ease-out">
                {/* Mockup Header */}
                <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                   <div className="ml-4 px-3 py-1 bg-white rounded-md text-[10px] text-slate-400 font-mono border border-slate-100 shadow-sm w-full max-w-[200px]">internconnect.com/dashboard</div>
                </div>
                {/* Mockup Content */}
                <div className="p-8 bg-slate-50/50 min-h-[400px]">
                   <div className="flex justify-between items-end mb-8">
                      <div>
                         <div className="h-8 w-48 bg-slate-900 rounded-lg mb-2"></div>
                         <div className="h-4 w-32 bg-slate-300 rounded-md"></div>
                      </div>
                      <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
                         <Sparkles size={18} className="text-white" />
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 mb-8">
                      {[1,2,3].map(i => (
                         <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <div className={`w-8 h-8 rounded-lg mb-3 ${i===1 ? 'bg-blue-100 text-blue-600' : i===2 ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}></div>
                            <div className="h-6 w-12 bg-slate-900 rounded mb-1"></div>
                            <div className="h-3 w-20 bg-slate-300 rounded"></div>
                         </div>
                      ))}
                   </div>
                   <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                      <div className="flex justify-between mb-4">
                         <div className="h-5 w-32 bg-slate-800 rounded"></div>
                         <div className="h-5 w-16 bg-slate-200 rounded"></div>
                      </div>
                      <div className="space-y-3">
                         {[1,2,3].map(i => (
                            <div key={i} className="h-12 w-full bg-slate-50 rounded-xl flex items-center px-4 gap-3">
                               <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                               <div className="h-3 w-24 bg-slate-300 rounded"></div>
                               <div className="ml-auto h-3 w-16 bg-indigo-100 rounded"></div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <div className="border-y border-slate-100 bg-slate-50/50 py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by forward-thinking teams</p>
           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {['Acme Corp', 'GlobalBank', 'Nebula', 'SaaS Flow', 'LightSpeed'].map((brand, i) => (
                 <span key={i} className="text-xl md:text-2xl font-bold text-slate-800 font-display">{brand}</span>
              ))}
           </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Built for the future of work.</h2>
            <p className="text-lg text-slate-500 leading-relaxed">We've reimagined the internship experience to be seamless, transparent, and intelligent for everyone involved.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Briefcase className="text-white" size={24} />, 
                color: 'from-blue-500 to-cyan-500',
                title: 'Smart Matching', 
                desc: 'Our AI analyzes skills and culture fit to pair students with their ideal roles instantly.' 
              },
              { 
                icon: <Shield className="text-white" size={24} />, 
                color: 'from-violet-500 to-purple-500',
                title: 'Verified Profiles', 
                desc: 'Say goodbye to fake resumes. We verify university credentials and skill assessments.' 
              },
              { 
                icon: <Zap className="text-white" size={24} />, 
                color: 'from-amber-500 to-orange-500',
                title: 'Instant Feedback', 
                desc: 'Real-time application tracking means you never have to guess your status again.' 
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section id="showcase" className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-30"></div>
            <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-violet-600 rounded-full blur-[120px] opacity-20"></div>
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 space-y-8">
                  <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">Powerful tools for <br/><span className="text-indigo-400">modern recruiting.</span></h2>
                  <div className="space-y-6">
                     {[
                        { title: 'Kanban Tracking', text: 'Visualize your hiring pipeline with our intuitive drag-and-drop board.' },
                        { title: 'AI-Assisted Job Descriptions', text: 'Generate professional listings in seconds using Gemini AI.' },
                        { title: 'Resume Analysis', text: 'Get instant compatibility scores for every applicant.' }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                              <CheckCircle2 className="text-indigo-400" size={20} />
                           </div>
                           <div>
                              <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                              <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="flex-1 w-full">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800/50 backdrop-blur-sm">
                     {/* Simple browser chrome */}
                     <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                           <div className="w-3 h-3 rounded-full bg-white/20"></div>
                           <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        </div>
                     </div>
                     {/* Dashboard Content Simulation */}
                     <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                           <div className="h-8 w-32 bg-white/10 rounded"></div>
                           <div className="h-8 w-24 bg-indigo-500 rounded"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                           <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                        </div>
                        <div className="h-48 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                           <TrendingUp className="text-white/20 w-12 h-12" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-50">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-16">Loved by thousands.</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {[
                  { text: "I found my dream internship at TechCorp within 3 days. The process was incredibly smooth.", name: "Sarah Jenkins", role: "CS Student, Stanford", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
                  { text: "The quality of applicants we get here is unmatched. It has completely replaced our old hiring portal.", name: "David Chen", role: "Recruiter, Acme Inc.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
                  { text: "Finally, a platform that gives feedback! Tracking my application status gave me so much peace of mind.", name: "Marcus Johnson", role: "Design Student, RISD", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" }
               ].map((t, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex gap-1 mb-4">
                        {[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-amber-400 text-amber-400" />)}
                     </div>
                     <p className="text-slate-600 mb-6 leading-relaxed">"{t.text}"</p>
                     <div className="flex items-center gap-4">
                        <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full bg-slate-100" />
                        <div>
                           <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                           <p className="text-xs text-slate-500">{t.role}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Simple pricing for companies.</h2>
            <p className="text-slate-500 mb-12">Students always join for free.</p>
            
            <div className="inline-flex bg-slate-100 p-1 rounded-xl mb-16">
               <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
               >
                  Monthly
               </button>
               <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
               >
                  Yearly <span className="text-indigo-600 text-xs ml-1">-20%</span>
               </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {[
                  { name: 'Starter', price: '$0', desc: 'Perfect for small startups.', features: ['1 Active Job Post', 'Basic Candidate Profiles', 'Community Support'] },
                  { name: 'Growth', price: billingCycle === 'monthly' ? '$49' : '$39', popular: true, desc: 'For growing teams hiring fast.', features: ['10 Active Job Posts', 'AI Resume Screening', 'Priority Support', 'Company Branding'] },
                  { name: 'Enterprise', price: 'Custom', desc: 'For large organizations.', features: ['Unlimited Job Posts', 'Dedicated Account Manager', 'API Access', 'SSO Integration'] }
               ].map((plan, i) => (
                  <div key={i} className={`relative p-8 rounded-3xl border text-left transition-all duration-300 ${plan.popular ? 'border-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10 bg-white' : 'border-slate-200 bg-white hover:border-indigo-200'}`}>
                     {plan.popular && (
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                     )}
                     <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                     <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                        {plan.price !== 'Custom' && <span className="text-slate-500">/mo</span>}
                     </div>
                     <p className="text-sm text-slate-500 mb-8">{plan.desc}</p>
                     <ul className="space-y-4 mb-8">
                        {plan.features.map((f, idx) => (
                           <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                              <CheckCircle2 size={18} className="text-indigo-600 shrink-0" /> {f}
                           </li>
                        ))}
                     </ul>
                     <button className={`w-full py-3 rounded-xl font-bold transition-colors ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                        Choose {plan.name}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto relative rounded-[2.5rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 px-8 py-20 md:px-20 text-center text-white">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to transform your future?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Join the fastest growing internship network. Whether you're hiring or hunting, we've got you covered.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <button onClick={() => navigate('/login')} className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg">Get Started for Free</button>
               <button className="px-8 py-4 bg-indigo-700/50 backdrop-blur-sm border border-indigo-400/30 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
           <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-white w-4 h-4" />
                 </div>
                 <span className="text-lg font-extrabold text-slate-900">InternConnect</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Making the early career journey accessible, transparent, and rewarding for everyone.</p>
              <div className="flex gap-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-colors cursor-pointer">
                       <Globe size={14} />
                    </div>
                 ))}
              </div>
           </div>
           
           {[
              { title: 'Product', links: ['Features', 'Pricing', 'Enterprise', 'Case Studies'] },
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
              { title: 'Resources', links: ['Community', 'Help Center', 'Terms of Service', 'Privacy Policy'] }
           ].map((col, i) => (
              <div key={i}>
                 <h4 className="font-bold text-slate-900 mb-6">{col.title}</h4>
                 <ul className="space-y-4">
                    {col.links.map((link, idx) => (
                       <li key={idx}><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors">{link}</a></li>
                    ))}
                 </ul>
              </div>
           ))}
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-slate-400 text-sm font-medium">&copy; {new Date().getFullYear()} InternConnect Inc. All rights reserved.</p>
           <div className="flex gap-8">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Systems Operational</span>
           </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;