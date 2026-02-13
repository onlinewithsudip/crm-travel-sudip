import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus, LeadSource, PrebuiltItinerary, User, UserRole, AgencySettings, Webhook } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Shield, 
  Globe, 
  Users, 
  Crown, 
  FileBarChart, 
  Activity, 
  Map, 
  X, 
  Image as ImageIcon, 
  Calendar,
  Save,
  Check,
  Webhook as WebhookIcon,
  Link2,
  Copy,
  Zap,
  Globe2,
  Search,
  Facebook
} from 'lucide-react';

interface AdminPanelProps {
  leads: Lead[];
  templates: PrebuiltItinerary[];
  users: User[];
  onAddTemplate: (t: PrebuiltItinerary) => void;
  onSaveUser: (u: User) => void;
  agencySettings: AgencySettings;
  setAgencySettings: React.Dispatch<React.SetStateAction<AgencySettings>>;
  currentUser: User;
  onExternalLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  webhooks: Webhook[];
  onAddWebhook: (w: Webhook) => void;
  onRemoveWebhook: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  leads, 
  templates, 
  users, 
  onAddTemplate, 
  onSaveUser, 
  currentUser,
  webhooks,
  onAddWebhook,
  onRemoveWebhook
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'templates' | 'users' | 'integrations'>('analytics');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [selectedAgentsForComparison, setSelectedAgentsForComparison] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    source: LeadSource.WEBSITE
  });

  const [templateForm, setTemplateForm] = useState<Omit<PrebuiltItinerary, 'id'>>({
    title: '',
    destination: '',
    description: '',
    durationDays: 3,
    totalCost: 15000,
    days: [
      { day: 1, title: 'Arrival', activities: ['Transfer to Hotel'], meals: ['Dinner'], accommodation: 'Boutique Resort' },
      { day: 2, title: 'Sightseeing', activities: ['Local Tour'], meals: ['Breakfast', 'Dinner'], accommodation: 'Boutique Resort' },
      { day: 3, title: 'Departure', activities: ['Transfer to NJP/IXB'], meals: ['Breakfast'], accommodation: 'N/A' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
  });

  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;

  const agentPerformanceData = useMemo(() => {
    return users.filter(u => u.role === UserRole.SALES || u.role === UserRole.RESERVATION).map(user => {
      const agentLeads = leads.filter(l => l.assignedAgent === user.name);
      const booked = agentLeads.filter(l => l.status === LeadStatus.BOOKED).length;
      const conversionRate = agentLeads.length > 0 ? (booked / agentLeads.length) * 100 : 0;
      return {
        id: user.id,
        name: user.name,
        totalLeads: agentLeads.length,
        booked,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        revenue: booked * 50000,
        avgResponseTime: Math.floor(Math.random() * 20) + 5
      };
    });
  }, [leads, users]);

  const comparisonChartData = useMemo(() => {
    if (selectedAgentsForComparison.length === 0) return [];
    const selectedData = agentPerformanceData.filter(d => selectedAgentsForComparison.includes(d.id));
    const metrics = [
      { name: 'Leads', key: 'totalLeads', max: Math.max(...agentPerformanceData.map(d => d.totalLeads), 1) },
      { name: 'Conv %', key: 'conversionRate', max: 100 },
      { name: 'Revenue', key: 'revenue', max: Math.max(...agentPerformanceData.map(d => d.revenue), 1) },
      { name: 'Speed', key: 'avgResponseTime', max: 30, reverse: true }
    ];
    return metrics.map(m => {
      const result: any = { subject: m.name };
      selectedData.forEach(agent => {
        const val = agent[m.key as keyof typeof agent] as number;
        result[agent.name] = m.reverse ? ((m.max - val) / m.max) * 100 : (val / m.max) * 100;
      });
      return result;
    });
  }, [agentPerformanceData, selectedAgentsForComparison]);

  const COLORS = ['#f26522', '#001e42', '#3b82f6', '#10b981'];

  const handleAddTemplateInternal = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTemplate({ ...templateForm, id: `T${Date.now()}` });
    setShowTemplateModal(false);
  };

  const handleDeployWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceSlug = webhookForm.source.toLowerCase().replace(/\s+/g, '_');
    const newWebhook: Webhook = {
      id: `WH-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name: webhookForm.name,
      source: webhookForm.source as LeadSource,
      endpointUrl: `https://api.letmetravel.in/v1/ingest/${sourceSlug}_${Math.random().toString(36).substr(2, 4)}`,
      secretKey: `lmt_sec_${Math.random().toString(36).substr(2, 8)}`,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    onAddWebhook(newWebhook);
    setShowWebhookModal(false);
    setWebhookForm({ name: '', source: LeadSource.WEBSITE });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const getSourceIcon = (source: LeadSource) => {
    switch (source) {
      case LeadSource.FACEBOOK: return <Facebook size={14} />;
      case LeadSource.GOOGLE: return <Search size={14} />;
      default: return <Globe2 size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl shadow-xl ${isSuperAdmin ? 'bg-amber-100' : 'bg-slate-100'}`}>
            {isSuperAdmin ? <Crown className="text-amber-600" size={32} /> : <Shield className="text-[#001e42]" size={32} />}
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#001e42] uppercase italic">Admin Command</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Agency Architecture & Insights</p>
          </div>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner no-print overflow-x-auto">
          <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>Analytics</TabButton>
          <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>Comparison</TabButton>
          <TabButton active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>Blueprints</TabButton>
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Team</TabButton>
          <TabButton active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')}>Integrations</TabButton>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm min-w-0">
            <h3 className="text-sm font-black text-[#001e42] uppercase italic mb-6 flex items-center gap-2">
              <Activity size={18} className="text-orange-600" /> Agent Conversion Rates
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#64748b'}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px'}} />
                  <Bar dataKey="conversionRate" fill="#f26522" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-[#001e42] p-8 rounded-[40px] shadow-xl text-white">
            <h3 className="text-sm font-black uppercase italic mb-6 flex items-center gap-2 text-orange-500">
              <Activity size={18} /> Workforce Statistics
            </h3>
            <div className="space-y-6">
              {agentPerformanceData.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-xs italic">{agent.name.charAt(0)}</div>
                      <p className="text-xs font-bold uppercase tracking-tight">{agent.name}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-orange-500">{agent.booked} BOOKED</p>
                      <p className="text-[9px] text-slate-400 font-bold">{agent.conversionRate}% CONV.</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4 no-print">
             <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Agents (Max 3)</p>
                <div className="space-y-2">
                   {agentPerformanceData.map(agent => (
                     <button 
                        key={agent.id} 
                        onClick={() => {
                          if (selectedAgentsForComparison.includes(agent.id)) {
                            setSelectedAgentsForComparison(prev => prev.filter(a => a !== agent.id));
                          } else if (selectedAgentsForComparison.length < 3) {
                            setSelectedAgentsForComparison(prev => [...prev, agent.id]);
                          }
                        }}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${selectedAgentsForComparison.includes(agent.id) ? 'bg-[#001e42] text-white border-[#001e42] shadow-lg' : 'bg-slate-50 text-slate-600 hover:border-orange-200'}`}
                      >
                        <span className="text-[10px] font-black uppercase italic">{agent.name}</span>
                        {selectedAgentsForComparison.includes(agent.id) && <Check size={12} className="text-orange-500" />}
                     </button>
                   ))}
                </div>
             </div>
          </div>
          <div className="lg:col-span-3">
             <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl min-w-0">
                <h3 className="text-sm font-black text-[#001e42] uppercase italic mb-8 flex items-center gap-2">
                   <Activity size={18} className="text-orange-600" /> Relative Performance Radar
                </h3>
                <div className="h-[400px] w-full">
                  {selectedAgentsForComparison.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonChartData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                        {selectedAgentsForComparison.map((id, index) => {
                          const agent = agentPerformanceData.find(a => a.id === id);
                          return <Radar key={id} name={agent?.name} dataKey={agent?.name || ''} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} fillOpacity={0.4} strokeWidth={3} />;
                        })}
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-300">
                       <FileBarChart size={48} className="mb-4 opacity-20" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Select agents to start comparison</p>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-8">
           <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm no-print">
              <div>
                 <h3 className="text-2xl font-black text-[#001e42] uppercase italic flex items-center gap-3">
                    <Map size={24} className="text-orange-600" /> Blueprint Factory
                 </h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Design and manage prebuilt travel experiences.</p>
              </div>
              <button onClick={() => setShowTemplateModal(true)} className="bg-[#001e42] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl">
                 <Plus size={18} /> New Blueprint
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map(t => (
                <div key={t.id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-xl group hover:border-orange-500 transition-all">
                   <div className="h-40 relative">
                      <img src={t.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <div className="absolute top-4 left-4 bg-[#001e42] text-white px-3 py-1 rounded-full text-[9px] font-black italic">{t.durationDays} Days</div>
                   </div>
                   <div className="p-6 space-y-3">
                      <h4 className="text-lg font-black text-[#001e42] uppercase italic truncate">{t.title}</h4>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50 no-print">
                         <span className="text-xl font-black text-orange-600">₹{t.totalCost}</span>
                         <div className="flex gap-2">
                            <button className="p-2 text-slate-300 hover:text-orange-600 transition-colors"><Edit3 size={16}/></button>
                            <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
           <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-[#001e42] uppercase italic flex items-center gap-3">
                 <Users size={20} className="text-orange-600" /> Agency Workforce
              </h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                       <th className="px-8 py-5">Officer</th>
                       <th className="px-8 py-5">Role Designation</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm italic">{u.name.charAt(0)}</div>
                               <div>
                                  <p className="text-xs font-black text-[#001e42] italic">{u.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-3 py-1 bg-slate-100 rounded-lg">{u.role}</span>
                         </td>
                         <td className="px-8 py-5 text-right no-print">
                            <button className="p-2 text-slate-300 hover:text-orange-600 transition-all"><Edit3 size={16}/></button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
           <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                    <h3 className="text-2xl font-black text-[#001e42] uppercase italic flex items-center gap-4">
                       <WebhookIcon className="text-orange-600" /> Webhook Deployment Center
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Ingest leads from Website, Facebook, and Google automatically.</p>
                 </div>
                 <button 
                    onClick={() => setShowWebhookModal(true)} 
                    className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/10"
                 >
                    <Zap size={18} /> Deploy New Pipeline
                 </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {webhooks.length === 0 ? (
                   <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px]">
                      <Link2 size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active ingestion pipelines</p>
                   </div>
                 ) : (
                   webhooks.map(wh => (
                     <div key={wh.id} className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:bg-white hover:shadow-2xl hover:border-orange-100 transition-all">
                        <div className="flex items-start gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-[#001e42] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              {getSourceIcon(wh.source)}
                           </div>
                           <div>
                              <div className="flex items-center gap-3">
                                 <h4 className="text-lg font-black text-[#001e42] uppercase italic">{wh.name}</h4>
                                 <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded-md">Live</span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Source: {wh.source} • Created {new Date(wh.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>

                        <div className="flex-1 max-w-xl space-y-3">
                           <div className="space-y-1">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Endpoint URL</label>
                              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-3 shadow-inner">
                                 <code className="text-[10px] text-slate-600 font-bold flex-1 truncate">{wh.endpointUrl}</code>
                                 <button onClick={() => copyToClipboard(wh.endpointUrl, 'URL')} className="ml-3 p-1.5 text-slate-400 hover:text-orange-600 transition-colors"><Copy size={14} /></button>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Secret Token</label>
                              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-3 shadow-inner">
                                 <code className="text-[10px] text-slate-400 font-bold flex-1 truncate">••••••••••••••••••••</code>
                                 <button onClick={() => copyToClipboard(wh.secretKey, 'Token')} className="ml-3 p-1.5 text-slate-400 hover:text-orange-600 transition-colors"><Copy size={14} /></button>
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-2">
                           <button onClick={() => onRemoveWebhook(wh.id)} className="p-3 bg-white text-slate-400 hover:text-rose-600 border border-slate-100 rounded-xl transition-all shadow-sm"><Trash2 size={18} /></button>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>

           {copyStatus && (
              <div className="fixed bottom-10 right-10 bg-[#001e42] text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50">
                 <Check className="text-emerald-500" size={18} /> {copyStatus} Copied to clipboard
              </div>
           )}
        </div>
      )}

      {/* Blueprint Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-[#001e42]/90 backdrop-blur-xl flex items-center justify-center z-50 p-6 no-print">
           <div className="bg-white rounded-[56px] w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-500">
              <div className="p-10 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center shrink-0">
                 <h3 className="text-2xl font-black text-[#001e42] uppercase italic">Blueprint Architect</h3>
                 <button onClick={() => setShowTemplateModal(false)} className="p-3 text-slate-400 hover:text-rose-600 transition-colors"><X size={28}/></button>
              </div>
              <form onSubmit={handleAddTemplateInternal} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Itinerary Title</label>
                       <input required value={templateForm.title} onChange={e => setTemplateForm({...templateForm, title: e.target.value})} className="w-full border-2 border-slate-100 rounded-3xl p-5 text-xs font-black focus:border-orange-500 outline-none uppercase" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Destination</label>
                       <input required value={templateForm.destination} onChange={e => setTemplateForm({...templateForm, destination: e.target.value})} className="w-full border-2 border-slate-100 rounded-3xl p-5 text-xs font-black focus:border-orange-500 outline-none uppercase" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Budget (₹)</label>
                       <input type="number" required value={templateForm.totalCost} onChange={e => setTemplateForm({...templateForm, totalCost: parseInt(e.target.value)})} className="w-full border-2 border-slate-100 rounded-3xl p-5 text-xs font-black focus:border-orange-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Thumbnail URL</label>
                       <input required value={templateForm.thumbnail} onChange={e => setTemplateForm({...templateForm, thumbnail: e.target.value})} className="w-full border-2 border-slate-100 rounded-3xl p-5 text-[10px] font-bold focus:border-orange-500 outline-none" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#001e42] uppercase italic flex items-center gap-2"><Calendar size={16} className="text-orange-600" /> Logistics Stack</h4>
                    <div className="space-y-4">
                       {templateForm.days.map((day, idx) => (
                         <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                            <input value={day.title} onChange={e => {
                              const newDays = [...templateForm.days];
                              newDays[idx].title = e.target.value;
                              setTemplateForm({...templateForm, days: newDays});
                            }} className="bg-transparent border-b border-slate-200 font-black uppercase text-[10px] outline-none w-full pb-2" placeholder="Day Headline" />
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="pt-6 sticky bottom-0 bg-white">
                    <button type="submit" className="w-full bg-orange-600 text-white font-black py-6 rounded-[32px] uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-2xl flex items-center justify-center gap-3">
                       <Save size={18} /> Commit to Factory
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Webhook Deployment Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-[#001e42]/90 backdrop-blur-xl flex items-center justify-center z-50 p-6 no-print">
           <div className="bg-white rounded-[56px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-500">
              <div className="p-10 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center shrink-0">
                 <h3 className="text-2xl font-black text-[#001e42] uppercase italic">Deploy Pipeline</h3>
                 <button onClick={() => setShowWebhookModal(false)} className="p-3 text-slate-400 hover:text-rose-600 transition-colors"><X size={28}/></button>
              </div>
              <form onSubmit={handleDeployWebhook} className="p-10 space-y-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pipeline Name</label>
                       <input required value={webhookForm.name} onChange={e => setWebhookForm({...webhookForm, name: e.target.value})} placeholder="e.g. Website Home Form" className="w-full border-2 border-slate-100 rounded-3xl p-5 text-xs font-black focus:border-orange-500 outline-none uppercase" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Data Source</label>
                       <select value={webhookForm.source} onChange={e => setWebhookForm({...webhookForm, source: e.target.value as LeadSource})} className="w-full border-2 border-slate-100 rounded-3xl p-5 text-xs font-black focus:border-orange-500 outline-none uppercase appearance-none bg-white">
                          <option value={LeadSource.WEBSITE}>Website Pipeline</option>
                          <option value={LeadSource.FACEBOOK}>Facebook Leads Center</option>
                          <option value={LeadSource.GOOGLE}>Google Search Ads</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full bg-orange-600 text-white font-black py-6 rounded-[32px] uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-2xl flex items-center justify-center gap-3">
                    <Zap size={18} /> Deploy Ingestion Engine
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${active ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>
    {children}
  </button>
);

export default AdminPanel;