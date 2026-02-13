import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Users, 
  Map, 
  Car, 
  LayoutDashboard, 
  PlusCircle, 
  Settings as SettingsIcon,
  ShieldCheck,
  ChevronRight,
  Bell,
  BarChart3,
  Menu,
  FileText,
  Crown,
  Link as LinkIcon,
  Edit3
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ManualItinerary from './pages/ManualItinerary';
import Vehicles from './pages/Vehicles';
import AdminPanel from './pages/AdminPanel';
import Settings from './pages/Settings';
import { Lead, LeadSource, LeadStatus, PrebuiltItinerary, User, UserRole, RoutingStrategy, AgencySettings } from './types';

const INITIAL_USERS: User[] = [
  { id: 'u0', name: 'Super Director', role: UserRole.SUPER_ADMIN, email: 'owner@letmetravel.com', hierarchyLevel: 5 },
  { id: 'u1', name: 'Aman Chopra', role: UserRole.ADMIN, email: 'aman@letmetravel.com', hierarchyLevel: 4 },
  { id: 'u2', name: 'Sarah Miller', role: UserRole.SALES, email: 'sarah@letmetravel.com', hierarchyLevel: 3 },
  { id: 'u3', name: 'Amit Kumar', role: UserRole.RESERVATION, email: 'amit@letmetravel.com', hierarchyLevel: 4 },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'L101',
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '9876543210',
    source: LeadSource.FACEBOOK,
    status: LeadStatus.CONTACTED,
    destination: 'Darjeeling',
    budget: '₹45,000',
    assignedAgent: 'Aman Chopra',
    assignedDepartment: UserRole.SALES,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Inquiry via Facebook Ad. Interested in honeymoon packages.'
  },
  {
    id: 'L102',
    name: 'Priya Das',
    email: 'priya.das@example.com',
    phone: '9822334455',
    source: LeadSource.WEBSITE,
    status: LeadStatus.PROPOSAL_SENT,
    destination: 'Gangtok & North Sikkim',
    budget: '₹75,000',
    assignedAgent: 'Sarah Miller',
    assignedDepartment: UserRole.SALES,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    notes: 'Website form submission. Group of 4 adults.'
  }
];

const AppLayout: React.FC = () => {
  const location = useLocation();
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [templates, setTemplates] = useState<PrebuiltItinerary[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [agencySettings, setAgencySettings] = useState<AgencySettings>({
    routingStrategy: RoutingStrategy.ROUND_ROBIN,
    lastAssignedAgentIndex: 0
  });
  
  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const headerTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/leads')) return 'Lead Pipeline';
    if (path.startsWith('/itinerary')) return 'Travel Designer';
    if (path === '/itinerary-builder') return 'Custom Construction';
    if (path === '/vehicles') return 'Fleet Management';
    if (path === '/admin') return isSuperAdmin ? 'Global Command' : 'Admin Panel';
    return 'Agency Operations';
  }, [location.pathname, isSuperAdmin]);

  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `L${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const handleAddTemplate = (template: PrebuiltItinerary) => {
    setTemplates(prev => [template, ...prev]);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(prev => {
      const exists = prev.find(u => u.id === updatedUser.id);
      if (exists) return prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      return [...prev, updatedUser];
    });
  };

  const visibleUsersForSwitcher = useMemo(() => {
    return users.filter(u => isSuperAdmin || u.role !== UserRole.SUPER_ADMIN);
  }, [users, isSuperAdmin]);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <nav className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#001e42] text-white flex flex-col transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3 shrink-0 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
            {isSuperAdmin ? <Crown size={18} className="text-white" /> : <span className="font-extrabold italic text-base">LM</span>}
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight uppercase leading-none">
              LET ME <span className="text-orange-500">TRAVEL</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-60">
              {isSuperAdmin ? 'Super Control' : 'Agency CRM'}
            </p>
          </div>
        </div>

        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarLink to="/" icon={<BarChart3 size={18} />} label="Overview" onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink to="/leads" icon={<LayoutDashboard size={18} />} label="Pipeline" onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink to="/itinerary" icon={<Map size={18} />} label="Designer" onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink to="/itinerary-builder" icon={<Edit3 size={18} />} label="Custom Builder" onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink to="/vehicles" icon={<Car size={18} />} label="Fleet" onClick={() => setIsSidebarOpen(false)} />
          
          {isAdmin && (
            <>
              <div className="pt-6 pb-2 px-4">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Management</p>
              </div>
              <SidebarLink to="/admin" icon={<ShieldCheck size={18} />} label={isSuperAdmin ? "Global Panel" : "Admin Panel"} onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/settings" icon={<SettingsIcon size={18} />} label="Settings" onClick={() => setIsSidebarOpen(false)} />
            </>
          )}
        </div>

        <div className="p-3 border-t border-white/5 relative group">
          <div className="p-3 rounded-xl bg-white/5 flex items-center gap-3 transition-all group-hover:bg-white/10 cursor-pointer">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase italic ${isSuperAdmin ? 'bg-amber-500' : 'bg-orange-500'}`}>
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate tracking-tight">{currentUser.name}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{currentUser.role}</p>
            </div>
            <ChevronRight size={12} className="text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            value={currentUser.id}
            onChange={(e) => {
              const user = users.find(u => u.id === e.target.value);
              if (user) setCurrentUser(user);
            }}
          >
            {visibleUsersForSwitcher.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </nav>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 text-slate-500 lg:hidden hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base font-bold text-slate-800 tracking-tight uppercase italic flex items-center gap-2">
              {isSuperAdmin && <Crown size={14} className="text-amber-500" />}
              {headerTitle}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative p-2 rounded-full transition-all bg-slate-50">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-600 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-all text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-600/10">
              <PlusCircle size={14} /> New Lead
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar main-content-area">
          <Routes>
            <Route path="/" element={<Dashboard leads={leads} currentUser={currentUser} />} />
            <Route path="/leads" element={<Leads leads={leads} onAddLead={handleAddLead} onUpdateStatus={() => {}} currentUser={currentUser} />} />
            <Route path="/leads/:id" element={<LeadDetails leads={leads} onUpdateStatus={() => {}} onReassign={() => {}} currentUser={currentUser} onUpdateFollowUps={() => {}} />} />
            <Route path="/itinerary" element={<ItineraryBuilder leads={leads} templates={templates} currentUser={currentUser} />} />
            <Route path="/itinerary-builder" element={<ManualItinerary leads={leads} currentUser={currentUser} />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/admin" element={<AdminPanel leads={leads} templates={templates} users={users} onAddTemplate={handleAddTemplate} onSaveUser={handleSaveUser} agencySettings={agencySettings} setAgencySettings={setAgencySettings} currentUser={currentUser} onExternalLead={handleAddLead} />} />
            <Route path="/settings" element={<Settings currentUser={currentUser} users={users} onSaveUser={handleSaveUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string; onClick?: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/leads' && location.pathname.startsWith('/leads/'));
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-orange-600 text-white font-bold shadow-lg shadow-orange-600/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      {React.cloneElement(icon as any, { size: 16, className: isActive ? 'text-white' : 'text-slate-500 group-hover:text-orange-400' })}
      <span className="text-[13px] tracking-tight">{label}</span>
      {isActive && <ChevronRight size={12} className="ml-auto opacity-60" />}
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
};

export default App;