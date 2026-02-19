import React from 'react';
import {
    Printer, Download, ArrowLeft,
    Globe, Plane, Circle
} from 'lucide-react';

const SectionHeading = ({ title }) => (
    <h3 className="text-lg font-extrabold text-slate-800 mb-4">{title}</h3>
);

const PassengerCard = ({ number, name, pnr, fare }) => (
    <div className="border border-slate-200 rounded-2xl p-2 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="text-center min-w-[60px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pex NO</p>
                <p className="text-2xl font-black text-slate-800">{String(number).padStart(2, '0')}</p>
            </div>
            <div className="w-[1px] h-10 bg-slate-100"></div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Traveler Name</p>
                <p className="text-base font-bold text-slate-800 uppercase underline decoration-slate-300 underline-offset-4">{name}</p>
            </div>
        </div>
        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Agency PNR</p>
                <p className="text-sm font-bold text-slate-800 underline decoration-slate-300 underline-offset-4">{pnr}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fare</p>
                <p className="text-lg font-black text-slate-800">{fare}</p>
            </div>
        </div>
    </div>
);

export default function GroupTicketInvoice({ booking, onBack }) {
    const passengers = booking?.passengers || [
        { name: 'BILAL AHMAD MUHAMMAD NASIR', pnr: '95LAHD', fare: 'Rs 120,000/' },
        { name: 'ARSLAN BILAL BILAL AHMAD', pnr: '95LAHD', fare: 'Rs 120,000/' },
        { name: 'BEENISH BILAL', pnr: 'RNIO85', fare: 'Rs 120,000/' },
    ];

    return (
        <div className="p-8 max-w-[1600px] mx-auto print:p-0">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Title */}
                <h2 className="text-2xl font-black text-slate-800 tracking-tight print:hidden">
                    Booking/Invoice
                </h2>

                {/* Main Card */}
                <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">

                    {/* Card Header */}
                    <div className="p-8 pb-4">
                        {/* Back + Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <button
                                onClick={onBack}
                                className="text-slate-400 hover:text-slate-600 transition-colors print:hidden"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div className="flex gap-3 ml-auto print:hidden">
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                                >
                                    <Printer size={16} /> Print
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:border-blue-200 hover:text-blue-600 transition-all">
                                    <Download size={16} /> Download
                                </button>
                            </div>
                        </div>

                        {/* Agency Info */}
                        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm text-emerald-600">
                                    <Globe size={32} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">TRAVEL PAKISTAN</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">PVT LTD</span>
                                </div>
                            </div>

                            {/* Agent Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-sm">
                                <div>
                                    <p className="text-slate-400 font-bold text-xs uppercase mb-1">Name:</p>
                                    <p className="font-bold text-slate-800">{booking?.agencyName || '92 World travel'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold text-xs uppercase mb-1">Agent Name:</p>
                                    <p className="font-bold text-slate-800">{booking?.agentName || 'Rehan Rafique'}</p>
                                    <p className="text-xs text-slate-500 font-medium">{booking?.agentPhone || '+923631569535'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold text-xs uppercase mb-1">Address:</p>
                                    <p className="font-bold text-slate-800 leading-tight">{booking?.address || 'Hilltop town, Street 78, Gujranwala'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold text-xs uppercase mb-1">Code:</p>
                                    <p className="font-bold text-slate-800">{booking?.code || '9236 626262'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-8 pt-0 space-y-8">

                        {/* Tickets Detail — Flight Card */}
                        <section>
                            <SectionHeading title="Tickets Detail" />
                            <div className="bg-[#EBF5FF] rounded-3xl overflow-hidden border border-blue-100 flex flex-col md:flex-row">

                                {/* Flight Info (Left) */}
                                <div className="flex-1 p-8 flex justify-between items-center">
                                    {/* Depart */}
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-400 mb-1">Depart</p>
                                        <h3 className="text-3xl font-black text-slate-800 mb-1">20:15</h3>
                                        <p className="text-sm font-semibold text-slate-500 mb-1">October 4, 2025</p>
                                        <p className="text-lg font-bold text-slate-800">Sialkot (SKT)</p>
                                    </div>

                                    {/* Connector */}
                                    <div className="flex flex-col items-center justify-center w-full px-6">
                                        <div className="flex items-center w-full gap-2">
                                            <Circle size={8} className="text-slate-300 fill-slate-300" />
                                            <div className="h-[2px] flex-1 relative border-t-2 border-dashed border-slate-300">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#EBF5FF] px-2">
                                                    <Plane className="text-blue-600 rotate-90" size={20} />
                                                </div>
                                            </div>
                                            <Circle size={8} className="text-slate-300 fill-slate-300" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wide">1st Stop at Dubai</p>
                                        <p className="text-[10px] font-bold text-slate-400">4h 10m</p>
                                    </div>

                                    {/* Arrival */}
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-400 mb-1">Arrival</p>
                                        <h3 className="text-3xl font-black text-slate-800 mb-1">2:15</h3>
                                        <p className="text-sm font-semibold text-slate-500 mb-1">October 5, 2025</p>
                                        <p className="text-lg font-bold text-slate-800">Muscat (MCT)</p>
                                    </div>
                                </div>

                                {/* Dashed Divider */}
                                <div className="w-full h-[1px] md:w-[1px] md:h-auto border-t md:border-t-0 md:border-l border-dashed border-blue-300 relative">
                                    <div className="absolute top-[-6px] left-0 md:left-[-6px] md:top-0 w-3 h-3 bg-white rounded-full"></div>
                                    <div className="absolute bottom-[-6px] right-0 md:right-[-6px] md:bottom-0 w-3 h-3 bg-white rounded-full"></div>
                                </div>

                                {/* Flight Meta (Right) */}
                                <div className="w-full md:w-64 p-8 bg-blue-50/50 flex flex-col justify-center space-y-4">
                                    {[
                                        { label: 'Status', value: 'Confirm' },
                                        { label: 'Class', value: 'Economy (o)' },
                                        { label: 'PNR', value: '95LAHD' },
                                        { label: 'Baggage', value: '30.0 KG' },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
                                            <span className="text-xs font-bold text-slate-800">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Passenger Details */}
                        <section>
                            <SectionHeading title="Passenger Details" />
                            <div className="space-y-4">
                                {passengers.map((p, i) => (
                                    <PassengerCard
                                        key={i}
                                        number={i + 1}
                                        name={p.name}
                                        pnr={p.pnr}
                                        fare={p.fare}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Total Balance */}
                        <section className="bg-[#EBF5FF] rounded-2xl p-8 flex flex-col items-end">
                            <div className="w-full md:w-1/2 lg:w-1/3 space-y-4">
                                <div className="flex justify-between items-center border-b border-blue-200 pb-4">
                                    <span className="text-sm font-bold text-slate-700">Sub Total</span>
                                    <span className="text-lg font-bold text-slate-800 underline decoration-slate-400 underline-offset-4">Rs 360,000/</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-blue-200 pb-4">
                                    <span className="text-sm font-bold text-slate-700">Paid</span>
                                    <span className="text-lg font-bold text-blue-600 underline decoration-blue-300 underline-offset-4">Rs 360,000/</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-base font-black text-slate-800">Pending</span>
                                    <span className="text-xl font-black text-slate-800 underline decoration-slate-400 underline-offset-4">Rs 0/</span>
                                </div>
                            </div>
                        </section>

                        {/* Booking Date Footer */}
                        <div className="text-right pt-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Booking Date: <span className="text-slate-800">{booking?.bookingDate || '18/01/25'}</span>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
