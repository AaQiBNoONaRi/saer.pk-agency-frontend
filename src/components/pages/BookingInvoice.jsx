import React from 'react';
import {
    Printer, Download, ArrowLeft,
    Globe
} from 'lucide-react';

const SectionTitle = ({ title }) => (
    <h3 className="text-sm font-extrabold text-slate-800 mb-4 border-l-4 border-slate-800 pl-3 uppercase tracking-wide">
        {title}
    </h3>
);

export default function BookingInvoice({ booking, onBack }) {
    const invoiceNo = booking?.invoiceNo || '488336516';

    return (
        <div className="p-8 max-w-[1600px] mx-auto print:p-0">

            {/* Action Toolbar */}
            <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                        <ArrowLeft
                            onClick={onBack}
                            className="cursor-pointer text-slate-400 hover:text-slate-800 transition-colors"
                            size={24}
                        />
                        Invoice <span className="text-slate-400 text-lg font-medium">({invoiceNo})</span>
                    </h2>
                </div>
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

            {/* INVOICE CARD */}
            <div className="max-w-5xl mx-auto bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">

                {/* 1. Header Section */}
                <div className="bg-[#EEEEEE] p-8 relative">
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

                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
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
                                <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">Booking Date:</span> 15-01-2025</p>
                                <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">Package:</span> 20 SKT-PKG-17-NOV</p>
                            </div>
                        </div>
                        <div className="text-right space-y-1.5">
                            <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">Shirka:</span> Abdul Razzaq Al Kutbi</p>
                            <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">City:</span> Ali Pur Chattha</p>
                            <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-slate-700">Helpline Number:</span> +92 316 6615 6363</p>
                            <p className="text-sm text-blue-600 font-bold"><span className="text-slate-700">Invoice Status:</span> Approved</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-10">

                    {/* 2. Pax Information */}
                    <section>
                        <SectionTitle title="Pax Information" />
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                                        <th className="px-4 py-3">Passenger Name</th>
                                        <th className="px-4 py-3">Passport No</th>
                                        <th className="px-4 py-3">PAX</th>
                                        <th className="px-4 py-3">DOB</th>
                                        <th className="px-4 py-3">PNR</th>
                                        <th className="px-4 py-3">Bed</th>
                                        <th className="px-4 py-3 text-right">Total Pax</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr className="text-xs font-semibold text-slate-700">
                                        <td className="px-4 py-3">BILAL AHMAD MUHAMMAD YASIR</td>
                                        <td className="px-4 py-3 font-mono">FE758453</td>
                                        <td className="px-4 py-3">Adult</td>
                                        <td className="px-4 py-3">23/07/73</td>
                                        <td className="px-4 py-3">RNIO23</td>
                                        <td className="px-4 py-3">True</td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-900" rowSpan={3}>2 Adult &amp; 1 Child</td>
                                    </tr>
                                    <tr className="text-xs font-semibold text-slate-700">
                                        <td className="px-4 py-3">ARSLAN BILAL BILAL AHMAD</td>
                                        <td className="px-4 py-3 font-mono">FE702511</td>
                                        <td className="px-4 py-3">Adult</td>
                                        <td className="px-4 py-3">28/07/83</td>
                                        <td className="px-4 py-3">RNIO23</td>
                                        <td className="px-4 py-3">True</td>
                                    </tr>
                                    <tr className="text-xs font-semibold text-slate-700">
                                        <td className="px-4 py-3">BEENISH BILAL</td>
                                        <td className="px-4 py-3 font-mono">CMG708591</td>
                                        <td className="px-4 py-3">Child</td>
                                        <td className="px-4 py-3">24/11/08</td>
                                        <td className="px-4 py-3">RNIO85</td>
                                        <td className="px-4 py-3">True</td>
                                    </tr>
                                    <tr className="bg-slate-50/50">
                                        <td colSpan={7} className="px-4 py-2 text-right text-xs font-bold text-slate-500">Total: 3</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 3. Accommodation */}
                    <section>
                        <SectionTitle title="Accommodation" />
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm min-w-[900px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                                            <th className="px-4 py-3">Hotel Name</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Check-In</th>
                                            <th className="px-4 py-3 text-center">Nights</th>
                                            <th className="px-4 py-3">Check-Out</th>
                                            <th className="px-4 py-3 text-right">Rate</th>
                                            <th className="px-4 py-3 text-center">QTY</th>
                                            <th className="px-4 py-3 text-right">Net</th>
                                            <th className="px-4 py-3 text-center">R.O.R</th>
                                            <th className="px-4 py-3 text-right">Pkr Net</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            { ci: '21/01/2024', co: '29/01/2024', n: 8, rate: 'SAR 12', net: 'PKR 10,000', ror: 80, pkr: 'PKR 10,000' },
                                            { ci: '29/01/2024', co: '05/02/2024', n: 7, rate: '0', net: '0', ror: 80, pkr: '0' },
                                            { ci: '29/01/2024', co: '03/02/2024', n: 5, rate: 'SAR 12', net: 'SAR 150', ror: 80, pkr: 'SAR 150' },
                                        ].map((row, i) => (
                                            <tr key={i} className="text-xs font-semibold text-slate-700">
                                                <td className="px-4 py-3">Hotel SAMA-BAT / SIMILAR</td>
                                                <td className="px-4 py-3">Tri Bed</td>
                                                <td className="px-4 py-3">{row.ci}</td>
                                                <td className="px-4 py-3 text-center font-bold">{row.n}</td>
                                                <td className="px-4 py-3">{row.co}</td>
                                                <td className="px-4 py-3 text-right">{row.rate}</td>
                                                <td className="px-4 py-3 text-center">6</td>
                                                <td className="px-4 py-3 text-right">{row.net}</td>
                                                <td className="px-4 py-3 text-center">{row.ror}</td>
                                                <td className="px-4 py-3 text-right">{row.pkr}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800 text-xs">
                                            <td colSpan={3} className="px-4 py-3 text-right uppercase">Total Accommodation</td>
                                            <td className="px-4 py-3 text-center">20</td>
                                            <td colSpan={3}></td>
                                            <td className="px-4 py-3 text-right">SAR 488</td>
                                            <td></td>
                                            <td className="px-4 py-3 text-right">PKR 488</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* 4. Transportation */}
                    <section>
                        <SectionTitle title="Transportation" />
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                                        <th className="px-4 py-3">Vehicle Type</th>
                                        <th className="px-4 py-3">Route</th>
                                        <th className="px-4 py-3 text-right">Rate</th>
                                        <th className="px-4 py-3 text-center">QTY</th>
                                        <th className="px-4 py-3 text-right">Net</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-xs font-semibold text-slate-700">
                                        <td className="px-4 py-3">Economy By Bus</td>
                                        <td className="px-4 py-3">JED - MAK(6) - MAD(6) - MAK(3) - MED(6)</td>
                                        <td className="px-4 py-3 text-right">0</td>
                                        <td className="px-4 py-3 text-center">1</td>
                                        <td className="px-4 py-3 text-right">0</td>
                                    </tr>
                                    <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800 text-xs">
                                        <td colSpan={2} className="px-4 py-3 text-right uppercase">Total Transportation</td>
                                        <td colSpan={3} className="px-4 py-3 text-right">0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 5. Pilgrims & Tickets Detail */}
                    <section>
                        <SectionTitle title="Pilgrims & Tickets Detail" />
                        <div className="border border-slate-200 rounded-xl overflow-hidden max-w-lg">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500 font-bold">
                                        <th className="px-4 py-3">Pax</th>
                                        <th className="px-4 py-3 text-center">Total Pax</th>
                                        <th className="px-4 py-3 text-right">Visa Rate</th>
                                        <th className="px-4 py-3 text-right">Ticket Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[
                                        { type: 'Adult', qty: 2, visa: 'SAR 510', ticket: 'PKR 120,000' },
                                        { type: 'Child', qty: 1, visa: 'SAR 215', ticket: 'PKR 120,000' },
                                        { type: 'Infant', qty: 1, visa: 'SAR 215', ticket: 'PKR 120,000' },
                                    ].map((row, i) => (
                                        <tr key={i} className="text-xs font-semibold text-slate-700">
                                            <td className="px-4 py-2">{row.type}</td>
                                            <td className="px-4 py-2 text-center">{row.qty}</td>
                                            <td className="px-4 py-2 text-right">{row.visa}</td>
                                            <td className="px-4 py-2 text-right">{row.ticket}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-50 font-bold text-slate-800 text-xs">
                                        <td className="px-4 py-2 uppercase">Total</td>
                                        <td className="px-4 py-2 text-center">4</td>
                                        <td className="px-4 py-2 text-right">SAR 1472</td>
                                        <td className="px-4 py-2 text-right">PKR 480,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 6. Invoice Details & Footer */}
                    <section className="mt-12">
                        <div className="flex flex-col md:flex-row justify-between gap-12">
                            {/* Left: Metadata */}
                            <div className="space-y-4 text-xs">
                                <h4 className="font-extrabold text-slate-800 text-sm mb-4">Invoice Details</h4>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 max-w-md">
                                    <span className="text-slate-500 font-medium">Booking Date:</span>
                                    <span className="font-bold text-slate-800">18/01/25</span>
                                    <span className="text-slate-500 font-medium">Booking#:</span>
                                    <span className="font-bold text-slate-800">UB-161799</span>
                                    <span className="text-slate-500 font-medium">Invoice Date:</span>
                                    <span className="font-bold text-slate-800">18/01/25</span>
                                    <span className="text-slate-500 font-medium">Family Head:</span>
                                    <span className="font-bold text-slate-800 uppercase">ARSLAN BILAL BILAL AHMAD</span>
                                    <span className="text-slate-500 font-medium">Travel Date:</span>
                                    <span className="font-bold text-slate-800">SV.234-LHE-JED 19-DEC-2024-23:20-01:20</span>
                                    <span className="text-slate-500 font-medium">Return Date:</span>
                                    <span className="font-bold text-slate-800">SV.234-LHE-JED 19-DEC-2024-23:20-01:20</span>
                                </div>
                            </div>

                            {/* Right: Calculations */}
                            <div className="space-y-3 text-right min-w-[300px]">
                                <div className="text-sm text-slate-500 font-medium">Total Pax: <span className="font-bold text-slate-900">3</span></div>
                                <div className="pt-2 border-t border-slate-100 space-y-2">
                                    {[
                                        { label: 'PKR Rate: Visa Rate @ 75.75 =', val: 'PKR 117,716' },
                                        { label: 'Tickets :', val: 'PKR 480,000' },
                                        { label: 'PKR Rate: Hotel @ 75.75 =', val: 'PKR 35,451' },
                                        { label: 'PKR Rate: Transport @ 75.75 =', val: 'PKR 0' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between text-xs font-bold text-slate-600">
                                            <span>{item.label}</span>
                                            <span className="text-slate-800">{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4">
                                    <div className="bg-blue-600 text-white text-sm font-bold py-3 px-6 rounded-xl inline-block shadow-lg shadow-blue-600/20">
                                        Net PKR = PKR 153,167
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 7. Notes */}
                    <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                        <div className="text-xs">
                            <span className="font-bold text-slate-900">Booking Notes:</span>{' '}
                            <span className="text-slate-600">Biryani meal only.</span>
                        </div>
                        <div className="text-xs">
                            <span className="font-bold text-slate-900">Voucher Notes:</span>{' '}
                            <span className="text-slate-600">need window seat only on airplane and need clean and neat room.</span>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
