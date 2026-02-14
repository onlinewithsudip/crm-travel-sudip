
import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import * as RouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Link, useLocation, Navigate } = RouterDOM as any;

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
  Edit3,
  LogOut,
  Mountain,
  Link2,
  Lock,
  Eye,
  Settings as EditToggleIcon,
  FileBadge
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import ItineraryBuilder from './pages/ItineraryBuilder';
import QuotationBuilder from './pages/QuotationBuilder';
import ManualItinerary from './pages/ManualItinerary';
import Vehicles from './pages/Vehicles';
import AdminPanel from './pages/AdminPanel';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { Lead, LeadSource, LeadStatus, PrebuiltItinerary, User, UserRole, RoutingStrategy, AgencySettings, Webhook, AppContent, Quotation } from './types';

// Context for global editability
export const EditContext = createContext<{
  isEditMode: boolean;
  content: AppContent;
  updateContent: (key: string, val: string) => void;
}>({
  isEditMode: false,
  content: {},
  updateContent: () => {}
});

// Editable Text Component
export const EditableText: React.FC<{ 
  contentKey: string; 
  defaultVal: string; 
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' 
}> = ({ contentKey, defaultVal, className, as = 'span' }) => {
  const { isEditMode, content, updateContent } = useContext(EditContext);
  const val = content[contentKey] || defaultVal;
  const Tag = as as any;

  if (isEditMode) {
    return (
      <input 
        type="text"
        value={val}
        onChange={(e) => updateContent(contentKey, e.target.value)}
        className={`bg-orange-500/10 border border-orange-500/30 rounded px-1 outline-none text-inherit ${className}`}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return <Tag className={className}>{val}</Tag>;
};

// Editable Image Component
export const EditableImage: React.FC<{ 
  contentKey: string; 
  defaultVal: string; 
  className?: string;
  alt?: string;
}> = ({ contentKey, defaultVal, className, alt }) => {
  const { isEditMode, content, updateContent } = useContext(EditContext);
  const val = content[contentKey] || defaultVal;

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    const newUrl = prompt('Enter new Image URL:', val);
    if (newUrl) updateContent(contentKey, newUrl);
  };

  return (
    <div className={`relative ${isEditMode ? 'cursor-pointer group' : ''}`} onClick={handleClick}>
      <img src={val} className={className} alt={alt} crossOrigin="anonymous" />
      {isEditMode && (
        <div className="absolute inset-0 bg-orange-500/20 border-2 border-orange-500 border-dashed rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="text-white" size={24} />
        </div>
      )}
    </div>
  );
};

export const BRAND_LOGO_URL = "https://i.ibb.co/vzR0y6y/lmt-logo.png"; 

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
    assignedAgent: 'Sudip Thapa',
    assignedDepartment: UserRole.SALES,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Inquiry via Facebook Ad. Interested in honeymoon packages.'
  }
];

const INITIAL_WEBHOOKS: Webhook[] = [
  {
    id: 'WH-01',
    name: 'FB Main Ad Campaign',
    source: LeadSource.FACEBOOK,
    endpointUrl: 'https://api.letmetravel.in/v1/ingest/fb_main',
    secretKey: 'lmt_sec_782910',
    status: 'Active',
    createdAt: new Date().toISOString()
  }
];

const AppLayout: React.FC<{ currentUser: User; onLogout: () => void }> = ({ currentUser, onLogout }) => {
  const location = useLocation();
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [templates, setTemplates] = useState<PrebuiltItinerary[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // FIX: Added missing markupPercentage and maxDiscount to agencySettings initialization
  const [agencySettings, setAgencySettings] = useState<AgencySettings>({
    routingStrategy: RoutingStrategy.ROUND_ROBIN,
    lastAssignedAgentIndex: 0,
    markupPercentage: 25,
    maxDiscount: 10
  });

  const [appContent, setAppContent] = useState<AppContent>(() => {
    const saved = localStorage.getItem('lmt_app_content');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('lmt_app_content', JSON.stringify(appContent));
  }, [appContent]);
  
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const updateAppContent = (key: string, val: string) => {
    setAppContent(prev => ({ ...prev, [key]: val }));
  };

  const headerTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/leads')) return 'Lead Pipeline';
    if (path === '/itinerary') return 'Premium Quotations';
    if (path === '/itinerary-builder') return 'Custom Builder';
    if (path === '/vehicles') return 'Fleet Management';
    if (path === '/admin') return 'Global Command';
    return 'Agency Operations';
  }, [location.pathname]);

  const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `L${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const handleAddWebhook = (newWebhook: Webhook) => {
    setWebhooks(prev => [...prev, newWebhook]);
  };

  const onRemoveWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(wh => wh.id !== id));
  };

  const handleAddTemplate = (newTemplate: PrebuiltItinerary) => {
    setTemplates(prev => [newTemplate, ...prev]);
  };

  return (
    <EditContext.Provider value={{ isEditMode, content: appContent, updateContent: updateAppContent }}>
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        <nav className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#001e42] text-white flex flex-col transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-5 flex flex-col items-center gap-3 shrink-0 border-b border-white/5">
            <Link to="/" className="w-full">
              <div className="bg-white rounded-xl p-3 shadow-xl mb-2 flex items-center justify-center overflow-hidden">
                <EditableImage contentKey="agency_logo" defaultVal={BRAND_LOGO_URL} className="h-10 w-auto object-contain" />
              </div>
            </Link>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">
                <EditableText contentKey="sidebar_admin_label" defaultVal={isSuperAdmin ? 'Super Command' : 'Agency CRM'} />
              </p>
            </div>
          </div>

          <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {isSuperAdmin && (
              <SidebarLink to="/" icon={<BarChart3 size={18} />} label={<EditableText contentKey="menu_overview" defaultVal="Overview" />} onClick={() => setIsSidebarOpen(false)} />
            )}
            
            <div className="pt-2 pb-2 px-4">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <EditableText contentKey="menu_cat_ops" defaultVal="Operations" />
              </p>
            </div>
            
            <SidebarLink to="/leads" icon={<LayoutDashboard size={18} />} label={<EditableText contentKey="menu_leads" defaultVal="Pipeline" />} onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/itinerary" icon={<FileBadge size={18} />} label={<EditableText contentKey="menu_quotations" defaultVal="Quotations" />} onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/itinerary-builder" icon={<Edit3 size={18} />} label={<EditableText contentKey="menu_designer" defaultVal="Custom Builder" />} onClick={() => setIsSidebarOpen(false)} />
            
            {isSuperAdmin && (
              <>
                <SidebarLink to="/vehicles" icon={<Car size={18} />} label={<EditableText contentKey="menu_fleet" defaultVal="Fleet" />} onClick={() => setIsSidebarOpen(false)} />
                <div className="pt-6 pb-2 px-4">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <EditableText contentKey="menu_cat_mgmt" defaultVal="Management" />
                  </p>
                </div>
                <SidebarLink to="/admin" icon={<ShieldCheck size={18} />} label={<EditableText contentKey="menu_global" defaultVal="Global Panel" />} onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/settings" icon={<SettingsIcon size={18} />} label={<EditableText contentKey="menu_settings" defaultVal="Settings" />} onClick={() => setIsSidebarOpen(false)} />
              </>
            )}
          </div>

          <div className="p-3 border-t border-white/5 space-y-2">
            <div className="p-3 rounded-xl bg-white/5 flex items-center gap-3 group relative">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase italic ${isSuperAdmin ? 'bg-amber-500' : 'bg-orange-500'}`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate tracking-tight">{currentUser.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{currentUser.role}</p>
              </div>
            </div>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all text-[13px] font-bold uppercase tracking-wider">
              <LogOut size={16} /> <EditableText contentKey="btn_logout" defaultVal="Logout" />
            </button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="p-2 text-slate-500 lg:hidden hover:bg-slate-50 rounded-lg transition-colors">
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
              <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>
              <button onClick={onLogout} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all text-[11px] font-bold uppercase tracking-wider border border-transparent hover:border-rose-100">
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar main-content-area">
            <Routes>
              <Route path="/" element={isSuperAdmin ? <Dashboard leads={leads} currentUser={currentUser} /> : <Navigate to="/leads" replace />} />
              <Route path="/leads" element={<Leads leads={leads} onAddLead={handleAddLead} onUpdateStatus={() => {}} currentUser={currentUser} />} />
              <Route path="/leads/:id" element={<LeadDetails leads={leads} onUpdateStatus={() => {}} onReassign={() => {}} currentUser={currentUser} onUpdateFollowUps={() => {}} />} />
              <Route path="/itinerary" element={<QuotationBuilder leads={leads} currentUser={currentUser} />} />
              <Route path="/itinerary-builder" element={<ManualItinerary leads={leads} currentUser={currentUser} onAddTemplate={handleAddTemplate} />} />
              <Route path="/vehicles" element={isSuperAdmin ? <Vehicles /> : <Navigate to="/leads" replace />} />
              <Route path="/admin" element={isSuperAdmin ? <AdminPanel leads={leads} templates={templates} users={[]} onAddTemplate={handleAddTemplate} onSaveUser={() => {}} agencySettings={agencySettings} setAgencySettings={setAgencySettings} currentUser={currentUser} onExternalLead={handleAddLead} webhooks={webhooks} onAddWebhook={handleAddWebhook} onRemoveWebhook={onRemoveWebhook} /> : <Navigate to="/leads" replace />} />
              <Route path="/settings" element={isSuperAdmin ? <Settings currentUser={currentUser} users={[]} onSaveUser={() => {}} /> : <Navigate to="/leads" replace />} />
            </Routes>
          </div>
        </main>

        {isSuperAdmin && (
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`fixed bottom-8 right-8 z-[100] p-4 rounded-full shadow-2xl transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest ${isEditMode ? 'bg-orange-600 text-white animate-pulse' : 'bg-[#001e42] text-white hover:bg-orange-600'}`}
          >
            {isEditMode ? <Eye size={20} /> : <EditToggleIcon size={20} />}
            {isEditMode ? 'Finish Editing' : 'Enable Edit Mode'}
          </button>
        )}
      </div>
    </EditContext.Provider>
  );
};

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: React.ReactNode; onClick?: () => void }> = ({ to, icon, label, onClick }) => {
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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lmt_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('lmt_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lmt_user');
  };

  return (
    <HashRouter>
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <AppLayout currentUser={currentUser} onLogout={handleLogout} />
      )}
    </HashRouter>
  );
};

export default App;
