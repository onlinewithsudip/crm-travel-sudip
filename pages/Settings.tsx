
import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../types';
import { 
  Shield, 
  User as UserIcon, 
  Lock, 
  Zap, 
  Star, 
  Save, 
  Edit3,
  Mail,
  Crown,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';

interface SettingsProps {
  currentUser: User;
  users: User[];
  onSaveUser: (u: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, users, onSaveUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'access' | 'security'>('access');
  const [isSaving, setIsSaving] = useState(false);

  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  const isAdminTier = currentUser.role === UserRole.ADMIN || isSuperAdmin;

  // Filter users for the permissions table: hide Super Admin if current user is not Super Admin
  const visibleUsersForGovernance = useMemo(() => {
    return users.filter(u => isSuperAdmin || u.role !== UserRole.SUPER_ADMIN);
  }, [users, isSuperAdmin]);

  const handleRoleChange = (user: User, newRole: UserRole) => {
    if (!isSuperAdmin && (newRole === UserRole.SUPER_ADMIN || newRole === UserRole.ADMIN)) {
      alert("Only Super Admins can assign administrative roles.");
      return;
    }
    onSaveUser({ ...user, role: newRole });
  };

  const handleHierarchyChange = (user: User, newLevel: number) => {
    onSaveUser({ ...user, hierarchyLevel: newLevel });
  };

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#001e42] tracking-tight uppercase italic">Settings Hub</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your identity and system access.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserIcon size={14} />}>Profile</TabButton>
          <TabButton active={activeTab === 'access'} onClick={() => setActiveTab('access')} icon={<Shield size={14} />}>Access Control</TabButton>
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Lock size={14} />}>Security</TabButton>
        </div>
      </div>

      {activeTab === 'access' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Shield size={20} /></div>
                <div>
                  <h3 className="text-base font-bold text-[#001e42] uppercase italic">Team Permissions</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage role assignments across the organization.</p>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4">Rank Level</th>
                    <th className="px-6 py-4 text-right">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleUsersForGovernance.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${user.role === UserRole.SUPER_ADMIN ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          disabled={!isSuperAdmin && (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN)}
                          value={user.role} 
                          onChange={(e) => handleRoleChange(user, e.target.value as UserRole)}
                          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:border-orange-500 outline-none transition-all disabled:opacity-50 disabled:bg-slate-50"
                        >
                          {Object.values(UserRole).map(role => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(level => (
                            <button 
                              key={level} 
                              disabled={!isAdminTier}
                              onClick={() => handleHierarchyChange(user, level)}
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${user.hierarchyLevel >= level ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                            >
                              <Star size={10} fill={user.hierarchyLevel >= level ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase">
                        Today, 10:45 AM
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-2xl">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-24 h-24 rounded-2xl bg-orange-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-orange-600/20 italic">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-[#001e42] uppercase italic leading-none">{currentUser.name}</h3>
                {isSuperAdmin && <Crown className="text-amber-500" size={20} />}
              </div>
              <p className="text-sm text-slate-500 font-medium mt-1">{currentUser.email}</p>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
                  {currentUser.role}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
                  Rank L{currentUser.hierarchyLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInput label="Full Name" value={currentUser.name} icon={<UserIcon size={14}/>} />
              <ProfileInput label="Email Address" value={currentUser.email} icon={<Mail size={14}/>} />
            </div>
            <button 
              onClick={saveSettings}
              disabled={isSaving}
              className="bg-[#001e42] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isSaving ? <CheckCircle size={16} className="animate-pulse" /> : <Save size={16} />}
              {isSaving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-2xl space-y-8">
          <div>
            <h3 className="text-lg font-bold text-[#001e42] uppercase italic mb-1">Security Protocols</h3>
            <p className="text-xs text-slate-500 font-medium">Manage your password and authentication settings.</p>
          </div>

          <div className="space-y-4">
            <SecurityOption 
              title="Two-Factor Authentication" 
              description="Add an extra layer of security to your account." 
              enabled={true}
            />
            <SecurityOption 
              title="Session Management" 
              description="Log out from all other active devices." 
              enabled={false}
              isButton
            />
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
            <ShieldAlert className="text-amber-600 shrink-0" size={20} />
            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
              <strong>Account Safety Notice:</strong> Your rank level allows you to modify critical agency assets. Ensure your password is rotated every 90 days.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }> = ({ active, onClick, icon, children }) => (
  <button 
    onClick={onClick} 
    className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${active ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
  >
    {icon} {children}
  </button>
);

const ProfileInput: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
      {icon} {label}
    </label>
    <input 
      type="text" 
      defaultValue={value} 
      className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:border-orange-500 outline-none transition-all"
    />
  </div>
);

const SecurityOption: React.FC<{ title: string; description: string; enabled?: boolean; isButton?: boolean }> = ({ title, description, enabled, isButton }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
    <div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-[10px] text-slate-400 font-medium">{description}</p>
    </div>
    {isButton ? (
      <button className="text-[10px] font-bold text-rose-600 uppercase tracking-widest px-3 py-1.5 rounded-lg border border-rose-100 bg-rose-50 hover:bg-rose-100 transition-colors">Execute</button>
    ) : (
      <button className={`w-10 h-5 rounded-full transition-all relative ${enabled ? 'bg-orange-600' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${enabled ? 'right-1' : 'left-1'}`} />
      </button>
    )}
  </div>
);

export default Settings;
