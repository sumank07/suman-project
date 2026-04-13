import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Trash2, Mail, Award, Stethoscope, MoreVertical, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        specialization: '',
        experienceYears: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error("Fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/doctors', {
                ...formData,
                experienceYears: parseInt(formData.experienceYears)
            });
            setStatus({ type: 'success', message: 'Credentials generated successfully.' });
            fetchDoctors();
            setTimeout(() => {
                setShowModal(false);
                setFormData({ fullName: '', email: '', password: '', specialization: '', experienceYears: '' });
                setStatus({ type: '', message: '' });
            }, 1000);
        } catch (error) {
            setStatus({ type: 'error', message: 'Authorization failed or email conflict.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Confirm deletion of specialist record?")) return;
        try {
            await api.delete(`/admin/doctors/${id}`);
            fetchDoctors();
        } catch (error) {
            alert("Database write failed.");
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.put(`/admin/doctors/${id}/status`);
            fetchDoctors();
        } catch (error) {
            alert("Failed to toggle status.");
        }
    };

    const filteredDoctors = doctors.filter(d => 
        d.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout 
            title="Medical Practitioners" 
            subtitle="Manage clinical staff, credentials, and availability."
            actions={
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-all shadow-sm active:scale-95"
                >
                    <UserPlus size={18} /> Add Practitioner
                </button>
            }
        >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {/* Search Bar */}
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter by name or specialty..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Practitioner</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialization</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDoctors.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 font-bold text-sm">
                                                {doc.user.fullName.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm">Dr. {doc.user.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                            <Stethoscope size={14} className="text-teal-500" />
                                            {doc.specialization}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                            <Award size={14} className="text-teal-500" />
                                            {doc.experienceYears} Years
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            doc.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${
                                                doc.status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'
                                            }`}></div>
                                            {doc.status || 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleToggleStatus(doc.id)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Toggle Status"
                                            >
                                                <Award size={16} className={doc.status === 'ACTIVE' ? "rotate-180" : ""} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(doc.id)}
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

                {filteredDoctors.length === 0 && !loading && (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">No matching records</p>
                    </div>
                )}
            </div>

            {/* Modal - Clean Design */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Onboard Practitioner</h3>
                                <form onSubmit={handleAddDoctor} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                                        <input
                                            className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/20"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/20"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Specialty</label>
                                            <input
                                                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/20"
                                                value={formData.specialization}
                                                onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Exp (Yrs)</label>
                                            <input
                                                type="number"
                                                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/20"
                                                value={formData.experienceYears}
                                                onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Access Password</label>
                                        <input
                                            type="password"
                                            className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/20"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50"
                                        >
                                            Dismiss
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default ManageDoctors;
