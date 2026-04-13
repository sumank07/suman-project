import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, User, Trash2, Filter, MoreHorizontal } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';

const ManagePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPatients = async () => {
        try {
            const response = await api.get('/admin/patients');
            setPatients(response.data);
        } catch (error) {
            console.error("Patient fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Confirm termination of patient record and associated data?")) return;
        try {
            await api.delete(`/admin/patients/${id}`);
            fetchPatients();
        } catch (error) {
            alert("Database action failed.");
        }
    };

    const filteredPatients = patients.filter(p =>
        p.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout 
            title="User Database" 
            subtitle="Centralized registry of all registered patients."
        >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {/* Controls */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Find patient by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all border border-slate-200">
                        <Filter size={16} /> Filter Registry
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Identity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender / DOB</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                                {patient.user?.fullName?.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-900 text-sm leading-none">{patient.user?.fullName}</span>
                                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1 block">Patient ID: PAT-{patient.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                                <Mail size={12} className="text-slate-400" />
                                                {patient.user?.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                                <Phone size={10} />
                                                {patient.contactNumber || 'No Direct Contact'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                                            {patient.gender || 'Pending'} • {patient.dob || 'TBD'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            <div className="w-1 h-1 rounded-full bg-green-600"></div>
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                                <MoreHorizontal size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(patient.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPatients.length === 0 && !loading && (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Empty Registry Scan</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManagePatients;
