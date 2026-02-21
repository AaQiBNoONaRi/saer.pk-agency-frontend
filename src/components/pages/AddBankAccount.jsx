import React, { useState } from 'react';
import {
    ArrowLeft, CreditCard, Loader2, Check, Landmark, User, MoreVertical
} from 'lucide-react';

export default function AddBankAccount({ onBack, editingAccount }) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        bankName: editingAccount?.bank_name || '',
        accountTitle: editingAccount?.account_title || '',
        accountNumber: editingAccount?.account_number || '',
        iban: editingAccount?.iban || '',
        status: editingAccount?.status || 'Active'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const url = editingAccount
                ? `http://localhost:8000/api/bank-accounts/${editingAccount._id}`
                : 'http://localhost:8000/api/bank-accounts';

            const method = editingAccount ? 'PUT' : 'POST';

            const payload = {
                bank_name: formData.bankName,
                account_title: formData.accountTitle,
                account_number: formData.accountNumber,
                iban: formData.iban,
                status: formData.status,
                account_type: 'Agency'
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                onBack();
            } else {
                const err = await response.json();
                alert(`Failed to save account: ${err.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving account:', error);
            alert('Error saving account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-all"
                >
                    <ArrowLeft size={24} className="stroke-3" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                        {editingAccount ? 'Edit Bank Account' : 'Add Bank Account'}
                    </h1>
                    <p className="text-sm font-bold text-slate-400 mt-2">
                        {editingAccount ? 'Update existing account details' : 'Create a new agency bank account'}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto w-full space-y-8">

                <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-2">
                        <Landmark size={24} className="text-blue-600" /> Account Details
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Bank Name</label>
                            <input
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none placeholder:text-slate-300"
                                required
                                placeholder="e.g. Meezan Bank"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Account Title</label>
                            <input
                                name="accountTitle"
                                value={formData.accountTitle}
                                onChange={handleInputChange}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none placeholder:text-slate-300"
                                required
                                placeholder="e.g. Agency Operations"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Account Number</label>
                                <input
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-mono placeholder:text-slate-300"
                                    required
                                    placeholder="0000..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">IBAN (Optional)</label>
                                <input
                                    name="iban"
                                    value={formData.iban}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-mono placeholder:text-slate-300"
                                    placeholder="PK..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Status</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <MoreVertical className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                                {editingAccount ? 'Save Changes' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
