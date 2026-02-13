
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lead, LeadStatus, User, UserRole, FollowUp } from '../types';
import { 
  ArrowLeft, Mail, Phone, MapPin, IndianRupee, Calendar, 
  User as UserIcon, Clock, Share2, Plus, Trash2, Check, 
  AlertCircle, Zap, ChevronRight 
} from 'lucide-react';

interface LeadDetailsProps {
  leads: Lead[];
  currentUser: User;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onReassign: (id: string, dept: UserRole) => void;
  onUpdateFollowUps: (id: string, followUps: FollowUp[]) => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ leads, currentUser, onUpdateStatus, onReassign, onUpdateFollowUps }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lead = leads.find(l => l.id === id);

  if (!lead) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/leads')} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[#001e42] tracking-tight uppercase italic">{lead.name}</h1>
              <span className="text-[10px] px-3 py-1 rounded-lg bg-blue-600 text-white font-bold uppercase tracking-wider">{lead.status}</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">ID: {lead.id} • Registered {new Date(lead.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-orange-600/10">
            <Share2 size={16} /> Share Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
            <h3 className="text-sm font-extrabold text-[#001e42] mb-8 flex items-center gap-2 uppercase italic">
              <span className="w-1 h-5 bg-orange-600 rounded-full"></span> Traveller Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailBlock icon={<Mail size={18}/>} label="Email Address" value={lead.email} />
              <DetailBlock icon={<Phone size={18}/>} label="Contact Number" value={lead.phone} />
              <DetailBlock icon={<MapPin size={18}/>} label="Primary Destination" value={lead.destination} highlight />
              <DetailBlock icon={<IndianRupee size={18}/>} label="Planned Budget" value={lead.budget} />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-[#001e42] uppercase italic">Tactical History</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Engagement touchpoints.</p>
              </div>
              <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                <Plus size={20} />
              </button>
            </div>
            <div className="p-8 space-y-4">
               {/* Placeholder for timeline items */}
               <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                       <Clock size={16} />
                    </div>
                    <div className="w-0.5 flex-1 bg-slate-100 my-2"></div>
                  </div>
                  <div className="pb-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">12 Oct 2023 • 10:30 AM</p>
                    <p className="text-sm font-bold text-[#001e42] mt-1 italic">Initial Qualification Call</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Guest is interested in a 5-day package with focus on boutique stays.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#001e42] p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden">
            <Zap size={140} className="absolute -right-8 -top-8 opacity-5 rotate-12" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <ActionButton label="Dispatch Proposal" />
              <ActionButton label="Log WhatsApp Interaction" />
              <ActionButton label="Request Reservation Sync" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailBlock: React.FC<{ icon: React.ReactNode; label: string; value: string; highlight?: boolean }> = ({ icon, label, value, highlight }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
      {icon} {label}
    </div>
    <p className={`text-base font-bold italic truncate ${highlight ? 'text-orange-600' : 'text-slate-800'}`}>{value}</p>
  </div>
);

const ActionButton: React.FC<{ label: string }> = ({ label }) => (
  <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 text-left group">
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
  </button>
);

export default LeadDetails;
