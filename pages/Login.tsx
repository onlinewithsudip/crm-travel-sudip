import React, { useState } from 'react';
import { Crown, Shield, ArrowRight, Mountain, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Hardcoded credentials as requested
    setTimeout(() => {
      if (userId === 'sudipthapa' && password === 'Sudip@123') {
        onLogin({
          id: 'u-super',
          name: 'Sudip Thapa',
          role: UserRole.SUPER_ADMIN,
          email: 'sudip@letmetravel.in',
          hierarchyLevel: 5
        });
      } else if (userId === 'info@letmetravel.in' && password === 'Orion@2026') {
        onLogin({
          id: 'u-admin',
          name: 'Admin Office',
          role: UserRole.ADMIN,
          email: 'info@letmetravel.in',
          hierarchyLevel: 4
        });
      } else {
        setError('Invalid Identification or Password. Access Denied.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#001e42] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-orange-600 shadow-2xl shadow-orange-600/30 rotate-3 transition-transform hover:rotate-0">
            <Mountain size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Let Me <span className="text-orange-500">Travel</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Command Center Login</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <UserIcon size={12} className="text-orange-500" /> Identity ID
              </label>
              <input 
                required
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID or Email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-bold outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Lock size={12} className="text-orange-500" /> Secure Key
              </label>
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm font-bold outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl animate-in shake duration-300">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest text-center">{error}</p>
              </div>
            )}

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Access Pipeline <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} LET ME TRAVEL • GLOBAL OPERATIONS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;