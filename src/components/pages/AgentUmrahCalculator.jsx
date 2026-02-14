import React, { useState } from 'react';
import {
    Package, Ticket, Hotel, MapPin,
    CheckCircle2, Minus, Plus, Plane,
    Utensils, Landmark, ChevronLeft, ChevronRight,
    Printer, Save, Send, Clock
} from 'lucide-react';

const AgentUmrahCalculator = () => {
    const [currentStep, setCurrentStep] = useState(1);

    // State Management
    // selectedOptions is an array of IDs: e.g. ['visa_transport_hotel', 'tickets']
    const [selectedOptions, setSelectedOptions] = useState(['visa_transport_ticket_hotel']);
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [includeFood, setIncludeFood] = useState(false);
    const [includeZiarat, setIncludeZiarat] = useState(false);

    const bookingOptions = [
        { id: 'visa_transport_ticket_hotel', label: 'Visa + Transport + Tickets + Hotel', icon: Landmark, type: 'package', contains: ['visa', 'transport', 'tickets', 'hotels'] },
        { id: 'visa_transport_hotel', label: 'Visa + Transport + Hotel', icon: Landmark, type: 'package', contains: ['visa', 'transport', 'hotels'] },
        { id: 'visa_transport', label: 'Visa + Transport', icon: Landmark, type: 'package', contains: ['visa', 'transport'] },
        { id: 'hotels', label: 'Hotels', icon: Hotel, type: 'component', contains: ['hotels'] },
        { id: 'transport', label: 'Transport', icon: MapPin, type: 'component', contains: ['transport'] },
        { id: 'tickets', label: 'Tickets', icon: Plane, type: 'component', contains: ['tickets'] },
        { id: 'only_visa', label: 'Only Visa', icon: Ticket, type: 'visa', contains: ['visa'] },
        { id: 'long_term_visa', label: 'Long term visa', icon: Clock, type: 'visa', contains: ['visa'] },
    ];

    // --- LOGIC HELPERS ---

    // Check if a service (visa, hotels, etc.) is covered by ANY selected option
    const hasService = (service) => {
        return selectedOptions.some(optId => {
            const opt = bookingOptions.find(o => o.id === optId);
            return opt?.contains.includes(service);
        });
    };

    // Check if an option is visually selected
    const isSelected = (id) => selectedOptions.includes(id);

    // Check if an option should be disabled
    const isDisabled = (option) => {
        // 1. If a Full Package (VTTH) is selected, everything else is disabled
        if (selectedOptions.includes('visa_transport_ticket_hotel') && option.id !== 'visa_transport_ticket_hotel') return true;

        // 2. If a user tries to select a "component" (e.g. Hotels) but it's already included in a selected package (e.g. VTH), disable it
        //    (Because VTH already has hotels, you don't select 'hotels' separately)
        if (option.type === 'component') {
            // Find any selected package
            const selectedPackageId = selectedOptions.find(id => {
                const opt = bookingOptions.find(o => o.id === id);
                return opt?.type === 'package';
            });
            if (selectedPackageId) {
                const selectedPackage = bookingOptions.find(o => o.id === selectedPackageId);
                // If the package already contains this component, disable the component button
                if (selectedPackage.contains.some(c => option.contains.includes(c))) return true;
            }
        }

        // 3. Mutual Exclusivity for Packages and Visas (Group A vs Group B vs Each Other)
        if (option.type === 'package' || option.type === 'visa') {
            // If ANY other package or visa is selected, disable this one (unless it's the one currently selected)
            const hasOtherBaseSelected = selectedOptions.some(id => {
                const opt = bookingOptions.find(o => o.id === id);
                return (opt?.type === 'package' || opt?.type === 'visa') && id !== option.id;
            });
            if (hasOtherBaseSelected && !isSelected(option.id)) return true;
        }

        return false;
    };

    const toggleSelection = (optionId) => {
        const option = bookingOptions.find(o => o.id === optionId);
        if (!option) return;

        // If clicking the currently selected Base (Package/Visa), do usually nothing? OR allow unselect?
        // User implied "at least one option must be selected", so maybe don't allow unselecting the last base?
        // For now, standard toggle.
        if (isSelected(optionId)) {
            // Allow unselecting? Let's say yes for flexibility, unless it leaves empty?
            // But if I unselect VTTH, I should probably just clear it.
            setSelectedOptions(prev => prev.filter(id => id !== optionId));
            return;
        }

        // If Selecting a Base (Package or Visa):
        if (option.type === 'package' || option.type === 'visa') {
            // Clear any EXISTING Base (Package/Visa)
            // Also, logic: "Select VTTH -> Disable Everything". 
            // So if picking VTTH, clear EVERYTHING.
            if (optionId === 'visa_transport_ticket_hotel') {
                setSelectedOptions(['visa_transport_ticket_hotel']);
                return;
            }

            // If picking VTH, VT, OnlyVisa, LongTerm: 
            // 1. Remove any other Base.
            // 2. Remove any Components that are now included in the new Base?
            const newSelection = selectedOptions.filter(id => {
                const opt = bookingOptions.find(o => o.id === id);
                return opt.type === 'component'; // Keep components for now, filter conflicts next
            });

            // Filter out components that conflict/are redundant with new base
            const finalSelection = newSelection.filter(compId => {
                const comp = bookingOptions.find(o => o.id === compId);
                // If new base (option) contains the component's service, remove component
                return !option.contains.some(c => comp.contains.includes(c));
            });

            setSelectedOptions([...finalSelection, optionId]);
        }
        // If Selecting a Component (Hotels, Transport, Tickets)
        else {
            setSelectedOptions(prev => [...prev, optionId]);
        }
    };


    // Helper Components
    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-10">
            {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${currentStep === step ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' :
                            currentStep > step ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                            }`}>
                            {currentStep > step ? <CheckCircle2 size={20} /> : step}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest mt-2 ${currentStep === step ? 'text-blue-600' : 'text-slate-400'}`}>
                            {step === 1 ? 'Config' : step === 2 ? 'Builder' : 'Invoice'}
                        </span>
                    </div>
                    {step < 3 && <div className={`w-20 h-0.5 mx-4 mb-4 ${currentStep > step ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                </React.Fragment>
            ))}
        </div>
    );

    const Counter = ({ label, value, onInc, onDec }) => (
        <div className="flex-1 flex items-center justify-between p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm">
            <div className="flex flex-col">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={onDec} className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Minus size={18} /></button>
                <span className="text-lg font-black text-slate-900 w-6 text-center">{value}</span>
                <button onClick={onInc} className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><Plus size={18} /></button>
            </div>
        </div>
    );

    const FormField = ({ label, placeholder, type = "text", icon: Icon, options = null }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">{label}</label>
            <div className="relative">
                {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
                {options ? (
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none">
                        {options.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                ) : (
                    <input
                        type={type}
                        placeholder={placeholder}
                        className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 ${Icon ? 'pl-11' : 'px-4'} pr-4 text-sm font-bold text-slate-700 focus:border-blue-500 outline-none transition-all`}
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 pb-32">

            <StepIndicator />

            {/* STEP 1: CONFIGURATION */}
            {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center">
                        <h3 className="text-2xl font-black text-slate-900">Define Your Package</h3>
                        <p className="text-slate-400 text-sm mt-1">Select the services and group size to begin</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {bookingOptions.map((opt) => {
                            const active = isSelected(opt.id);
                            const disabled = isDisabled(opt);

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => !disabled && toggleSelection(opt.id)}
                                    disabled={disabled}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 relative h-32 group 
                                    ${active
                                            ? 'border-blue-600 bg-white shadow-lg shadow-blue-600/10 scale-105 ring-2 ring-blue-100 cursor-pointer'
                                            : disabled
                                                ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed grayscale'
                                                : 'border-slate-100 bg-white text-slate-400 hover:border-blue-200 hover:shadow-md cursor-pointer'
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-xl transition-colors 
                                    ${active
                                            ? 'bg-blue-600 text-white'
                                            : disabled
                                                ? 'bg-slate-100 text-slate-300'
                                                : 'bg-slate-50 text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50'
                                        }`}>
                                        <opt.icon size={24} />
                                    </div>
                                    <span className={`text-[10px] font-black text-center leading-tight uppercase tracking-wider px-2 transition-colors
                                     ${active
                                            ? 'text-black'
                                            : disabled
                                                ? 'text-slate-300'
                                                : 'text-black group-hover:text-blue-600'
                                        }`}>
                                        {opt.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <Counter label="Adults" value={passengers.adults} onInc={() => setPassengers({ ...passengers, adults: passengers.adults + 1 })} onDec={() => setPassengers({ ...passengers, adults: Math.max(1, passengers.adults - 1) })} />
                        <Counter label="Children" value={passengers.children} onInc={() => setPassengers({ ...passengers, children: passengers.children + 1 })} onDec={() => setPassengers({ ...passengers, children: Math.max(0, passengers.children - 1) })} />
                        <Counter label="Infants" value={passengers.infants} onInc={() => setPassengers({ ...passengers, infants: passengers.infants + 1 })} onDec={() => setPassengers({ ...passengers, infants: Math.max(0, passengers.infants - 1) })} />
                    </div>

                    <div className="flex justify-center pt-8">
                        {/* Only allow Next if at least one thing is selected? */}
                        <button
                            onClick={() => selectedOptions.length > 0 && setCurrentStep(2)}
                            disabled={selectedOptions.length === 0}
                            className={`px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-3
                                ${selectedOptions.length > 0
                                    ? 'bg-blue-600 text-white shadow-blue-600/30 hover:scale-105 cursor-pointer'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Next: Build Package <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: BUILDER (DYNAMIC) */}
            {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

                    {/* Flight Details: Show if 'visa' (implicit in packages) OR 'tickets' is selected/included */}
                    {/* Actually, user logic: VTH (Visa+Transport+Hotel) -> NO tickets. So 'visa' presence doesn't strictly mean tickets. */}
                    {/* Checking specifically for 'tickets' service presence */}
                    {hasService('tickets') && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Plane size={22} /></div>
                                <h4 className="text-lg font-black text-slate-900 tracking-tight">Flight Details</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <FormField label="Airline" options={['Saudia', 'PIA', 'Airblue']} />
                                <FormField label="PNR / Booking Ref" placeholder="A12BC3" />
                                <FormField label="Route" placeholder="KHI -> JED" />
                                <FormField label="Travel Date" type="date" />
                            </div>
                        </div>
                    )}

                    {/* Hotel Selection: Show if 'hotels' service present */}
                    {hasService('hotels') && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Hotel size={22} /></div>
                                    <h4 className="text-lg font-black text-slate-900 tracking-tight">Hotel Selection</h4>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <FormField label="Hotel Name" options={['Pullman Zamzam (Makkah)', 'Anjum Hotel', 'Hilton Suites']} />
                                <FormField label="Room Type" options={['Double', 'Triple', 'Quad', 'Sharing']} />
                                <FormField label="Total Nights" type="number" placeholder="0" />
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition-all">
                                <Plus size={16} /> Add Another Hotel (Madinah)
                            </button>
                        </div>
                    )}

                    {/* Transport Selection: Show if 'transport' service present */}
                    {hasService('transport') && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><MapPin size={22} /></div>
                                <h4 className="text-lg font-black text-slate-900 tracking-tight">Transport & Sectors</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FormField label="Main Sector" options={['JED-MAK-MED-JED', 'JED-MAK-JED']} />
                                <FormField label="Vehicle" options={['GMC (7-Seater)', 'Private Sedan', 'Bus']} />
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-amber-200 hover:text-amber-600 transition-all">
                                <Plus size={16} /> Add Another Sector
                            </button>
                        </div>
                    )}

                    {/* Optional Add-ons */}
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setIncludeFood(!includeFood)}
                            className={`flex-1 min-w-[200px] flex items-center justify-center gap-3 p-6 rounded-[2rem] border-2 transition-all ${includeFood ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                            <Utensils size={20} />
                            <span className="text-[11px] font-black uppercase tracking-widest">{includeFood ? 'Food Added' : 'Add Food Services'}</span>
                        </button>
                        <button
                            onClick={() => setIncludeZiarat(!includeZiarat)}
                            className={`flex-1 min-w-[200px] flex items-center justify-center gap-3 p-6 rounded-[2rem] border-2 transition-all ${includeZiarat ? 'bg-violet-50 border-violet-500 text-violet-700' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                            <Landmark size={20} />
                            <span className="text-[11px] font-black uppercase tracking-widest">{includeZiarat ? 'Ziarat Added' : 'Add Ziarat Tours'}</span>
                        </button>
                    </div>

                    <div className="flex justify-between pt-8 border-t border-slate-100">
                        <button onClick={() => setCurrentStep(1)} className="px-10 py-5 rounded-[2rem] text-slate-400 font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center gap-2">
                            <ChevronLeft size={20} /> Back
                        </button>
                        <button onClick={() => setCurrentStep(3)} className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                            Generate Invoice <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: INVOICE */}
            {currentStep === 3 && (
                <div className="animate-in fade-in zoom-in duration-500">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden mb-10">
                        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                            <div>
                                <h4 className="text-xl font-black uppercase tracking-tighter italic">Proforma Invoice</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ref: #INV-2025-001</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] font-black uppercase tracking-widest text-blue-400">Status</p>
                                <p className="text-lg font-black text-emerald-400">READY TO BOOK</p>
                            </div>
                        </div>

                        <div className="p-8">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Unit</th>
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold text-slate-700">
                                    <tr className="border-b border-slate-50">
                                        <td className="py-4">Visa Processing (Adults x{passengers.adults})</td>
                                        <td className="py-4 text-center">x1</td>
                                        <td className="py-4 text-right">Rs. 45,000</td>
                                    </tr>
                                    <tr className="border-b border-slate-50">
                                        <td className="py-4">Flight: Saudia (KHI-JED)</td>
                                        <td className="py-4 text-center">x1</td>
                                        <td className="py-4 text-right">Rs. 185,000</td>
                                    </tr>
                                    <tr className="border-b border-slate-50">
                                        <td className="py-4">Pullman Zamzam (5 Nights)</td>
                                        <td className="py-4 text-center">x1</td>
                                        <td className="py-4 text-right">Rs. 120,000</td>
                                    </tr>
                                    <tr className="border-b border-slate-50">
                                        <td className="py-4">Transport Sector: GMC 2025 Model</td>
                                        <td className="py-4 text-center">x1</td>
                                        <td className="py-4 text-right">Rs. 45,000</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-8 flex justify-end">
                                <div className="w-full md:w-80 space-y-4">
                                    <div className="flex justify-between text-slate-400 font-bold">
                                        <span>Subtotal</span>
                                        <span>Rs. 395,000</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-blue-600 font-black text-xs uppercase">Agent Margin</span>
                                        <input type="text" defaultValue="55,000" className="w-24 bg-blue-50 border border-blue-100 rounded-lg py-1 px-3 text-right text-sm font-black text-blue-600 focus:outline-none" />
                                    </div>
                                    <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-center">
                                        <span className="text-lg font-black uppercase tracking-tighter">Grand Total</span>
                                        <span className="text-2xl font-black text-blue-600 tracking-tighter">Rs. 450,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] border-2 border-slate-200 font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                            <Printer size={18} /> Print PDF
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] border-2 border-slate-200 font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                            <Save size={18} /> Save Draft
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-emerald-600 text-white font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/30 hover:scale-105 transition-all">
                            <Send size={18} /> Book Package
                        </button>
                    </div>

                    <button onClick={() => setCurrentStep(2)} className="mt-8 w-full text-center text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">
                        Edit Selection & Builder
                    </button>
                </div>
            )}

        </div>
    );
};

export default AgentUmrahCalculator;
