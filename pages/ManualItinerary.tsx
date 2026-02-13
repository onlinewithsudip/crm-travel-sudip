import React, { useState, useMemo, useRef } from 'react';
import { Lead, User } from '../types';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  ChevronLeft, 
  ArrowRight,
  User as UserIcon,
  Globe,
  Printer,
  MessageCircle,
  Image as ImageIcon,
  CheckCircle2,
  MapPin,
  Mountain,
  Loader2,
  Sparkles,
  Search,
  X
} from 'lucide-react';

interface ManualItineraryProps {
  leads: Lead[];
  currentUser: User;
}

interface CustomDay {
  location: string;
  moduleName: string;
  description: string;
  activities: string;
  image: string;
  addons: {
    viaNamchi: boolean;
    mikir: boolean;
  };
}

const LOCATIONS = ['Darjeeling', 'Sikkim', 'Gangtok', 'North Sikkim', 'Pelling', 'Kalimpong'];

const DESTINATION_GALLERY: Record<string, string[]> = {
  'Darjeeling': [
    "https://images.unsplash.com/photo-1596202113262-959c5d011684?auto=format&fit=crop&q=60&w=800",
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=60&w=800"
  ]
};

const ManualItinerary: React.FC<ManualItineraryProps> = ({ leads, currentUser }) => {
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [days, setDays] = useState<CustomDay[]>([]);
  const [view, setView] = useState<'builder' | 'preview'>('builder');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeImageUploadIdx, setActiveImageUploadIdx] = useState<number | null>(null);

  const selectedLead = useMemo(() => leads.find(l => l.id === selectedLeadId), [leads, selectedLeadId]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000; 
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }
          const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          resolve(optimizedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const addDay = () => {
    if (days.length < 10) {
      setDays([...days, { 
        location: 'Darjeeling', 
        moduleName: 'Morning Explorer', 
        description: 'Breathtaking views and local experiences...', 
        activities: 'Sightseeing, Local Food, Walk',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
        addons: { viaNamchi: false, mikir: false }
      }]);
    }
  };

  const updateDay = (index: number, updates: Partial<CustomDay>) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], ...updates };
    setDays(newDays);
  };

  const handlePrint = () => {
    const element = document.getElementById('manual-itinerary-container');
    if (!element) {
        alert("Proposal container not found.");
        return;
    }
    
    const clientName = selectedLead?.name || 'Guest';
    const filename = `Custom_Itinerary_${clientName.replace(/\s+/g, '_')}.pdf`;
    
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const h2p = (window as any).html2pdf;
    if (h2p) {
        setIsProcessing(true);
        h2p().set(opt).from(element).save().then(() => {
            setIsProcessing(false);
        }).catch((err: any) => {
            console.error("PDF Export Error:", err);
            setIsProcessing(false);
            window.print();
        });
    } else {
        window.print();
    }
  };

  const handleShareWhatsApp = () => {
    if (!selectedLead) return alert("Select lead first.");
    
    let message = `*🌟 CUSTOM HIMALAYAN EXPEDITION 🌟*\n`;
    message += `Exclusively for: *${selectedLead.name}*\n\n`;
    message += `Greetings from *Let Me Travel*! Your handcrafted itinerary is ready for review:\n\n`;
    
    days.forEach((day, idx) => {
      message += `*DAY ${idx + 1}: ${day.moduleName.toUpperCase()}*\n`;
      message += `📍 Location: ${day.location}\n`;
      message += `📝 ${day.description}\n\n`;
    });
    
    message += `---\n`;
    message += `*Architect:* ${currentUser.name}\n`;
    message += `*Let Me Travel Signature Collection*\n`;
    message += `_We turn destinations into memories._`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 relative">
      <input type="file" ref={fileInputRef} className="hidden no-print" accept="image/*" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file && activeImageUploadIdx !== null) {
          setIsOptimizing(true);
          try {
            const opt = await compressImage(file);
            updateDay(activeImageUploadIdx, { image: opt });
          } finally {
            setIsOptimizing(false);
            setActiveImageUploadIdx(null);
          }
        }
      }} />

      {isProcessing && (
        <div className="fixed inset-0 bg-[#001e42]/60 backdrop-blur-md z-[100] flex items-center justify-center no-print">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <Loader2 className="animate-spin text-orange-600" size={56} />
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#001e42]">Generating PDF Proposal...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 no-print">
        <div>
          <h1 className="text-3xl font-black text-[#001e42] uppercase italic tracking-tighter">Itinerary Designer</h1>
          <p className="text-sm text-slate-400 font-bold italic mt-1 uppercase tracking-widest text-[9px]">Manual Construction Mode</p>
        </div>
        {view === 'preview' && (
          <div className="flex gap-3">
             <button type="button" onClick={handlePrint} className="bg-[#001e42] text-white font-black px-8 py-3 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl">
              <Printer size={18} /> Download / Print PDF
            </button>
            <button onClick={() => setView('builder')} className="bg-white border border-slate-200 text-slate-500 font-black px-8 py-3 rounded-2xl hover:border-orange-500 hover:text-orange-600 transition-all uppercase tracking-widest text-[10px] flex items-center gap-2">
              <ChevronLeft size={18} /> Back to Design
            </button>
          </div>
        )}
      </div>

      {view === 'builder' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-[#001e42] uppercase italic flex items-center gap-4">
                  <Mountain className="text-orange-600" /> Itinerary Structure
                </h3>
              </div>
              <div className="space-y-12">
                {days.map((day, idx) => (
                  <div key={idx} className="group relative p-10 bg-slate-50/50 border border-slate-100 rounded-[40px] hover:bg-white hover:shadow-2xl transition-all">
                    <div className="absolute -top-5 -left-5 w-14 h-14 rounded-2xl bg-[#001e42] text-white flex items-center justify-center font-black text-2xl italic shadow-2xl no-print">{idx + 1}</div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      <div className="md:col-span-4 space-y-4">
                        <div className="aspect-video bg-slate-200 rounded-3xl overflow-hidden relative border-4 border-white shadow-lg">
                          <img src={day.image} className="w-full h-full object-cover" alt={`Day ${idx+1}`} loading="lazy" decoding="async" crossOrigin="anonymous" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-3 p-4 no-print">
                             <button onClick={() => { setActiveImageUploadIdx(idx); fileInputRef.current?.click(); }} className="w-full bg-white text-[#001e42] py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-colors">Upload New</button>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-8 space-y-6">
                         <input value={day.moduleName} onChange={(e) => updateDay(idx, { moduleName: e.target.value })} placeholder="Day Headline" className="w-full bg-transparent border-b-2 border-slate-200 p-2 text-xl font-black uppercase italic outline-none focus:border-orange-500" />
                         <textarea value={day.description} onChange={(e) => updateDay(idx, { description: e.target.value })} className="w-full bg-white border border-slate-100 p-4 rounded-2xl text-xs font-bold leading-relaxed outline-none focus:border-orange-500 shadow-inner h-24 resize-none" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addDay} className="w-full py-8 border-4 border-dashed border-slate-100 rounded-[40px] text-slate-300 font-black uppercase tracking-[0.4em] hover:border-orange-200 hover:text-orange-600 flex items-center justify-center gap-4 transition-all bg-white no-print"><Plus size={32} /> Append Next Day</button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6 no-print">
            <div className="bg-[#001e42] p-8 rounded-[40px] shadow-2xl space-y-8 sticky top-6 h-fit">
              <select value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 text-xs font-black text-white outline-none focus:border-orange-500 appearance-none uppercase shadow-inner">
                <option value="" className="bg-[#001e42]">Select Traveler...</option>
                {leads.map(lead => (<option key={lead.id} value={lead.id} className="bg-[#001e42]">{lead.name}</option>))}
              </select>
              <button disabled={days.length === 0 || !selectedLeadId} onClick={() => setView('preview')} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-[28px] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 transition-all">Preview Proposal <ArrowRight size={20} /></button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-16 max-w-[800px] mx-auto animate-in fade-in zoom-in duration-500">
           <div id="manual-itinerary-container" className="bg-white shadow-2xl border border-slate-100 overflow-hidden rounded-lg">
              <div className="p-20 flex flex-col items-center text-center gap-10 bg-slate-50 page-break">
                 <div className="w-32 h-32 bg-orange-600 rounded-[40px] flex items-center justify-center shadow-2xl rotate-6">
                    <Mountain size={64} className="text-white" />
                 </div>
                 <h2 className="text-6xl font-black text-[#001e42] uppercase italic tracking-tighter text-wrap">Your Himalayan Expedition</h2>
                 <div className="w-20 h-1 bg-orange-600 rounded-full"></div>
                 <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.4em]">Prepared for</p>
                    <p className="text-3xl font-black text-[#001e42] uppercase italic">{selectedLead?.name || 'Valued Guest'}</p>
                 </div>
              </div>
              <div className="p-10 space-y-16">
                {days.map((day, idx) => (
                  <div key={idx} className="space-y-8 page-break pt-10 first:pt-0">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-3xl font-black italic shadow-sm">{idx + 1}</div>
                       <div>
                          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.3em]">{day.location}</p>
                          <h3 className="text-3xl font-black text-[#001e42] uppercase italic">{day.moduleName}</h3>
                       </div>
                    </div>
                    <div className="rounded-[32px] overflow-hidden shadow-xl border-4 border-white aspect-video relative">
                       <img src={day.image} className="w-full h-full object-cover" alt={day.moduleName} loading="eager" decoding="sync" crossOrigin="anonymous" />
                    </div>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium italic">"{day.description}"</p>
                  </div>
                ))}
              </div>
           </div>
           <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#001e42]/95 backdrop-blur-2xl text-white px-10 py-5 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-10 z-50 border border-white/10 scale-110 no-print">
              <button onClick={handleShareWhatsApp} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:text-orange-500 transition-colors">
                <MessageCircle size={22} className="text-[#25D366]" /> Send to Guest
              </button>
              <div className="w-px h-8 bg-white/10"></div>
              <button type="button" onClick={handlePrint} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:text-orange-500 transition-colors">
                <Printer size={22} /> Download / Print PDF
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ManualItinerary;