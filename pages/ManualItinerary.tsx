
import React, { useState, useMemo } from 'react';
import { Lead, User, UserRole, Quotation, ItineraryDay, HotelOption, PrebuiltItinerary } from '../types';
import { EditableText, BRAND_LOGO_URL } from '../App';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Car, 
  Hotel, 
  CheckCircle, 
  XCircle, 
  FileText, 
  ChevronRight,
  Mountain,
  Zap,
  IndianRupee,
  TrendingUp,
  User as UserIcon,
  Copy,
  ChevronUp,
  ChevronDown,
  Compass,
  Check,
  Calendar,
  Users,
  Star,
  Globe,
  Mail,
  Phone,
  MapPin,
  Play
} from 'lucide-react';

interface ManualItineraryProps {
  leads: Lead[];
  currentUser: User;
  onAddTemplate?: (t: PrebuiltItinerary) => void;
}

const SAMPLE_BANNER = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop";

const LOGISTICS_REGIONS = ["Darjeeling", "Gangtok", "Pelling", "North Sikkim", "Bhutan"];

const REGIONAL_ACTIVITY_BANK: Record<string, string[]> = {
  "darjeeling": ["Transfer to Darjeeling", "Darjeeling Sightseeing", "Lamahatta Excursion", "Mirik Excursion", "Darjeeling to IXB / NJP Transfer"],
  "gangtok": ["Transfer to Gangtok", "Transfer to Lachung", "Lachung Sightseeing", "Lachung to Gangtok", "Gangtok Sightseeing"],
  "pelling": ["Pelling Transfer", "Pelling Sightseeing", "Namchi & Ravangla Excursion", "Transfer to IXB / NJP"]
};

const ManualItinerary: React.FC<ManualItineraryProps> = ({ leads, currentUser }) => {
  const [view, setView] = useState<'builder' | 'preview'>('builder');
  const [isBuilderActive, setIsBuilderActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  
  const [quote, setQuote] = useState<Quotation>({
    id: `LMT-REF-${Math.floor(Math.random() * 9000) + 1000}`,
    leadId: '',
    packageCode: 'LMT-HML-2025',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    startDate: '',
    endDate: '',
    title: 'Gangtok & Darjeeling Delight',
    duration: '4 Nights / 5 Days',
    adults: 2,
    kids: 0,
    travelDate: 'October 2025',
    travelers: '02 Adults',
    totalCost: 45000,
    taxAmount: 0,
    discount: 5,
    itinerary: [],
    hotels: [
      { id: 'h1', name: 'Elite Mountain Resort', location: 'Gangtok', category: 'Luxury Suite', starRating: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', pricePerNight: 2500 }
    ],
    vehicle: { id: 'v1', type: '4 Seater', rate: 3500 },
    vehicleInfo: 'Private Dedicated Luxury SUV',
    inclusions: ['Premium Stay with Breakfast & Dinner', 'Private Dedicated Vehicle', 'All Permits & Taxes', 'Meet & Greet Assistance'],
    exclusions: ['Airfare / Train tickets', 'Personal Expenses', 'Lunch', 'Entry Fees'],
    bookingPolicy: '30% advance for confirmation.',
    cancellationPolicy: 'Non-refundable if cancelled within 7 days.',
    terms: 'Voucher valid only for specified dates.'
  });

  const pricingBreakdown = useMemo(() => {
    const days = quote.itinerary.length || 1;
    const nights = Math.max(days - 1, 1);
    const totalHotel = quote.hotels.reduce((sum, h) => sum + (h.pricePerNight * nights), 0);
    const totalVehicle = quote.vehicle.rate * days;
    const baseValue = totalHotel + totalVehicle + quote.totalCost;
    const markup = baseValue * 0.25;
    const totalWorth = baseValue + markup;
    const discountAmount = totalWorth * (quote.discount / 100);
    const finalPayable = totalWorth - discountAmount;
    
    return { totalHotel, totalVehicle, baseValue, markup, totalWorth, discountAmount, finalPayable };
  }, [quote.hotels, quote.vehicle, quote.itinerary, quote.discount, quote.totalCost]);

  const selectedLead = useMemo(() => leads.find(l => l.id === selectedLeadId), [leads, selectedLeadId]);

  const addDay = () => {
    const newDay: ItineraryDay = {
      day: quote.itinerary.length + 1,
      title: LOGISTICS_REGIONS[0],
      description: '',
      activities: [],
      meals: ['Breakfast', 'Dinner'],
      accommodation: ''
    };
    setQuote({ ...quote, itinerary: [...quote.itinerary, newDay] });
  };

  const toggleActivity = (dayIdx: number, activity: string) => {
    const newItinerary = [...quote.itinerary];
    const currentActivities = newItinerary[dayIdx].activities;
    if (currentActivities.includes(activity)) {
      newItinerary[dayIdx].activities = currentActivities.filter(a => a !== activity);
    } else {
      newItinerary[dayIdx].activities = [...currentActivities, activity];
    }
    setQuote({ ...quote, itinerary: newItinerary });
  };

  const handlePrint = () => {
    const element = document.getElementById('luxury-brochure-export');
    if (!element) return;
    setIsProcessing(true);
    const opt = {
      margin: 0,
      filename: `LetMeTravel_Brochure_${selectedLead?.name || 'Guest'}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    const h2p = (window as any).html2pdf;
    if (h2p) h2p().set(opt).from(element).save().then(() => setIsProcessing(false));
    else { window.print(); setIsProcessing(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-3xl font-black text-[#0F3C68] uppercase italic tracking-tighter">Luxury Brochure ERP</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Signature Design Factory</p>
        </div>
        <div className="flex gap-3">
          {isBuilderActive && (
            <div className="flex gap-2">
              {view === 'builder' ? (
                <button onClick={() => setView('preview')} className="bg-[#0F3C68] text-white font-black px-8 py-3 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl">
                  <Zap size={18} className="text-sky-400" /> Finalize Brochure
                </button>
              ) : (
                <>
                  <button onClick={handlePrint} className="bg-[#0F3C68] text-white font-black px-8 py-3 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl">
                    <Printer size={18} /> {isProcessing ? 'Compiling...' : 'Export PDF'}
                  </button>
                  <button onClick={() => setView('builder')} className="bg-white border border-slate-200 text-slate-500 font-black px-8 py-3 rounded-2xl hover:border-sky-500 transition-all uppercase tracking-widest text-[10px]">
                    Back to Design
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {!isBuilderActive ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-slate-200 rounded-[56px] shadow-2xl p-12 text-center space-y-8 animate-in zoom-in duration-500">
           <div className="w-24 h-24 bg-[#0F3C68]/5 rounded-full flex items-center justify-center text-[#0F3C68] mb-4 animate-pulse">
              <Play size={48} fill="currentColor" />
           </div>
           <div>
              <h2 className="text-4xl font-black text-[#0F3C68] uppercase italic tracking-tighter mb-2">Initialize Luxury Blueprint</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Access Exclusive Activity Banks & Pricing Engine</p>
           </div>
           
           <div className="w-full max-w-sm space-y-4">
              <select 
                value={selectedLeadId} 
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-xs font-black uppercase outline-none focus:border-[#0F3C68] appearance-none bg-white shadow-inner"
              >
                <option value="">Select Target Prospect...</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.name} - {l.destination}</option>)}
              </select>
              
              <button 
                disabled={!selectedLeadId}
                onClick={() => { setIsBuilderActive(true); if (quote.itinerary.length === 0) addDay(); }}
                className="w-full bg-[#0F3C68] text-white py-6 rounded-[32px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-4 disabled:opacity-50"
              >
                Activate Builder Core <ChevronRight size={20} />
              </button>
           </div>
        </div>
      ) : (
        view === 'builder' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputGroup label="Package Title" value={quote.title} onChange={v => setQuote({...quote, title: v})} />
                  <InputGroup label="Duration (e.g. 4 Nights / 5 Days)" value={quote.duration} onChange={v => setQuote({...quote, duration: v})} />
                  <InputGroup label="Travel Date" value={quote.travelDate} onChange={v => setQuote({...quote, travelDate: v})} />
                  <InputGroup label="Reference ID" value={quote.id} onChange={v => setQuote({...quote, id: v})} />
                </div>
              </section>

              <div className="space-y-6">
                {quote.itinerary.map((day, idx) => (
                  <div key={idx} className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-8 relative group">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#0F3C68] text-white flex items-center justify-center text-xl font-black italic shadow-lg">D{day.day}</div>
                        <div className="flex flex-col">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Region Setting</label>
                          <select 
                            value={day.title} 
                            onChange={e => {
                              const it = [...quote.itinerary];
                              it[idx].title = e.target.value;
                              it[idx].activities = []; 
                              setQuote({...quote, itinerary: it});
                            }}
                            className="bg-transparent text-xl font-black uppercase italic text-[#0F3C68] outline-none border-b-2 border-transparent focus:border-sky-500 cursor-pointer"
                          >
                            {LOGISTICS_REGIONS.map(reg => <option key={reg} value={reg} className="text-black not-italic font-bold">{reg}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 no-print">
                        <button onClick={() => {
                           const it = quote.itinerary.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }));
                           setQuote({ ...quote, itinerary: it });
                        }} className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={18}/></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-2 px-2">
                             <Compass size={16} className="text-sky-600" />
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select {day.title} Highlights</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                             {(REGIONAL_ACTIVITY_BANK[day.title.toLowerCase()] || []).map(act => (
                               <button 
                                 key={act}
                                 onClick={() => toggleActivity(idx, act)}
                                 className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${day.activities.includes(act) ? 'bg-[#0F3C68] text-white border-[#0F3C68]' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-sky-200'}`}
                               >
                                 {day.activities.includes(act) ? (
                                    <div className="w-5 h-5 bg-sky-500 rounded-lg flex items-center justify-center text-white"><Check size={12} strokeWidth={4} /></div>
                                 ) : (
                                    <div className="w-5 h-5 bg-white border border-slate-200 rounded-lg"></div>
                                 )}
                                 <span className="text-[11px] font-black uppercase italic">{act}</span>
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-6">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2"><FileText size={12}/> Excursion Notes</label>
                          <textarea 
                             className="w-full bg-slate-50 border border-slate-200 rounded-[32px] p-6 text-xs font-bold leading-relaxed outline-none focus:border-sky-500 h-full min-h-[250px] resize-none shadow-inner" 
                             value={day.description}
                             onChange={e => {
                               const it = [...quote.itinerary];
                               it[idx].description = e.target.value;
                               setQuote({...quote, itinerary: it});
                             }}
                          />
                       </div>
                    </div>
                  </div>
                ))}
                
                <button onClick={addDay} className="w-full py-8 border-4 border-dashed border-slate-100 rounded-[48px] text-slate-300 hover:border-sky-200 hover:text-sky-400 transition-all font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 group">
                  <Plus className="group-hover:rotate-90 transition-transform" /> Add Journey Day
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-8">
                  <h3 className="text-lg font-black text-[#0F3C68] uppercase italic flex items-center gap-3"><Hotel className="text-sky-600" /> Hotel Setting</h3>
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                    <InputGroup label="Hotel Name" value={quote.hotels[0].name} onChange={v => { const hs = [...quote.hotels]; hs[0].name = v; setQuote({...quote, hotels: hs}); }} />
                    <InputGroup label="Price Per Night (Base)" type="number" value={quote.hotels[0].pricePerNight.toString()} onChange={v => { const hs = [...quote.hotels]; hs[0].pricePerNight = parseInt(v) || 0; setQuote({...quote, hotels: hs}); }} />
                  </div>
                </section>
                <section className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-8">
                  <h3 className="text-lg font-black text-[#0F3C68] uppercase italic flex items-center gap-3"><Car className="text-sky-600" /> Transport Fleet</h3>
                  <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                    <InputGroup label="Vehicle Name" value={quote.vehicleInfo} onChange={v => setQuote({...quote, vehicleInfo: v})} />
                    <InputGroup label="Daily Transport Cost" type="number" value={quote.vehicle.rate.toString()} onChange={v => setQuote({...quote, vehicle: {...quote.vehicle, rate: parseInt(v) || 0}})} />
                  </div>
                </section>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-6">
              <div className="bg-[#0F3C68] p-8 rounded-[48px] shadow-2xl text-white space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={100}/></div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-sky-400 flex items-center gap-2"><IndianRupee size={16} /> Financial Ledger</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Value</span><span className="text-xs font-black italic">₹{pricingBreakdown.baseValue}</span></div>
                   <div className="flex justify-between items-center text-emerald-400"><span className="text-[10px] font-black uppercase tracking-widest">Agency Margin (+25%)</span><span className="text-xs font-black italic">+₹{pricingBreakdown.markup}</span></div>
                   <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex justify-between items-center"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Agent Discount (%)</label><span className="text-[10px] font-black text-sky-500 italic">{quote.discount}%</span></div>
                      <input type="range" min="0" max="15" step="1" value={quote.discount} onChange={e => setQuote({...quote, discount: parseInt(e.target.value)})} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                   </div>
                   <div className="p-5 bg-sky-600/10 rounded-3xl border border-sky-600/20 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase italic text-sky-200">Total Payable</span>
                      <span className="text-2xl font-black italic text-white">₹{pricingBreakdown.finalPayable}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div id="luxury-brochure-export" className="bg-white min-h-screen font-sans">
            <div className="max-w-[850px] mx-auto bg-white overflow-hidden shadow-2xl border border-slate-100">
              
              {/* PAGE 1: LUXURY COVER */}
              <div className="h-[1050px] relative flex flex-col justify-between p-20 bg-[#0F3C68] page-break">
                <div className="absolute inset-0 z-0">
                  <img src={SAMPLE_BANNER} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0F3C68]/20 via-transparent to-[#0F3C68]"></div>
                </div>
                <div className="relative z-10">
                  <div className="bg-white p-6 rounded-[32px] w-fit shadow-2xl mb-12"><img src={BRAND_LOGO_URL} className="h-10 w-auto object-contain" /></div>
                  <div className="space-y-4">
                    <h2 className="text-[14px] font-black text-sky-400 uppercase tracking-[0.6em] mb-4">Exclusively Curated For</h2>
                    <h1 className="text-7xl font-black italic uppercase leading-[0.9] tracking-tighter text-white drop-shadow-2xl">{selectedLead?.name || 'Valued Guest'}</h1>
                  </div>
                  <div className="w-24 h-1 bg-sky-400 rounded-full mt-10 shadow-lg"></div>
                  <div className="mt-8 space-y-1">
                     <h3 className="text-4xl font-black text-white uppercase italic tracking-widest opacity-95">{quote.title}</h3>
                     <p className="text-2xl font-bold text-sky-200 italic">{quote.duration}</p>
                  </div>
                </div>
                <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-10">
                   <div className="text-white space-y-4">
                      <div><p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Travel Date</p><p className="text-lg font-black uppercase italic tracking-tighter">{quote.travelDate}</p></div>
                      <div><p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Group Size</p><p className="text-lg font-black uppercase italic tracking-tighter">{quote.travelers}</p></div>
                   </div>
                   <div className="text-right text-white space-y-4">
                      <div><p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Ref ID</p><p className="text-sm font-black uppercase tracking-widest">{quote.id}</p></div>
                      <div><p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Quotation Date</p><p className="text-sm font-black uppercase tracking-widest">{quote.date}</p></div>
                   </div>
                </div>
              </div>

              {/* PAGE 2: OVERVIEW & NARRATIVE */}
              <div className="p-20 space-y-24 page-break">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <OverviewCard icon={<Calendar className="text-[#2E86C1]" />} label="Duration" value={quote.duration} />
                  <OverviewCard icon={<Users className="text-[#2E86C1]" />} label="Travelers" value={quote.travelers} />
                  <OverviewCard icon={<Hotel className="text-[#2E86C1]" />} label="Stay Tier" value="Luxury" />
                  <OverviewCard icon={<Car className="text-[#2E86C1]" />} label="Fleet" value="Dedicated SUV" />
                </div>

                <div className="space-y-16">
                  <div className="flex items-center gap-10"><h2 className="text-4xl font-black text-[#0F3C68] uppercase italic tracking-tighter whitespace-nowrap">Excursion Timeline</h2><div className="h-px w-full bg-[#EAF4FF]"></div></div>
                  <div className="relative space-y-12">
                     <div className="absolute left-[23px] top-6 bottom-6 w-px bg-[#EAF4FF]"></div>
                     {quote.itinerary.map((day, idx) => (
                        <div key={idx} className="flex gap-10 group relative">
                           <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#0F3C68] border-2 border-white flex items-center justify-center font-black italic shrink-0 z-10 shadow-sm">{day.day}</div>
                           <div className="flex-1 pb-10">
                              <h4 className="text-2xl font-black text-[#0F3C68] uppercase italic tracking-tighter mb-4">{day.title} Destination</h4>
                              <p className="text-base text-[#333333] font-medium leading-relaxed italic opacity-80">{day.description || 'Journey details being customized...'}</p>
                              <div className="flex flex-wrap gap-2 mt-6">
                                 {day.activities.map((act, ai) => (
                                    <span key={ai} className="px-3 py-1 bg-[#EAF4FF] text-[#0F3C68] text-[9px] font-black uppercase rounded-full border border-white"># {act}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
              </div>

              {/* PAGE 3: ASSETS & FINANCIALS */}
              <div className="p-20 space-y-24">
                <div className="space-y-12">
                   <div className="flex items-center gap-10"><h2 className="text-4xl font-black text-[#0F3C68] uppercase italic tracking-tighter whitespace-nowrap">Signature Stay</h2><div className="h-px w-full bg-[#EAF4FF]"></div></div>
                   <div className="bg-white border border-slate-100 rounded-[48px] overflow-hidden flex flex-col md:flex-row gap-8 p-4 shadow-sm">
                      <div className="w-full md:w-80 h-64 overflow-hidden rounded-[36px]"><img src={quote.hotels[0].image} className="w-full h-full object-cover" /></div>
                      <div className="flex-1 py-6 space-y-4">
                         <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" className="text-amber-500" />)}</div>
                         <h4 className="text-3xl font-black text-[#0F3C68] uppercase italic tracking-tighter">{quote.hotels[0].name}</h4>
                         <p className="text-[11px] font-black text-[#2E86C1] uppercase tracking-[0.2em]">{quote.hotels[0].category} • Breakfast & Dinner Included</p>
                         <p className="text-sm text-slate-500 font-medium italic">Premium heritage property offering panoramic Himalayan views and unmatched hospitality.</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10">
                  <div className="space-y-8 p-10 bg-[#EAF4FF]/40 rounded-[56px] border border-[#EAF4FF]">
                     <h5 className="text-[11px] font-black text-[#2E86C1] uppercase tracking-[0.4em] flex items-center gap-3"><CheckCircle size={18} /> Inclusions</h5>
                     <ul className="space-y-4">
                        {quote.inclusions.map((inc, i) => (<li key={i} className="text-xs text-slate-600 font-bold flex items-start gap-4 italic border-b border-slate-100 pb-3 last:border-0">• {inc}</li>))}
                     </ul>
                  </div>
                  <div className="space-y-8 p-10 bg-rose-50/30 rounded-[56px] border border-rose-100/50">
                     <h5 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.4em] flex items-center gap-3"><XCircle size={18} /> Exclusions</h5>
                     <ul className="space-y-4">
                        {quote.exclusions.map((exc, i) => (<li key={i} className="text-xs text-slate-400 font-bold flex items-start gap-4 italic border-b border-white pb-3 last:border-0">• {exc}</li>))}
                     </ul>
                  </div>
                </div>

                <div className="bg-[#0F3C68] p-16 rounded-[64px] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5"><Mountain size={200} /></div>
                  <div className="relative z-10 space-y-3 mb-8 md:mb-0">
                     <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-sky-400">Financial Ledger</h3>
                     <p className="text-sm font-bold opacity-60 italic max-w-xs">Comprehensive worth for all specified luxury services.</p>
                  </div>
                  <div className="relative z-10 text-center md:text-right">
                     <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1 italic">Net Payable Worth</p>
                     <p className="text-7xl font-black italic tracking-tighter">₹{pricingBreakdown.finalPayable.toLocaleString()}</p>
                     <p className="text-[11px] font-bold text-sky-200 mt-5 uppercase tracking-[0.2em] italic">Exclusive of GST • Voucher Issued Per Group</p>
                  </div>
                </div>

                <footer className="pt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10 opacity-60">
                  <div className="flex items-center gap-6">
                     <img src={BRAND_LOGO_URL} className="h-8 w-auto grayscale contrast-125" />
                     <div className="h-8 w-px bg-slate-200"></div>
                     <div className="text-[10px] font-black text-[#0F3C68] uppercase tracking-widest italic">Let Me Travel <br/> Signature Collection</div>
                  </div>
                  <div className="flex gap-8 text-[10px] font-bold">
                     <div className="flex items-center gap-2"><Globe size={14} className="text-sky-600" /> letmetravel.in</div>
                     <div className="flex items-center gap-2"><Phone size={14} className="text-sky-600" /> +91 98765 43210</div>
                  </div>
               </footer>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

const OverviewCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-[#EAF4FF] p-8 rounded-[40px] flex flex-col items-center text-center gap-3 shadow-sm border border-white">
     <div className="p-3 bg-white rounded-2xl shadow-sm text-[#2E86C1]">{icon}</div>
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
     <p className="text-xs font-black text-[#0F3C68] uppercase italic leading-tight">{value}</p>
  </div>
);

const InputGroup: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string }> = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-2 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">{label}</label>
    <input 
      type={type} value={value} onChange={e => onChange(e.target.value)} 
      className="w-full bg-slate-50 border border-slate-200 rounded-[32px] p-5 text-[11px] font-black uppercase outline-none focus:border-[#0F3C68] transition-all shadow-inner" 
    />
  </div>
);

export default ManualItinerary;
