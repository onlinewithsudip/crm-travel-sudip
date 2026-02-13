import React from 'react';
import { Lead, User, UserRole } from '../types';
import { EditableText } from '../App';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ArrowRight,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';

interface DashboardProps {
  leads: Lead[];
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ leads, currentUser }) => {
  const isAdminTier = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;

  const leadSourceData = [
    { name: 'Facebook', value: 45 },
    { name: 'Website', value: 30 },
    { name: 'Manual', value: 15 },
    { name: 'Partner', value: 10 },
  ];

  const COLORS = ['#f26522', '#001e42', '#fbbf24', '#64748b'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#001e42] tracking-tight uppercase italic">
            <EditableText 
              contentKey="dash_title" 
              defaultVal={isAdminTier ? 'Agency Command' : 'My Workspace'} 
            />
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            <EditableText contentKey="dash_subtitle" defaultVal="Real-time operational pulse." />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title={<EditableText contentKey="stat_leads" defaultVal="Active Leads" />} value={leads.length.toString()} icon={<Users size={18} className="text-orange-600" />} trend="+12%" trendUp={true} />
        <StatCard title={<EditableText contentKey="stat_confirmed" defaultVal="Confirmed" />} value="42" icon={<CheckCircle2 size={18} className="text-emerald-600" />} trend="+4%" trendUp={true} />
        <StatCard title={<EditableText contentKey="stat_conversion" defaultVal="Conversion" />} value="32.8%" icon={<TrendingUp size={18} className="text-[#001e42]" />} trend="-1%" trendUp={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#001e42] p-6 rounded-[24px] shadow-xl text-white relative overflow-hidden group">
            <Zap size={100} className="absolute -right-4 -top-4 opacity-5 rotate-12 group-hover:scale-110 transition-all duration-700" />
            <div className="relative flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase italic text-orange-500 tracking-wider">
                  <EditableText contentKey="queue_title" defaultVal="Mission Queue" />
                </h3>
                <p className="text-slate-400 font-bold text-[9px] mt-0.5 uppercase tracking-widest opacity-80">
                  <EditableText contentKey="queue_subtitle" defaultVal="Priority Targets" />
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              {leads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-xs italic text-white shadow-lg">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold italic truncate w-32">{lead.name}</p>
                      <p className="text-[9px] text-slate-400 font-medium">Proposal: {lead.destination}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm min-w-0">
            <h3 className="text-xs font-bold text-[#001e42] mb-6 flex items-center gap-2 uppercase italic tracking-wider">
              <span className="w-1 h-4 bg-orange-600 rounded-full"></span>
              <EditableText contentKey="rev_source_title" defaultVal="Revenue Sources" />
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadSourceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 600, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 600, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '10px'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                    {leadSourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-[#001e42] uppercase italic tracking-wider">
              <EditableText contentKey="recent_act_title" defaultVal="Recent Activity" />
            </h3>
          </div>
          <div className="space-y-4 flex-1">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-orange-600 text-[10px] group-hover:bg-orange-50 transition-colors">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 leading-tight truncate w-24 italic">{lead.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium truncate w-24">{lead.destination}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 pt-4 border-t border-slate-100 text-[9px] font-bold text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors flex items-center justify-center gap-2 group">
            <EditableText contentKey="btn_view_pipeline" defaultVal="View Full Pipeline" /> <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: React.ReactNode; value: string; icon: React.ReactNode; trend: string; trendUp: boolean }> = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className={`flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend} {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
      </div>
    </div>
    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest opacity-80">{title}</p>
    <h4 className="text-xl font-bold text-[#001e42] mt-0.5 tracking-tight">{value}</h4>
  </div>
);

export default Dashboard;