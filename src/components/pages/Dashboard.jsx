import React from 'react';
import {
    LayoutDashboard, Ticket, Package, Users,
    CreditCard, BarChart3, Settings,
    TrendingUp, TrendingDown,
    PlusCircle, UserPlus, ListChecks, Wallet,
    ExternalLink
} from 'lucide-react';

export default function Dashboard() {
    // Mock Data
    const kpiData = [
        { title: 'Total Bookings', value: '1,284', trend: '+12.5%', isUp: true, icon: BarChart3, gradient: 'from-blue-600 to-blue-400' },
        { title: 'Active Bookings', value: '342', trend: '85%', isUp: true, icon: ListChecks, gradient: 'from-emerald-600 to-emerald-400' },
        { title: 'Total Revenue', value: '$124,500', trend: '+18.2%', isUp: true, icon: Wallet, gradient: 'from-violet-600 to-violet-400' },
        { title: 'Commission Earned', value: '$12,450', trend: '10%', isUp: true, icon: TrendingUp, gradient: 'from-amber-600 to-amber-400' },
    ];

    const recentBookings = [
        { id: 'BK-9021', package: 'Ramadan Umrah Deluxe', customer: 'Ahmed Abdullah', date: 'Oct 24, 2025', status: 'Confirmed' },
        { id: 'BK-9022', package: 'Economy 15 Days', customer: 'Sara Malik', date: 'Oct 23, 2025', status: 'Pending' },
        { id: 'BK-9023', package: 'Premium Ziyarat', customer: 'Mubeen Bhullar', date: 'Oct 22, 2025', status: 'Confirmed' },
        { id: 'BK-9024', package: 'Family Group Pk', customer: 'Zaid Khan', date: 'Oct 21, 2025', status: 'Cancelled' },
        { id: 'BK-9025', package: 'Standard Umrah', customer: 'Fatima Noor', date: 'Oct 20, 2025', status: 'Confirmed' },
    ];

    const topPackages = [
        { name: 'VIP Ramadan Package', bookings: 450, revenue: '$45,000', perf: 92 },
        { name: 'Economy Umrah Plus', bookings: 320, revenue: '$22,400', perf: 78 },
        { name: 'Short Stay Ziyarat', bookings: 210, revenue: '$15,750', perf: 65 },
        { name: 'Group Hajj 2026', bookings: 140, revenue: '$98,000', perf: 88 },
    ];

    const StatusBadge = ({ status }) => {
        const styles = {
            Confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            Pending: 'bg-amber-50 text-amber-600 border-amber-100',
            Cancelled: 'bg-rose-50 text-rose-600 border-rose-100'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div>

            {/* PAGE TITLE */}
            <div className="mb-8">
                <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Agency Overview</h1>
                <p className="text-sm text-slate-500 font-medium">Welcome back! Here's what's happening with your bookings today.</p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {kpiData.map((kpi, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${kpi.gradient} opacity-[0.03] rounded-bl-full`}></div>
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.gradient} text-white shadow-lg shadow-blue-500/10`}>
                                <kpi.icon size={22} />
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] font-black ${kpi.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {kpi.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {kpi.trend}
                            </div>
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.title}</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
                    </div>
                ))}
            </div>

            {/* MIDDLE SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">

                {/* Revenue Trend - Left 60% */}
                <div className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue Overview</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Growth trend: Oct 2025 - Mar 2026</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>

                    {/* Mock Chart Visualization */}
                    <div className="h-[280px] w-full flex items-end gap-2 px-2 relative">
                        {[45, 65, 55, 85, 75, 95].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group relative">
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                                    ${h}k
                                </div>
                                <div className="w-full bg-blue-50 rounded-t-xl group-hover:bg-blue-100 transition-all" style={{ height: `${h * 2}px` }}>
                                    <div className="w-full bg-blue-600 rounded-t-xl opacity-20" style={{ height: '30%' }}></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-tighter">
                                    {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Bookings - Right 40% */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Bookings</h3>
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                            View All <ExternalLink size={12} />
                        </button>
                    </div>
                    <div className="flex-1 space-y-4">
                        {recentBookings.map((bk, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                                        <Ticket size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-black text-slate-900 leading-tight">{bk.package}</p>
                                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">{bk.customer} • {bk.date}</p>
                                    </div>
                                </div>
                                <StatusBadge status={bk.status} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Top Performing Packages */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Top Performing Packages</h3>
                    <div className="space-y-6">
                        {topPackages.map((pkg, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-blue-600 border border-slate-100 text-[10px]">
                                            0{idx + 1}
                                        </div>
                                        <span className="text-[13px] font-black text-slate-800 tracking-tight">{pkg.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[11px] font-black text-slate-900">{pkg.revenue}</span>
                                        <span className="text-[10px] font-bold text-slate-400 block tracking-tighter">{pkg.bookings} Bookings</span>
                                    </div>
                                </div>
                                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pkg.perf}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-8">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-blue-50/50 border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-600/20 transition-all duration-300 group">
                            <PlusCircle size={24} className="mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">New Booking</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-xl hover:shadow-emerald-600/20 transition-all duration-300 group">
                            <UserPlus size={24} className="mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Add Customer</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-violet-50/50 border border-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white hover:shadow-xl hover:shadow-violet-600/20 transition-all duration-300 group">
                            <ListChecks size={24} className="mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">All Bookings</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-amber-50/50 border border-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white hover:shadow-xl hover:shadow-amber-600/20 transition-all duration-300 group">
                            <Wallet size={24} className="mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Payment Entry</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
