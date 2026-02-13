import React, { useState } from 'react';
// Fix for useNavigate missing from react-router-dom exports in some environments.
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;

import { Lead, LeadStatus, LeadSource, User, UserRole } from '../types';
import { Search, Filter, Plus, Mail, ExternalLink, Calendar, X, Save, User as UserIcon, MapPin, IndianRupee, MessageSquare, Phone } from 'lucide-react';

interface LeadsProps {
  leads: Lead[];
  currentUser: User;
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const Leads: React.FC<LeadsProps> = ({ leads, onAddLead, onUpdateStatus, currentUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: LeadSource.MANUAL,
    destination: '',
    budget: '',
    notes: '',
    assignedAgent: currentUser.name,
    assignedDepartment: currentUser.role
  });

  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.BOOKED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case LeadStatus.DECISION_PENDING: return 'bg-amber-50 text-amber-700 border-amber-100';
      case LeadStatus.PROPOSAL_SENT: return 'bg-slate-50 text-slate-600 border-slate-200';
      case LeadStatus.LOST: return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLead({
      ...formData,
      status: LeadStatus.QUALIFIED
    });
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      source: LeadSource.MANUAL,
      destination: '',
      budget: '',
      notes: '',
      assignedAgent: currentUser.name,
      assignedDepartment: currentUser.role
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#001e42] tracking-tight uppercase italic">Lead Pipeline</h1>
          <p className="text-xs text-slate-500 font-medium">Tracking high-intent prospects and conversions.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-orange-600 text-white px-5 py-2.5 rounded-xl hover:bg-orange-700 flex items-center gap-2 font-bold shadow-lg shadow-orange-600/10 transition-all text-xs uppercase tracking-widest"
          >
            <Plus size={16} /> New Enquiry
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search traveler or destination..." 
              className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl text-xs font-semibold focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all outline-none text-slate-700"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
             <FilterButton icon={<Filter size={14} />}>Status</FilterButton>
             <FilterButton icon={<Calendar size={14} />}>Timeline</FilterButton>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 py-4">Client Information</th>
                <th className="px-6 py-4">Engagement Source</th>
                <th className="px-6 py-4">Target Destination</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs italic shadow-sm group-hover:scale-110 transition-transform">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight italic">{lead.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <Mail size={11} className="text-slate-300" /> {lead.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 italic">{lead.source}</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">{new Date(lead.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700 italic">{lead.destination}</p>
                    <p className="text-[9px] text-orange-600 font-bold mt-0.5 uppercase tracking-widest">{lead.budget}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[9px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-slate-300 hover:text-orange-600 transition-colors p-1.5 rounded-lg hover:bg-white shadow-sm hover:shadow">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="py-16 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-300" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No matching records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001e42]/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#001e42] uppercase italic leading-none">New Enquiry</h2>
                <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-widest opacity-60">Manual ingestion form</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <UserIcon size={12}/> Traveler Name
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Full legal name"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-black uppercase outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <Mail size={12}/> Email Address
                  </label>
                  <input 
                    required 
                    type="email" 
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-black outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <Phone size={12}/> Phone Number
                  </label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-black outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <Plus size={12}/> Source
                  </label>
                  <select 
                    value={formData.source}
                    onChange={e => setFormData({...formData, source: e.target.value as LeadSource})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-black uppercase outline-none appearance-none"
                  >
                    {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <MapPin size={12}/> Destination
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Sikkim, Darjeeling"
                    value={formData.destination}
                    onChange={e => setFormData({...formData, destination: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-black uppercase outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <IndianRupee size={12}/> Budget Range
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. ₹50,000"
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-black uppercase outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <MessageSquare size={12}/> Initial Requirements / Notes
                </label>
                <textarea 
                  rows={3}
                  placeholder="Guest interests, group size, special requests..."
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none focus:border-orange-500 transition-all resize-none"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-orange-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[11px] hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/10 flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Save Lead to Pipeline
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-8 py-4 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterButton: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-white hover:border-orange-200 transition-all bg-white shadow-sm">
    {icon} {children}
  </button>
);

export default Leads;