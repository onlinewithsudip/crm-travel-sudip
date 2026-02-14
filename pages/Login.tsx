import React, { useState, useContext } from 'react';
import { ArrowRight, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { User, UserRole } from '../types';
import { EditableText, EditableImage, EditContext } from '../App';

interface LoginProps {
  onLogin: (user: User) => void;
}

const BRAND_LOGO_URL = "https://i.ibb.co/vzR0y6y/lmt-logo.png";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isEditMode } = useContext(EditContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) return; 
    setIsLoading(true);
    setError('');

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
      } else if (userId === 'agent_lmt' && password === 'Lmt@2025') {
        onLogin({
          id: 'u-sales-1',
          name: 'Sales Executive',
          role: UserRole.SALES,
          email: 'sales@letmetravel.in',
          hierarchyLevel: 2
        });
      } else {
        setError('Invalid Identification or Password.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#001e42] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <div className="w-full max-w-[400px] space-y-6 animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center bg-white p-6 rounded-[32px] shadow-2xl transition-transform hover:scale-105 duration-500">
            <EditableImage contentKey="agency_logo" defaultVal={BRAND_LOGO_URL} className="h-20 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              <EditableText contentKey="login_title_prefix" defaultVal="Agency" /> <span className="text-orange-500"><EditableText contentKey="login_title_suffix" defaultVal="Command" /></span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 italic">
              <EditableText contentKey="agency_tagline" defaultVal="Turning Trips Into Memories" />
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2">
                <UserIcon size={10} className="text-orange-500" /> <EditableText contentKey="login_user_label" defaultVal="Identity ID" />
              </label>
              <input 
                required
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID or Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-xs font-bold outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2">
                <Lock size={10} className="text-orange-500" /> <EditableText contentKey="login_pass_label" defaultVal="Secure Key" />
              </label>
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-xs font-bold outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 py-2.5 rounded-xl animate-in shake duration-300">
                <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest text-center">{error}</p>
              </div>
            )}

            <button 
              disabled={isLoading || isEditMode}
              type="submit"
              className="w-full bg-orange-600 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px] hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <EditableText contentKey="login_btn_text" defaultVal="Access Pipeline" /> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} <EditableText contentKey="footer_copyright" defaultVal="LET ME TRAVEL • ORION HOLIDAYS" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;