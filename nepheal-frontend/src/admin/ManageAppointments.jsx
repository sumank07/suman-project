import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Trash2, CheckCircle, Activity, Filter, Download, XCircle, Edit } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDateTime, setNewDateTime] = useState('');

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/admin/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error("Session stream failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Authorize permanent termination of clinical session?")) return;
        try {
            await api.delete(`/admin/appointments/${id}`);
            fetchAppointments();
        } catch (error) {
            alert("Database synchronized failed.");
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this session?")) return;
        try {
            await api.put(`/admin/appointments/${id}/status?status=CANCELLED`);
            fetchAppointments();
        } catch (error) {
            alert("Failed to cancel session.");
        }
    };

    const openReschedule = (app) => {
        setSelectedAppointment(app);
        setNewDateTime(app.dateTime.slice(0, 16)); // Format for datetime-local
        setShowRescheduleModal(true);
    };

    const handleReschedule = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/appointments/${selectedAppointment.id}/reschedule?dateTime=${newDateTime}:00`);
            setShowRescheduleModal(false);
            fetchAppointments();
        } catch (error) {
            alert("Failed to reschedule session.");
        }
    };

    const filteredAppointments = appointments.filter(app => {
        const matchesSearch = 
            app.patient?.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.doctor?.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout 
            title="Session Monitor" 
            subtitle="Real-time clinical session orchestration."
            actions={
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    <Download size={14} /> Export Logs
                </button>
            }
        >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {/* Header Controls */}
                <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/30">
                    <div className="flex gap-2">
                        {['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filterStatus === s 
                                    ? 'bg-teal-600 text-white shadow-sm' 
                                    : 'bg-white text-slate-400 border border-slate-100 hover:border-teal-200'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 lg:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Filter sessions stream..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stream Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident / Patient</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending Specialist</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Window</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAppointments.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {app.patient?.user?.fullName?.charAt(0) || '?'}
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm tracking-tight">{app.patient?.user?.fullName || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                                                {app.doctor?.user?.fullName?.charAt(0) || '?'}
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm tracking-tight">Dr. {app.doctor?.user?.fullName || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                                            <Calendar size={12} className="text-teal-600" />
                                            {new Date(app.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">
                                            <Clock size={10} />
                                            {new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            app.status === 'PENDING' ? 'bg-blue-50 text-blue-600' :
                                            app.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                            'bg-red-50 text-red-600'
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${
                                                app.status === 'PENDING' ? 'bg-blue-600' :
                                                app.status === 'COMPLETED' ? 'bg-green-600' :
                                                'bg-red-600'
                                            }`}></div>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {app.status === 'PENDING' && (
                                                <>
                                                    <button 
                                                        onClick={() => openReschedule(app)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Reschedule Session"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancel(app.id)}
                                                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                                                        title="Cancel Session"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(app.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Terminate Incident"
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

                {!loading && filteredAppointments.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Zero Incidents Tracked</p>
                    </div>
                )}
            </div>

            {/* Reschedule Modal */}
            <AnimatePresence>
                {showRescheduleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
                        >
                            <div className="p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Reschedule Session</h3>
                                <form onSubmit={handleReschedule} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/20"
                                            value={newDateTime}
                                            onChange={e => setNewDateTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowRescheduleModal(false)}
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

export default ManageAppointments;
