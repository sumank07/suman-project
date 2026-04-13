import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, UserSquare2, AlertCircle, CheckCircle2, XCircle, ArrowLeft, History, FileText } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get('/appointments/my');
                setAppointments(response.data);
            } catch (error) {
                console.error('Failed to fetch appointments', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[50vh]">
            <div className="relative h-16 w-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-500 font-medium animate-pulse tracking-wide">Loading history...</p>
        </div>
    );

    return (
        <div className="relative mx-auto max-w-5xl pb-20 font-sans px-4 sm:px-0">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 w-full max-w-4xl h-[400px] opacity-40 mix-blend-multiply blur-3xl">
                <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br from-indigo-100 to-teal-100 rounded-full"></div>
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-bl from-teal-50 to-emerald-100 rounded-full"></div>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pt-8">
                
                {/* Clean Navigation & Header */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6">
                    <Link to="/patient" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-colors w-max group bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200">
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>

                    <div className="rounded-[2rem] bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/50 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-700 mb-4">
                                <History size={14} />
                                <span>Health Records</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Medical History</h1>
                            <p className="text-slate-500 font-medium text-lg mt-1">Review all your past and upcoming consultations.</p>
                        </div>
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-teal-100 to-emerald-50 text-teal-600 shadow-inner">
                            <FileText size={36} />
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                {appointments.length === 0 ? (
                    <motion.div variants={itemVariants} className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200/60 bg-white/50 backdrop-blur-xl py-20 px-6 text-center transition-all hover:bg-white/80">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgb(0,0,0,0.05)] ring-1 ring-slate-100">
                            <Calendar size={32} className="text-teal-500" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-800">No history found</h3>
                        <p className="mb-6 max-w-sm text-base text-slate-500">You haven't scheduled any appointments yet. Book your first visit to start building your health record.</p>
                        <Link
                            to="/patient/book"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 hover:bg-teal-700 px-8 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5"
                        >
                            Book First Appointment
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                        {appointments.sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime)).map(appt => (
                            <div key={appt.id} className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white/90 backdrop-blur-md p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(20,184,166,0.12)] hover:border-teal-100 hover:bg-white z-10 block">
                                <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-teal-400 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-teal-50/50 to-transparent -z-10 group-hover:from-teal-100/50 transition-colors"></div>
                                
                                <div className="flex flex-col gap-6 relative z-20">
                                    {/* Header: Status & Actions */}
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.65rem] font-bold tracking-widest uppercase shadow-sm ${
                                            appt.status === 'PENDING'
                                                ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/30'
                                                : appt.status === 'CONFIRMED'
                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/30'
                                                : appt.status === 'CANCELLED'
                                                ? 'bg-red-50 text-red-700 ring-1 ring-red-500/30'
                                                : 'bg-slate-50 text-slate-700 ring-1 ring-slate-500/30'
                                        }`}>
                                            {appt.status === 'PENDING' && <AlertCircle size={14} />}
                                            {appt.status === 'CONFIRMED' && <CheckCircle2 size={14} />}
                                            {appt.status === 'CANCELLED' && <XCircle size={14} />}
                                            {appt.status}
                                        </span>
                                    </div>

                                    {/* Middle: Doctor Info */}
                                    <div className="flex items-start gap-5">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors shadow-sm">
                                            <UserSquare2 size={26} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors">
                                                Dr. {appt.doctor.user.fullName}
                                            </h4>
                                            <p className="text-sm font-semibold text-slate-500 mt-0.5">
                                                {appt.doctor.specialization}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom: Date & Time */}
                                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 text-sm">
                                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 group-hover:bg-teal-50/50 px-3 py-2 rounded-xl border border-slate-100 transition-colors">
                                            <Calendar size={16} className="text-teal-600" />
                                            <span className="font-bold">{new Date(appt.dateTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 group-hover:bg-emerald-50/50 px-3 py-2 rounded-xl border border-slate-100 transition-colors">
                                            <Clock size={16} className="text-emerald-600" />
                                            <span className="font-bold">{new Date(appt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default MyAppointments;
