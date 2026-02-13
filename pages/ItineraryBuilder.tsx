import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useLocation } = RouterDOM as any;

import { Lead, PrebuiltItinerary, User, UserRole } from '../types';
import { 
  ArrowRight,
  ChevronLeft,
  Printer,
  MessageCircle,
  Mountain,
  Loader2,
  X,
  Sparkles,
  MapPin,
  Plus
} from 'lucide-react';

interface ItineraryBuilderProps {
  leads: Lead[];
  templates: PrebuiltItinerary[];
  currentUser: User;
}

const BRAND_LOGO_URL = "https://i.ibb.co/vzR0y6y/lmt-logo.png"; 

const IMAGERY = {
  COVER: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop",
  HORSE: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1200&auto=format&fit=crop"
};

const DESTINATION_GALLERY: Record<string, string[]> = {
  'Darjeeling': [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=60&w=800",
    "https://images.unsplash.com/photo-1540339830252-44a38be1340a?auto=format&fit=crop&q=60&w=800",
    "https://images.unsplash.com/photo-1596202113262-959c5d011684?auto=format&fit=crop&q=60&w=800"
  ]
};

const INITIAL_DARJEELING_PAGES = [
  {
    day: 1,
    title: "NJP/ IXB To Darjeeling",
    image: IMAGERY.HORSE,
    content: "Arrival at New Jalpaiguri Railway Station(NJP)/ Bagdogra Airport(IXB) & transfer to Darjeeling. Check-in and evening at Mall Road."
  },
  {
    day: 2,
    title: "Darjeeling Local Sightseeing",
    image: IMAGERY.HORSE,
    content: "Early morning sunrise at Tiger Hill (2590 m). Visit Ghoom Monastery and Batasia Loop. After breakfast, visit Japanese Temple and Peace Pagoda."
  },
  {
    day: 3,
    title: "Darjeeling surrounding offbeat",
    image: IMAGERY.HORSE,
    content: "Visit Lamahatta Eco Park, Tinchuley view point and tea gardens. Enjoy the serene pine forests and mountain views."
  },
  {
    day: 4,
    title: "Transfer to NJP/ IXB via Mirik",
    image: IMAGERY.HORSE,
    content: "Drive via Mirik Lake. Enjoy boating and horse riding if time permits before dropping off for your journey back home."
  }
];

const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ leads, templates, currentUser }) => {
  const location = useLocation();
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [view, setView] = useState<'selection' | 'preview'>('selection');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeDayIdx, setActiveDayIdx] = useState<number | null>(null);
  const [itineraryPages, setItineraryPages] = useState(INITIAL_DARJEELING_PAGES);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const leadIdFromUrl = params.get('leadId');
    if (leadIdFromUrl) {
      setSelectedLeadId(leadIdFromUrl);
      setView('preview');
    }
  }, [location.search]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeDayIdx !== null) {
      setIsOptimizing(true);
      try {
        const optimizedImage = await compressImage(file);
        const updatedPages = [...itineraryPages];
        updatedPages[activeDayIdx] = { ...updatedPages[activeDayIdx], image: optimizedImage };
        setItineraryPages(updatedPages);
      } catch (error) {
        console.error("Optimization error:", error);
      } finally {
        setIsOptimizing(false);
        setActiveDayIdx(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handlePrint = () => {
    const element = document.getElementById('itinerary-proposal-container');
    if (!element) {
        alert("Proposal container not found. Please try again.");
        return;
    }
    
    const clientName = selectedLead?.name || 'Guest';
    const filename = `Itinerary_${clientName.replace(/\s+/g, '_')}.pdf`;
    
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
    
    let message = `*🌟 BESPOKE HIMALAYAN JOURNEY 🌟*\n`;
    message += `Exclusively prepared for: *${selectedLead.name}*\n\n`;
    message += `Greetings from *Let Me Travel*! Below is your personalized excursion blueprint:\n\n`;
    
    itineraryPages.forEach((day) => {
      message += `*DAY ${day.day}: ${day.title.toUpperCase()}*\n`;
      message += `📍 ${day.content}\n\n`;
    });
    
    message += `---\n`;
    message += `*Designed by:* ${currentUser.name}\n`;
    message += `*Let Me Travel Signature Collection*\n`;
    message += `_We turn destinations into memories._`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 relative">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      {showGallery && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-[#001e42]/80 backdrop-blur-md no-print">
           <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in duration-300 shadow-2xl">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h3 className="text-2xl font-black text-[#001e42] uppercase italic">Proposal Asset Library</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Select high-impact visuals</p>
                 </div>
                 <button onClick={() => setShowGallery(false)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors bg-white rounded-full shadow-sm"><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                 {Object.entries(DESTINATION_GALLERY).map(([loc, imgs]) => (
                    <div key={loc} className="mb-10">
                       <h4 className="text-xs font-black text-orange-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">
                          <MapPin size={14}/> {loc}
                       </h4>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {imgs.map((url, i) => (
                             <button 
                                key={i} 
                                onClick={() => {
                                   if (activeDayIdx !== null) {
                                      const updatedPages = [...itineraryPages];
                                      updatedPages[activeDayIdx] = { ...updatedPages[activeDayIdx], image: url };
                                      setItineraryPages(updatedPages);
                                   }
                                   setShowGallery(false);
                                   setActiveDayIdx(null);
                                }}
                                className="aspect-video rounded-2xl overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all group relative shadow-md"
                             >
                                <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" loading="lazy" decoding="async" crossOrigin="anonymous" />
                                <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <Plus className="text-white" size={32} />
                                </div>
                             </button>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {isOptimizing && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-[130] flex items-center justify-center no-print">
          <div className="bg-[#001e42] p-8 rounded-[40px] shadow-2xl flex items-center gap-6">
            <Sparkles className="text-orange-500 animate-pulse" size={24} />
            <div className="text-white">
              <p className="text-sm font-black uppercase tracking-widest">Optimizing Asset</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Compressing for faster proposal loading</p>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-[#001e42]/60 backdrop-blur-md z-[130] flex items-center justify-center no-print">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-orange-600" size={48} />
            <p className="text-sm font-black uppercase tracking-widest text-[#001e42]">Exporting PDF...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-3xl font-black text-[#001e42] uppercase italic">Proposal Engine</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest text-[9px]">Real-time visual customization</p>
        </div>
        {view === 'preview' && (
          <div className="flex gap-3">
            <button type="button" onClick={handlePrint} className="bg-[#001e42] text-white font-black px-8 py-3 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl">
               <Printer size={18} /> Download / Print PDF
            </button>
            <button onClick={() => setView('selection')} className="bg-white border border-slate-200 text-slate-500 font-black px-8 py-3 rounded-2xl hover:border-orange-500 hover:text-orange-600 transition-all uppercase tracking-widest text-[10px] flex items-center gap-2">
               <ChevronLeft size={18} /> Back to Selection
            </button>
          </div>
        )}
      </div>

      {view === 'selection' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-3 space-y-6 bg-white p-10 rounded-[40px] border border-slate-200 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#001e42] uppercase italic flex items-center gap-4">
                   <Mountain className="text-orange-600" /> Package Architecture
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">4 Days / 3 Nights Darjeeling</span>
              </div>
              
              <div className="space-y-6">
                {itineraryPages.map((day, idx) => (
                  <div key={day.day} className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                    <div className="relative w-full md:w-48 aspect-video md:aspect-square overflow-hidden rounded-2xl shadow-lg shrink-0 border-4 border-white">
                      <img src={day.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={day.title} loading="lazy" decoding="async" crossOrigin="anonymous" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-2 p-3">
                         <button 
                            onClick={() => { setActiveDayIdx(idx); fileInputRef.current?.click(); }}
                            className="w-full bg-white text-[#001e42] py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-colors"
                         >
                            Upload
                         </button>
                         <button 
                            onClick={() => { setActiveDayIdx(idx); setShowGallery(true); }}
                            className="w-full bg-[#001e42] text-white py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors"
                         >
                            Library
                         </button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Day {day.day}</span>
                         <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                         <h4 className="font-black text-[#001e42] uppercase italic text-sm">{day.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{day.content}"</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
           
           <div className="lg:col-span-1 bg-[#001e42] p-8 rounded-[40px] shadow-2xl space-y-8 sticky top-6 h-fit no-print">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] ml-2">Assign to Lead</p>
                 <select 
                    value={selectedLeadId} 
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-3xl p-5 text-white uppercase text-xs font-black outline-none focus:border-orange-500 appearance-none shadow-inner"
                 >
                    <option value="" className="text-black">Select Lead...</option>
                    {leads.map(l => <option key={l.id} value={l.id} className="text-black">{l.name}</option>)}
                 </select>
              </div>
              <button 
                 disabled={!selectedLeadId} 
                 onClick={() => setView('preview')} 
                 className="w-full bg-orange-600 text-white py-6 rounded-[28px] font-black uppercase text-xs tracking-widest hover:bg-orange-700 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                 Preview Proposal <ArrowRight size={20} />
              </button>
           </div>
        </div>
      ) : (
        <div className="space-y-16 max-w-[800px] mx-auto animate-in fade-in zoom-in duration-500">
           <div id="itinerary-proposal-container" className="bg-white shadow-2xl border border-slate-100 overflow-hidden rounded-lg">
              <div className="p-20 flex flex-col items-center text-center gap-10 bg-[#001e42] text-white page-break">
                 <div className="w-48 h-auto bg-white p-6 rounded-[40px] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-500">
                    <img src={BRAND_LOGO_URL} alt="Let Me Travel" className="w-full h-auto object-contain" crossOrigin="anonymous" />
                 </div>
                 <h2 className="text-5xl font-black uppercase italic tracking-tighter">Bespoke Himalayan Journey</h2>
                 <div className="w-20 h-1 bg-orange-600 rounded-full"></div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Exclusively for</p>
                    <p className="text-3xl font-black italic">{selectedLead?.name || 'Valued Guest'}</p>
                 </div>
              </div>
              <div className="p-10 space-y-16">
                {itineraryPages.map((day) => (
                  <div key={day.day} className="space-y-8 page-break pt-10 first:pt-0">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-slate-50 text-[#001e42] flex items-center justify-center text-3xl font-black italic shadow-sm border border-slate-100">
                          {day.day}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Excursion Logistics</p>
                          <h3 className="text-3xl font-black text-[#001e42] uppercase italic">{day.title}</h3>
                       </div>
                    </div>
                    <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white aspect-video relative">
                       <img src={day.image} className="w-full h-full object-cover" alt={day.title} loading="eager" decoding="sync" crossOrigin="anonymous" />
                    </div>
                    <p className="text-xl text-slate-700 leading-relaxed font-medium italic px-10 border-l-4 border-orange-500">"{day.content}"</p>
                  </div>
                ))}
              </div>
              <div className="p-20 bg-slate-50 flex flex-col items-center text-center gap-10 page-break">
                 <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designed by</p>
                    <p className="text-2xl font-black text-[#001e42] italic">{currentUser.name}</p>
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-[0.2em]">Let Me Travel Signature Collection</p>
                 </div>
              </div>
           </div>
           <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#001e42]/95 backdrop-blur-2xl text-white px-10 py-5 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-10 z-50 border border-white/10 scale-110 no-print">
              <button onClick={handleShareWhatsApp} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:text-orange-500 transition-colors">
                <MessageCircle size={22} className="text-[#25D366]" /> Share via WhatsApp
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

export default ItineraryBuilder;