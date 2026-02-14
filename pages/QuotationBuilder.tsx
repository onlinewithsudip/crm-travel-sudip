
import React, { useState, useMemo, useRef } from 'react';
import { Lead, User, UserRole, Quotation, ItineraryDay, HotelOption } from '../types';
import { EditableText, EditableImage, BRAND_LOGO_URL } from '../App';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Users, 
  Car, 
  Hotel, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Save, 
  ChevronRight,
  MapPin,
  Mountain,
  Zap,
  Loader2,
  Phone,
  Mail,
  Globe,
  Star
} from 'lucide-react';

interface QuotationBuilderProps {
  leads: Lead[];
  currentUser: User;
}

const SAMPLE_BANNER = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop";

const QuotationBuilder: React.FC<QuotationBuilderProps> = ({ leads, currentUser }) => {
  const [view, setView] = useState<'editor' | 'preview'>('editor');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  
  const [quote, setQuote] = useState<Quotation>({
    id: `LMT-QTN-${Date.now().toString().slice(-4)}`,
    leadId: '',
    packageCode: 'DAR/SIG/2025',
    date: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
    title: 'Signature Himalayan Escape',
    duration: '4 Nights / 5 Days',
    adults: 2,
    kids: 0,
    travelDate: 'Flexible 2025',
    travelers: '02 Adults',
    totalCost: 52000,
    taxAmount: 2600,
    discount: 0,
    itinerary: [
      { day: 1, title: 'Gateway to the Hills', description: 'Upon arrival at NJP/Bagdogra, our representative will greet you. Enjoy a scenic private transfer to Darjeeling, winding through lush tea estates and mist-covered peaks. Check-in to your luxury stay and spend the evening exploring the colonial charm of Mall Road.', activities: ['Meet & Greet', 'Private Transfer'], meals: ['Dinner'], accommodation: 'Premium Hill Resort' },
      { day: 2, title: 'The Golden Sunrise', description: 'Early morning drive to Tiger Hill to witness the sun rise over the Kanchenjunga range. Visit Ghoom Monastery and Batasia Loop. After a royal breakfast, visit the Himalayan Mountaineering Institute, Zoo, and Tibetan Refugee Center.', activities: ['Tiger Hill Sunrise', 'Batasia Loop', 'Tea Garden Visit'], meals: ['Breakfast', 'Dinner'], accommodation: 'Premium Hill Resort' }
    ],
    hotels: [
      { id: 'h1', name: 'The Elgin, Darjeeling', location: 'Darjeeling', category: 'Luxury Suite', starRating: 5, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800', pricePerNight: 8500 }
    ],
    vehicle: { id: 'v1', type: '4 Seater', rate: 3500 },
    vehicleInfo: 'Private Dedicated AC Innova Crysta',
    inclusions: ['Luxury Accommodation with Breakfast & Dinner', 'Private Dedicated Luxury SUV', 'All Inner-line Permits & Border Taxes', '24/7 Concierge Support during travel'],
    exclusions: ['Airfare or Train tickets to reach Bagdogra/NJP', 'Personal Laundry & Room Service', 'Monuments & Entry Fees', 'Traditional Tipping & Personal Gratuities'],
    bookingPolicy: '30% advance for immediate confirmation. Balance payment 15 days prior to arrival.',
    cancellationPolicy: 'Non-refundable if cancelled within 7 days of arrival. 50% refund before 15 days.',
    terms: 'Offer valid for 48 hours. Hotel rooms are subject to real-time availability.'
  });

  const selectedLead = useMemo(() => leads.find(l => l.id === selectedLeadId), [leads, selectedLeadId]);

  const handlePrint = () => {
    const element = document.getElementById('quotation-luxury-document');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `LetMeTravel_Quote_${selectedLead?.name || 'Guest'}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    setIsProcessing(true);
    const h2p = (window as any).html2pdf;
    if (h2p) {
      h2p().set(opt).from(element).save().then(() => setIsProcessing(false));
    } else {
      window.print();
      setIsProcessing(false);
    }
  };

  const addDay = () => {
    const newDay: ItineraryDay = {
      day: quote.itinerary.length + 1,
      title: 'Himalayan Exploration',
      description: 'Add detailed day activities here...',
      activities: [],
      meals: [],
      accommodation: ''
    };
    setQuote({ ...quote, itinerary: [...quote.itinerary, newDay] });
  };

  const removeDay = (idx: number) => {
    const updated = quote.itinerary.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }));
    setQuote({ ...quote, itinerary: updated });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* ERP Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-3xl font-black text-[#001e42] uppercase italic">Brochure Factory</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Signature Design Suite</p>
        </div>
        <div className="flex gap-3">
          {view === 'editor' ? (
            <button onClick={() => setView('preview')} className="bg-[#0F3C68] text-white font-black px-8 py-3 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl">
              <Sparkles size={18} className="text-amber-400" /> Generate Luxury Brochure
            </button>
          ) : (
            <>
              <button onClick={handlePrint} className="bg-[#001e42] text-white font-black px-8 py-3 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl">
                <Printer size={18} /> {isProcessing ? 'Compiling PDF...' : 'Download / Print'}
              </button>
              <button onClick={() => setView('editor')} className="bg-white border border-slate-200 text-slate-500 font-black px-8 py-3 rounded-2xl hover:border-orange-500 transition-all uppercase tracking-widest text-[10px]">
                Return to Editor
              </button>
            </>
          )}
        </div>
      </div>

      {view === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Editor Workspace */}
          <div className="lg:col-span-3 space-y-8">
            <section className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-10">
              <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                <h3 className="text-xl font-black text-[#0F3C68] uppercase italic flex items-center gap-4">
                  <FileText className="text-[#2E86C1]" /> Project Metadata
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Excursion Title" value={quote.title} onChange={v => setQuote({...quote, title: v})} />
                <InputGroup label="Duration String" value={quote.duration} onChange={v => setQuote({...quote, duration: v})} />
                <InputGroup label="Ref Code" value={quote.packageCode} onChange={v => setQuote({...quote, packageCode: v})} />
                <InputGroup label="Preferred Travel Window" value={quote.travelDate} onChange={v => setQuote({...quote, travelDate: v})} />
                <InputGroup label="Base Cost (₹)" type="number" value={quote.totalCost.toString()} onChange={v => setQuote({...quote, totalCost: parseInt(v) || 0})} />
                <InputGroup label="PAX Details" value={quote.travelers} onChange={v => setQuote({...quote, travelers: v})} />
              </div>
            </section>

            <section className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm space-y-10">
              <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                <h3 className="text-xl font-black text-[#0F3C68] uppercase italic flex items-center gap-4">
                  <Mountain className="text-[#2E86C1]" /> Itinerary Architecture
                </h3>
                <button onClick={addDay} className="p-3 bg-[#0F3C68] text-white rounded-2xl hover:bg-black transition-all shadow-lg"><Plus size={18}/></button>
              </div>
              <div className="space-y-6">
                {quote.itinerary.map((day, idx) => (
                  <div key={idx} className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-6 group relative">
                    <button onClick={() => removeDay(idx)} className="absolute top-6 right-6 text-slate-300 hover:text-rose-600 transition-all"><Trash2 size={20}/></button>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#0F3C68] text-white flex items-center justify-center text-xl font-black italic shadow-lg">D{day.day}</div>
                      <input className="bg-transparent text-xl font-black uppercase italic text-[#0F3C68] outline-none border-b-2 border-transparent focus:border-[#2E86C1] flex-1" value={day.title} onChange={e => {
                        const it = [...quote.itinerary];
                        it[idx].title = e.target.value;
                        setQuote({...quote, itinerary: it});
                      }} />
                    </div>
                    <textarea className="w-full bg-white border border-slate-200 rounded-[32px] p-6 text-xs font-bold leading-relaxed outline-none focus:border-[#2E86C1] h-32 resize-none shadow-inner" value={day.description} onChange={e => {
                        const it = [...quote.itinerary];
                        it[idx].description = e.target.value;
                        setQuote({...quote, itinerary: it});
                    }} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Asset Sidebar */}
          <div className="lg:col-span-1 space-y-6 sticky top-6 h-fit">
            <div className="bg-[#0F3C68] p-8 rounded-[48px] shadow-2xl space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-2 italic">Prospect Alignment</label>
                <select 
                  value={selectedLeadId}
                  onChange={e => setSelectedLeadId(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-3xl p-5 text-white text-[10px] font-black uppercase outline-none focus:border-white transition-all appearance-none"
                >
                  <option value="" className="text-slate-900">Select Prospect...</option>
                  {leads.map(l => <option key={l.id} value={l.id} className="text-slate-900">{l.name} - {l.destination}</option>)}
                </select>
              </div>
              <div className="pt-8 border-t border-white/10 space-y-6">
                <div className="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                  <span>Gross Valuation</span>
                  <span>₹{quote.totalCost}</span>
                </div>
                <div className="flex justify-between items-end text-amber-500">
                  <span className="text-[10px] font-black uppercase tracking-widest mb-1">Final Premium</span>
                  <span className="text-3xl font-black italic">₹{quote.totalCost + quote.taxAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PREMIUM LUXURY BROCHURE PREVIEW */
        <div id="quotation-luxury-document" className="bg-white min-h-screen font-sans selection:bg-[#2E86C1] selection:text-white">
          <div className="max-w-[850px] mx-auto bg-white overflow-hidden shadow-2xl border border-slate-100">
            
            {/* COVER PAGE (PAGE 1) */}
            <div className="h-[1050px] relative flex flex-col justify-between p-16 page-break bg-[#0F3C68]">
               {/* Cover Image Background */}
               <div className="absolute inset-0 z-0">
                  <img src={SAMPLE_BANNER} className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0F3C68]/40 via-transparent to-[#0F3C68]"></div>
               </div>

               {/* Cover Top Branding */}
               <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-white p-6 rounded-[32px] shadow-2xl">
                     <img src={BRAND_LOGO_URL} className="h-10 w-auto object-contain" />
                  </div>
                  <div className="text-right text-white">
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-1">Signature Collection</p>
                     <p className="text-[11px] font-bold opacity-60 uppercase tracking-widest">Est. Excellence</p>
                  </div>
               </div>

               {/* Cover Title Center */}
               <div className="relative z-10 text-white space-y-6">
                  <div className="space-y-2">
                     <h2 className="text-[12px] font-black uppercase tracking-[0.6em] text-amber-500">Exclusively Prepared For</h2>
                     <h1 className="text-7xl font-black italic uppercase leading-none tracking-tighter drop-shadow-2xl">
                        {selectedLead?.name || 'Valued Guest'}
                     </h1>
                  </div>
                  <div className="w-24 h-1 bg-amber-500 rounded-full shadow-lg"></div>
                  <h3 className="text-3xl font-black uppercase tracking-widest opacity-90">{quote.title}</h3>
                  <p className="text-xl font-bold italic text-amber-200">{quote.duration}</p>
               </div>

               {/* Cover Bottom Details */}
               <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-10">
                  <div className="text-white space-y-4">
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Planned Destination</p>
                        <p className="text-lg font-black uppercase italic tracking-tighter">{selectedLead?.destination || 'Darjeeling'}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Preferred Window</p>
                        <p className="text-lg font-black uppercase italic tracking-tighter">{quote.travelDate}</p>
                     </div>
                  </div>
                  <div className="text-right text-white space-y-4">
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Ref ID</p>
                        <p className="text-sm font-black uppercase tracking-widest">{quote.packageCode}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Issued On</p>
                        <p className="text-sm font-black uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric'})}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* PAGE 2 – OVERVIEW & FINANCIALS */}
            <div className="p-20 space-y-24 page-break">
               
               {/* Section: Welcome */}
               <div className="space-y-6 max-w-2xl">
                  <h2 className="text-[10px] font-black text-[#2E86C1] uppercase tracking-[0.5em] mb-4">A Note From Our Desk</h2>
                  <p className="text-2xl font-black text-[#0F3C68] uppercase italic leading-tight tracking-tighter">
                     "Your journey is not just a destination, but a collection of curated moments."
                  </p>
                  <p className="text-base text-slate-500 font-medium leading-relaxed italic border-l-4 border-amber-500 pl-6 py-2">
                     At Let Me Travel, we turn excursions into life-long signatures. This blueprint has been drafted specifically to align with your taste for quality and comfort.
                  </p>
               </div>

               {/* Section: Overview Cards */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <OverviewCard icon={<Calendar className="text-[#2E86C1]" />} label="Duration" value={quote.duration} />
                  <OverviewCard icon={<Users className="text-[#2E86C1]" />} label="Travelers" value={quote.travelers} />
                  <OverviewCard icon={<Hotel className="text-[#2E86C1]" />} label="Stay Tier" value="Luxury" />
                  <OverviewCard icon={<Car className="text-[#2E86C1]" />} label="Fleet" value="Dedicated SUV" />
               </div>

               {/* Section: Premium Itinerary Timeline */}
               <div className="space-y-16">
                  <SectionTitle title="The Excursion Sequence" />
                  <div className="relative space-y-12">
                     <div className="absolute left-[23px] top-6 bottom-6 w-px bg-slate-100"></div>
                     {quote.itinerary.map((day, idx) => (
                        <div key={idx} className="flex gap-10 group relative animate-in fade-in duration-700">
                           <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#0F3C68] border-2 border-white ring-4 ring-slate-50 flex items-center justify-center font-black italic shrink-0 z-10 shadow-sm transition-transform group-hover:scale-110">
                              {day.day}
                           </div>
                           <div className="flex-1 pb-10">
                              <h4 className="text-2xl font-black text-[#0F3C68] uppercase italic tracking-tighter mb-4">{day.title}</h4>
                              <p className="text-base text-slate-600 font-medium leading-relaxed italic opacity-80">{day.description}</p>
                              <div className="flex flex-wrap gap-2 mt-6">
                                 {day.activities.map((act, ai) => (
                                    <span key={ai} className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-full border border-slate-100"># {act}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* PAGE 3 – ASSETS & POLICIES */}
            <div className="p-20 space-y-24">
               
               {/* Section: Accommodation Asset */}
               <div className="space-y-12">
                  <SectionTitle title="Exclusive Stays" />
                  <div className="grid grid-cols-1 gap-10">
                     {quote.hotels.map(h => (
                        <div key={h.id} className="group relative bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-sm flex flex-col md:flex-row gap-8 hover:shadow-2xl transition-all p-4">
                           <div className="w-full md:w-80 h-64 overflow-hidden rounded-[36px]">
                              <img src={h.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           </div>
                           <div className="flex-1 py-4 pr-8 space-y-4">
                              <div className="flex items-center gap-2">
                                 {[...Array(h.starRating)].map((_, i) => <Star key={i} size={12} fill="#F59E0B" className="text-amber-500" />)}
                              </div>
                              <h4 className="text-3xl font-black text-[#0F3C68] uppercase italic tracking-tighter leading-none">{h.name}</h4>
                              <p className="text-[11px] font-black text-[#2E86C1] uppercase tracking-[0.2em]">{h.location} • {h.category}</p>
                              <div className="w-12 h-0.5 bg-amber-500"></div>
                              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                                 A curated selection known for its premium service, aesthetic architecture, and high hospitality standards.
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Section: What's Covered */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10">
                  <div className="space-y-8 p-10 bg-[#EAF4FF]/40 rounded-[56px] border border-[#EAF4FF]">
                     <h5 className="text-[11px] font-black text-[#2E86C1] uppercase tracking-[0.4em] flex items-center gap-3">
                        <CheckCircle size={18} /> Inclusive Features
                     </h5>
                     <ul className="space-y-4">
                        {quote.inclusions.map((inc, i) => (
                           <li key={i} className="text-xs text-slate-600 font-bold flex items-start gap-4 italic border-b border-slate-100 pb-3 last:border-0">
                              <span className="text-[#2E86C1]">•</span> {inc}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-8 p-10 bg-slate-50 rounded-[56px] border border-slate-100">
                     <h5 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.4em] flex items-center gap-3">
                        <XCircle size={18} /> Not Included
                     </h5>
                     <ul className="space-y-4">
                        {quote.exclusions.map((exc, i) => (
                           <li key={i} className="text-xs text-slate-400 font-bold flex items-start gap-4 italic border-b border-white pb-3 last:border-0">
                              <span className="text-rose-300">•</span> {exc}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>

               {/* Section: Premium Summary Box */}
               <div className="bg-[#0F3C68] p-16 rounded-[64px] text-white flex flex-col md:flex-row justify-between items-center shadow-[0_40px_80px_-20px_rgba(15,60,104,0.4)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                     <Mountain size={200} />
                  </div>
                  <div className="relative z-10 space-y-3 mb-8 md:mb-0 text-center md:text-left">
                     <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#2E86C1]">The Financial Signature</h3>
                     <p className="text-sm font-bold opacity-60 italic max-w-xs">All inclusive of taxes and specified services for the entire group.</p>
                  </div>
                  <div className="relative z-10 text-center md:text-right">
                     <div className="flex flex-col items-center md:items-end">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 italic">Net Payable Worth</p>
                        <p className="text-7xl font-black italic leading-none tracking-tighter shadow-orange-900">
                           ₹{quote.totalCost + quote.taxAmount}
                        </p>
                        <p className="text-[11px] font-bold text-[#2E86C1] mt-5 uppercase tracking-[0.2em] italic">
                           Secure with 30% Token Advance
                        </p>
                     </div>
                  </div>
               </div>

               {/* Footer: Professional Close */}
               <footer className="pt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10 opacity-60">
                  <div className="flex items-center gap-6">
                     <img src={BRAND_LOGO_URL} className="h-8 w-auto grayscale contrast-125" />
                     <div className="h-8 w-px bg-slate-200"></div>
                     <div className="text-[10px] font-black text-[#0F3C68] uppercase tracking-widest italic leading-tight">
                        Signature Collection <br/> Let Me Travel
                     </div>
                  </div>
                  <div className="flex gap-8">
                     <div className="flex items-center gap-2">
                        <Globe size={14} className="text-[#2E86C1]" />
                        <span className="text-[10px] font-bold">letmetravel.in</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Mail size={14} className="text-[#2E86C1]" />
                        <span className="text-[10px] font-bold">info@letmetravel.in</span>
                     </div>
                  </div>
               </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-10 mb-12">
     <h2 className="text-4xl font-black text-[#0F3C68] uppercase italic tracking-tighter whitespace-nowrap">{title}</h2>
     <div className="h-px w-full bg-[#EAF4FF]"></div>
  </div>
);

const OverviewCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-[#EAF4FF] p-8 rounded-[40px] flex flex-col items-center text-center gap-3 transition-all hover:scale-105 hover:shadow-xl shadow-sm border border-white">
     <div className="p-3 bg-white rounded-2xl shadow-sm text-[#2E86C1]">{icon}</div>
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
     <p className="text-xs font-black text-[#0F3C68] uppercase italic leading-tight tracking-widest">{value}</p>
  </div>
);

const InputGroup: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string }> = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-slate-50 border border-slate-200 rounded-[32px] p-5 text-xs font-black uppercase outline-none focus:border-[#2E86C1] transition-all shadow-inner" 
    />
  </div>
);

export default QuotationBuilder;
