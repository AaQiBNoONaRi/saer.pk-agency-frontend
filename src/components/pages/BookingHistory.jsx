import React, { useState } from 'react';
import {
    Calendar, Search, Filter, Download, Eye,
    CheckCircle, XCircle, Clock, AlertCircle, MoreHorizontal, FileText
} from 'lucide-react';
import BookingVoucher from './BookingVoucher';
import BookingInvoice from './BookingInvoice';
import GroupTicketInvoice from './GroupTicketInvoice';

// --- Status Badge ---
const StatusBadge = ({ status }) => {
    const styles = {
        'Confirmed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'Cancelled': 'bg-rose-50 text-rose-600 border-rose-100',
        'Expired': 'bg-slate-50 text-slate-500 border-slate-100',
    };
    const icons = {
        'Confirmed': CheckCircle,
        'Pending': Clock,
        'Cancelled': XCircle,
        'Expired': AlertCircle,
    };
    const Icon = icons[status] || AlertCircle;
    const style = styles[status] || styles['Expired'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style}`}>
            <Icon size={12} strokeWidth={2.5} />
            {status}
        </span>
    );
};

// --- Tab Button ---
const TabButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`
            px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border
            ${active
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                : 'bg-slate-50 text-slate-500 border-transparent hover:bg-white hover:border-slate-200 hover:text-slate-700'}
        `}
    >
        {label}
    </button>
);

// --- Mock Data ---
const MOCK_BOOKINGS = [
    { id: 'ORD-9912', date: 'Oct 24, 2024', pax: 'Muhammad Ali', expiry: '04:15:00', status: 'Pending', amount: '150,000' },
    { id: 'ORD-9911', date: 'Oct 23, 2024', pax: 'Sarah Ahmed', expiry: '-', status: 'Confirmed', amount: '85,500' },
    { id: 'ORD-9910', date: 'Oct 22, 2024', pax: 'Usman Khan', expiry: '00:00:00', status: 'Expired', amount: '45,000' },
    { id: 'ORD-9909', date: 'Oct 21, 2024', pax: 'Fatima Bibi', expiry: '-', status: 'Cancelled', amount: '120,000' },
    { id: 'ORD-9908', date: 'Oct 20, 2024', pax: 'Kamran Akmal', expiry: '23:45:00', status: 'Pending', amount: '65,000' },
];

const TABLE_HEADERS = ['Booking Date', 'Order No.', 'Pax Name', 'Expiry Timer', 'Booking Status', 'Amount', 'Action'];

export default function BookingHistory() {
    const [activeTab, setActiveTab] = useState('Custom Package Bookings');
    const [orderNo, setOrderNo] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [openActionId, setOpenActionId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedGroupTicket, setSelectedGroupTicket] = useState(null);

    const tabs = ['Groups Tickets', 'UMRAH BOOKINGS', 'Custom Package Bookings'];
    const isGroupTab = activeTab === 'Groups Tickets';

    // Groups Tickets tab: both See Booking and Invoice show GroupTicketInvoice
    if (selectedGroupTicket) {
        return <GroupTicketInvoice booking={selectedGroupTicket} onBack={() => setSelectedGroupTicket(null)} />;
    }

    // Other tabs: See Booking → Voucher, Invoice → Invoice
    if (selectedBooking) {
        return <BookingVoucher booking={selectedBooking} onBack={() => setSelectedBooking(null)} />;
    }

    if (selectedInvoice) {
        return <BookingInvoice booking={selectedInvoice} onBack={() => setSelectedInvoice(null)} />;
    }

    return (
        <div
            className="p-4 md:p-8 space-y-6 min-h-full"
            onClick={() => setOpenActionId(null)}
        >
            {/* Search Filters Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100/50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">

                    {/* Order No */}
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Order No.</label>
                        <input
                            type="text"
                            placeholder="Type Order No."
                            value={orderNo}
                            onChange={(e) => setOrderNo(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-slate-400 outline-none"
                        />
                    </div>

                    {/* From Date */}
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">From</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                        />
                    </div>

                    {/* To Date */}
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">To</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                        />
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-3">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
                            <Search size={18} strokeWidth={2.5} />
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Data Section */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100/50">

                {/* Tabs Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                        {tabs.map(tab => (
                            <TabButton
                                key={tab}
                                label={tab}
                                active={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                            />
                        ))}
                    </div>
                </div>

                {/* Table Action Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-800">Booking</h3>
                        <p className="text-xs font-semibold text-slate-400">{MOCK_BOOKINGS.length} bookings found</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">
                            <Filter size={14} />
                            Filters
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">
                            <Download size={14} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Table Header Row */}
                <div className="grid grid-cols-7 gap-4 px-6 py-4 bg-slate-50 rounded-2xl mb-2 border border-slate-100">
                    {TABLE_HEADERS.map((header, idx) => (
                        <div key={idx} className={`text-xs font-bold text-slate-400 uppercase tracking-wide ${idx === 6 ? 'text-right' : ''}`}>
                            {header}
                        </div>
                    ))}
                </div>

                {/* Data Rows */}
                <div className="space-y-2">
                    {MOCK_BOOKINGS.map((booking) => (
                        <div key={booking.id} className="relative">
                            <div className="grid grid-cols-7 gap-4 px-6 py-5 bg-white border border-slate-100 rounded-2xl items-center hover:shadow-md hover:border-blue-100 transition-all group">

                                {/* Date */}
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <Calendar size={14} className="text-slate-400" />
                                    {booking.date}
                                </div>

                                {/* Order No */}
                                <div className="text-sm font-bold text-blue-600">{booking.id}</div>

                                {/* Pax Name */}
                                <div className="text-sm font-semibold text-slate-700">{booking.pax}</div>

                                {/* Expiry */}
                                <div className="text-sm font-mono font-medium text-slate-500">{booking.expiry}</div>

                                {/* Status */}
                                <div><StatusBadge status={booking.status} /></div>

                                {/* Amount */}
                                <div className="text-sm font-extrabold text-slate-800">Rs. {booking.amount}</div>

                                {/* Actions */}
                                <div className="flex justify-end relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenActionId(openActionId === booking.id ? null : booking.id);
                                        }}
                                        className={`p-2 rounded-lg transition-colors ${openActionId === booking.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openActionId === booking.id && (
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); isGroupTab ? setSelectedGroupTicket(booking) : setSelectedBooking(booking); setOpenActionId(null); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                <Eye size={16} />
                                                See Booking
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); isGroupTab ? setSelectedGroupTicket(booking) : setSelectedInvoice(booking); setOpenActionId(null); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-50"
                                            >
                                                <FileText size={16} />
                                                Invoice
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-50">
                                                <Download size={16} />
                                                Download Voucher
                                            </button>
                                            <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors border-t border-slate-100">
                                                <XCircle size={16} />
                                                Cancel Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
