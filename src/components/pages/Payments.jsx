import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, MoreVertical, Building2,
    CreditCard, Landmark, Loader2, Trash2, Edit2, CheckCircle, XCircle
} from 'lucide-react';

export default function Payments({ onAddAccount, onEditAccount }) {
    const [activeTab, setActiveTab] = useState('Bank Accounts');
    // const [isModalOpen, setIsModalOpen] = useState(false); // REMOVED
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form States - MOVED
    // const [formData, setFormData] = useState({...});
    // const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (activeTab === 'Bank Accounts') {
            fetchAccounts();
        }
    }, [activeTab]);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const response = await fetch('http://localhost:8000/api/bank-accounts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setAccounts(data);
            } else {
                console.error("Failed to fetch accounts");
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (type !== 'Agency') {
            alert("You can only delete your own Agency accounts.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`http://localhost:8000/api/bank-accounts/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    fetchAccounts();
                } else {
                    alert('Failed to delete account');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F8FAFC]">
            {/* Header */}
            <div className="mb-8 pl-8 pt-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Payments & Finance</h1>
                <p className="text-sm font-bold text-slate-400 mt-2">Manage bank accounts and transactions</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 space-x-8 px-8">
                {['Bank Accounts'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'Bank Accounts' && (
                <div className="space-y-6 px-8 pb-8">
                    {/* Actions Bar */}
                    <div className="flex justify-between items-center">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search accounts..."
                                className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 w-64 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={onAddAccount}
                            className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center gap-2"
                        >
                            <Plus size={16} /> Add Account
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-8 py-5">Bank Name</th>
                                        <th className="px-8 py-5">Account Title</th>
                                        <th className="px-8 py-5">Account Number</th>
                                        <th className="px-8 py-5">IBAN</th>
                                        <th className="px-8 py-5">Type</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="px-8 py-12 text-center text-slate-400">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Loader2 className="animate-spin" size={20} /> Loading accounts...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : accounts.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-8 py-12 text-center text-slate-400 font-bold">
                                                No bank accounts found
                                            </td>
                                        </tr>
                                    ) : (
                                        accounts.map((acc) => (
                                            <tr key={acc._id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                            <Landmark size={20} />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700">{acc.bank_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-bold text-slate-700">{acc.account_title}</td>
                                                <td className="px-8 py-5 text-sm font-semibold text-slate-600 font-mono">{acc.account_number}</td>
                                                <td className="px-8 py-5 text-sm font-semibold text-slate-500 font-mono">{acc.iban || '-'}</td>
                                                <td className="px-8 py-5">
                                                    {acc.account_type === 'Agency' ? (
                                                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-[10px] font-black border border-purple-100">
                                                            <Building2 size={12} /> AGENCY (ME)
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-black border border-blue-100">
                                                            <Building2 size={12} /> ORGANIZATION
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black border ${acc.status === 'Active'
                                                        ? 'bg-green-50 text-green-700 border-green-100'
                                                        : 'bg-slate-50 text-slate-500 border-slate-200'
                                                        }`}>
                                                        {acc.status === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                        {acc.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    {acc.account_type === 'Agency' && (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => onEditAccount(acc)}
                                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(acc._id, acc.account_type)}
                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
