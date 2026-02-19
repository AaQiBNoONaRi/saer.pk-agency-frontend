import React from 'react';
import {
    Printer, Download, ArrowLeft,
    QrCode, Plane, Globe
} from 'lucide-react';

// --- Voucher Sub-components ---
const SectionTitle = ({ title }) => (
    <h3 className="text-lg font-extrabold text-slate-800 mb-4 border-l-4 border-blue-600 pl-3 uppercase tracking-tight">
        {title}
    </h3>
);

export default function BookingVoucher({ booking, onBack }) {
    const orderId = booking?.id || 'ORD-9912';

    return (
        <div className="p-8 max-w-[1600px] mx-auto print:p-0">

            {/* Action Toolbar */}
            <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors"
                >
                    <ArrowLeft size={18} /> Back to List
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-600 transition-all"
                    >
                        <Printer size={16} /> Print
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white border border-transparent rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                        <Download size={16} /> Download
                    </button>
                </div>
            </div>

            {/* VOUCHER CARD */}
            <div className="max-w-5xl mx-auto bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">

                {/* 1. Header Section */}
                <div className="bg-[#EEEEEE] p-8 relative">
                    {/* Center Block */}
                    <div className="flex flex-col items-center justify-center mb-10">
                        <div className="bg-white px-8 py-3 rounded-xl shadow-sm mb-3">
                            <h1 className="text-3xl font-black text-blue-600 tracking-tight">Saer<span className="text-slate-400">.pk</span></h1>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">POWERED BY</p>
                            <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wide leading-tight">
                                SAER KARO TRAVEL AND TOURS <span className="text-xs text-slate-500 block sm:inline">(SMC PVT LTD)</span>
                            </h2>
                        </div>
                    </div>

                    {/* Info Columns */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
                        {/* Left: Agency Info */}
                        <div className="flex items-start gap-5">
                            <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center border border-white shadow-sm p-2 shrink-0">
                                <div className="flex flex-col items-center justify-center">
                                    <Globe size={32} className="text-emerald-600 mb-1" strokeWidth={1.5} />
                                    <span className="text-[10px] font-bold text-emerald-700 leading-none">TRAVEL</span>
                                    <span className="text-[10px] font-bold text-emerald-700 leading-none">PAKISTAN</span>
                                </div>
                            </div>
                            <div className="space-y-1.5 pt-1">
                                <h3 className="font-extrabold text-slate-800 text-lg leading-tight">92 World Travel And Tours</h3>
                                <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">Voucher Date:</span> 15-01-2025</p>
                                <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">Package:</span> 20 SKT-PKG-17-NOV</p>
                            </div>
                        </div>

                        {/* Right: Client Info */}
                        <div className="text-right space-y-1.5">
                            <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">Shirka:</span> Abdul Razzaq Al Kutbi</p>
                            <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">City:</span> Ali Pur Chattha</p>
                            <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">Helpline Number:</span> +92 316 6615 6363</p>
                            <p className="text-sm text-blue-600 font-bold"><span className="text-slate-700">Voucher Status:</span> Approved</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-10">

                    {/* 2. Mutamers Section */}
                    <section>
                        <div className="flex justify-between items-end mb-4">
                            <SectionTitle title="Mutamers" />
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                Family Head: <span className="text-slate-900">HAMZA JUTT</span>
                            </span>
                        </div>
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500 font-bold">
                                        <th className="px-4 py-3 w-12">SNO</th>
                                        <th className="px-4 py-3">Passport No.</th>
                                        <th className="px-4 py-3">Mutamer Name</th>
                                        <th className="px-4 py-3">G</th>
                                        <th className="px-4 py-3">PAX</th>
                                        <th className="px-4 py-3">Bed</th>
                                        <th className="px-4 py-3 text-center">MOFA#</th>
                                        <th className="px-4 py-3 text-center">GRP#</th>
                                        <th className="px-4 py-3 text-center">VISA#</th>
                                        <th className="px-4 py-3 text-right">PNR</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[
                                        { sn: 1, pass: 'J779633G', name: 'Hamza Jutt', g: 'M', pax: 'Adult', bed: 'Yes', status: 'APPROVED' },
                                        { sn: 2, pass: 'K234456', name: 'Bibi Ameeri', g: 'F', pax: 'Adult', bed: 'Yes', status: 'SEND TO EMBASSY' },
                                        { sn: 3, pass: 'L343652', name: 'Asfand Yar', g: 'M', pax: 'Adult', bed: 'Yes', status: 'APPROVED' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="text-xs font-semibold text-slate-700 hover:bg-slate-50/50">
                                            <td className="px-4 py-3 text-slate-400">{row.sn}</td>
                                            <td className="px-4 py-3 font-mono text-slate-500">{row.pass}</td>
                                            <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                                            <td className="px-4 py-3">{row.g}</td>
                                            <td className="px-4 py-3">{row.pax}</td>
                                            <td className="px-4 py-3">{row.bed}</td>
                                            <td className="px-4 py-3 text-center">-</td>
                                            <td className="px-4 py-3 text-center">-</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[10px] ${row.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">-</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 3. Accommodation Section */}
                    <section>
                        <SectionTitle title="Accommodation" />
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm min-w-[800px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                                            <th className="px-4 py-3">City</th>
                                            <th className="px-4 py-3 w-1/4">Hotel Name</th>
                                            <th className="px-4 py-3">Voucher No.</th>
                                            <th className="px-4 py-3">View</th>
                                            <th className="px-4 py-3">Meal</th>
                                            <th className="px-4 py-3">Conf#</th>
                                            <th className="px-4 py-3">Room Type</th>
                                            <th className="px-4 py-3">Check IN</th>
                                            <th className="px-4 py-3">Check OUT</th>
                                            <th className="px-4 py-3 text-right">Nights</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="text-xs font-semibold text-slate-700">
                                            <td className="px-4 py-3">Makkah</td>
                                            <td className="px-4 py-3 font-bold text-slate-900">JAWAD and AL KA'BI (AWAD NASA) Hotel / Similar</td>
                                            <td className="px-4 py-3 font-mono text-slate-500">625aca</td>
                                            <td className="px-4 py-3">Stand..</td>
                                            <td className="px-4 py-3">RO</td>
                                            <td className="px-4 py-3">-</td>
                                            <td className="px-4 py-3">Sharing(Gender)</td>
                                            <td className="px-4 py-3 text-blue-600 font-bold">17/01/25</td>
                                            <td className="px-4 py-3 text-slate-500">22/01/25</td>
                                            <td className="px-4 py-3 text-right font-bold">5</td>
                                        </tr>
                                        <tr className="text-xs font-semibold text-slate-700 bg-slate-50/30">
                                            <td className="px-4 py-3">Madina</td>
                                            <td className="px-4 py-3 font-bold text-slate-900">Ansar Plus Hotel / Similar</td>
                                            <td className="px-4 py-3 font-mono text-slate-500">626aca</td>
                                            <td className="px-4 py-3">Stand..</td>
                                            <td className="px-4 py-3">RO</td>
                                            <td className="px-4 py-3">-</td>
                                            <td className="px-4 py-3">Sharing(Gender)</td>
                                            <td className="px-4 py-3 text-blue-600 font-bold">25/01/25</td>
                                            <td className="px-4 py-3 text-slate-500">31/01/25</td>
                                            <td className="px-4 py-3 text-right font-bold">7</td>
                                        </tr>
                                        <tr className="text-xs font-semibold text-slate-700">
                                            <td className="px-4 py-3">Makkah</td>
                                            <td className="px-4 py-3 font-bold text-slate-900">JAWAD and AL KA'BI (AWAD NASA) Hotel / Similar</td>
                                            <td className="px-4 py-3 font-mono text-slate-500">625aca</td>
                                            <td className="px-4 py-3">Stand..</td>
                                            <td className="px-4 py-3">RO</td>
                                            <td className="px-4 py-3">-</td>
                                            <td className="px-4 py-3">Sharing(Gender)</td>
                                            <td className="px-4 py-3 text-blue-600 font-bold">31/01/25</td>
                                            <td className="px-4 py-3 text-slate-500">06/02/25</td>
                                            <td className="px-4 py-3 text-right font-bold">5</td>
                                        </tr>
                                        <tr className="bg-blue-50/50 border-t border-blue-100">
                                            <td colSpan="9" className="px-4 py-2 text-right text-xs font-bold text-blue-800 uppercase">Total Nights</td>
                                            <td className="px-4 py-2 text-right text-sm font-black text-blue-800">20</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* 4. Transport Section */}
                    <section>
                        <SectionTitle title="Transport / Services" />
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                                            <th className="px-4 py-3">Voucher No.</th>
                                            <th className="px-4 py-3">Transporter</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="text-xs font-semibold text-slate-700">
                                            <td className="px-4 py-3 font-mono text-slate-500">624aca</td>
                                            <td className="px-4 py-3">Company Transport</td>
                                            <td className="px-4 py-3">Economy By Bus</td>
                                            <td className="px-4 py-3 text-slate-500">Round Trip(Jed-Mak-Mad-Mak-Jed)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
                                <QrCode size={64} className="text-slate-800" />
                            </div>
                        </div>
                    </section>

                    {/* 5. Flight Details Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Departure */}
                        <div>
                            <h4 className="font-extrabold text-slate-800 mb-3 text-sm flex items-center gap-2">
                                <Plane size={16} className="text-blue-600 -rotate-45" />
                                Departure - Pakistan To KSA
                            </h4>
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="bg-blue-50/50 border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                                            <th className="px-3 py-2">Flight</th>
                                            <th className="px-3 py-2">Sector</th>
                                            <th className="px-3 py-2">Departure</th>
                                            <th className="px-3 py-2">Arrival</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="font-semibold text-slate-700">
                                            <td className="px-3 py-2">PF-720</td>
                                            <td className="px-3 py-2">LHE-JED</td>
                                            <td className="px-3 py-2">17-JAN 21:00</td>
                                            <td className="px-3 py-2">18-JAN 01:25</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Arrival */}
                        <div>
                            <h4 className="font-extrabold text-slate-800 mb-3 text-sm flex items-center gap-2">
                                <Plane size={16} className="text-blue-600 rotate-[135deg]" />
                                Arrival - KSA To Pakistan
                            </h4>
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="bg-blue-50/50 border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                                            <th className="px-3 py-2">Flight</th>
                                            <th className="px-3 py-2">Sector</th>
                                            <th className="px-3 py-2">Departure</th>
                                            <th className="px-3 py-2">Arrival</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="font-semibold text-slate-700">
                                            <td className="px-3 py-2">PF-720</td>
                                            <td className="px-3 py-2">JED-LHE</td>
                                            <td className="px-3 py-2">06-FEB 02:00</td>
                                            <td className="px-3 py-2">06-FEB 07:30</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* 6. Notes & Contacts */}
                    <section>
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-6">
                            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">Notes:</p>
                            <p className="text-xs text-amber-900 font-medium">PLEASE ACCOMMODATE WITH PRIORITY.</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-slate-800 shrink-0">Makkah Hotel:</span>
                                <span className="text-xs text-slate-500">RAJA USMAN(Day Duty): 00966547836477 &amp; HAMZA SHEIKH(Night Duty): 00966567038884</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-slate-800 shrink-0">Madina Hotel:</span>
                                <span className="text-xs text-slate-500">MR WAQAS AHMED: 00966555578047</span>
                            </div>
                            <div className="flex gap-2 md:col-span-2">
                                <span className="text-xs font-bold text-slate-800 shrink-0">Transport:</span>
                                <span className="text-xs text-slate-500">Amir Abbasi: 00966594957500</span>
                            </div>
                        </div>
                    </section>

                    {/* 7. Rules & Footer */}
                    <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h4 className="font-extrabold text-slate-800 mb-3 text-sm">Rules</h4>
                        <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-600 font-medium">
                            <li><span className="font-bold text-slate-800">Booking Confirmation:</span> This voucher serves as proof of hotel booking and must be presented at check-in.</li>
                            <li><span className="font-bold text-slate-800">Check-in &amp; Check-out:</span> Standard check-in time is 3:00 PM, and check-out time is 12:00 PM.</li>
                            <li><span className="font-bold text-slate-800">Identification Requirement:</span> Guests must present a valid passport, visa, and this voucher upon arrival.</li>
                            <li><span className="font-bold text-slate-800">Non-Transferable:</span> This voucher is non-transferable and can only be used by the individual(s) named on the booking.</li>
                            <li><span className="font-bold text-slate-800">No Show &amp; Late Arrival:</span> Failure to check in on the specified date without prior notice may result in cancellation without refund.</li>
                            <li><span className="font-bold text-slate-800">Amendments &amp; Cancellations:</span> Any changes or cancellations must be made through the travel agency and are subject to the agency and hotel's policies.</li>
                        </ol>
                        <div className="flex justify-center mt-8">
                            <QrCode size={80} className="text-slate-800" />
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
