import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, UserSquare2, ChevronRight, Sparkles, Stethoscope, Search, Star, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';

const PatientDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptResponse, docsResponse] = await Promise.all([
                    api.get('/appointments/my'),
                    api.get('/doctors')
                ]);
                setAppointments(apptResponse.data);
                setDoctors(docsResponse.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const upcoming = appointments.filter(a => new Date(a.dateTime) > new Date() && a.status !== 'CANCELLED').sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));
    const past = appointments.filter(a => new Date(a.dateTime) <= new Date() || a.status === 'CONFIRMED').sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime));

    const filteredDoctors = doctors.filter(d => 
        (d.user && d.user.fullName && d.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (d.specialization && d.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <div className="relative h-16 w-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-500 font-medium animate-pulse tracking-wide">Loading your dashboard...</p>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="relative mx-auto max-w-6xl pb-12 font-sans px-4 sm:px-0">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 w-full max-w-4xl h-[500px] opacity-40 mix-blend-multiply blur-3xl">
                <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br from-teal-200 to-emerald-100 rounded-full"></div>
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-bl from-blue-100 to-cyan-100 rounded-full"></div>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-12">
                
                {/* Top Profile Bar */}
                <motion.div variants={itemVariants} className="flex items-center justify-end gap-4 pt-4">
                    <Link to="/patient/profile" className="flex items-center gap-3 bg-white/60 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-all group">
                        <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm ring-2 ring-white">
                            {user?.fullName?.charAt(0) || 'P'}
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-teal-700 transition-colors">My Profile</span>
                    </Link>
                    <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 text-slate-500 hover:text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-full transition-colors text-sm font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                    </button>
                </motion.div>

                {/* Elevated Header */}
                <motion.div variants={itemVariants} className="text-center flex flex-col items-center gap-6 mb-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/50 bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700 shadow-sm backdrop-blur-md">
                        <Sparkles size={14} className="text-teal-500" />
                        <span>Your Health Hub</span>
                    </div>
                    <div>
                        <h1 className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 bg-clip-text text-[2.5rem] font-extrabold tracking-tight text-transparent sm:text-[3rem]">
                            Welcome back, {user?.fullName?.split(' ')[0] || 'Patient'}
                        </h1>
                        <p className="mx-auto mt-3 max-w-md text-[1.1rem] font-medium text-slate-500 leading-relaxed">
                            Stay on top of your appointments and powerfully manage your health.
                        </p>
                    </div>
                </motion.div>

                {/* Quick Actions & Search Area */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 mx-auto max-w-3xl w-full relative z-20">
                    <div className="relative flex items-center w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-4 focus-within:ring-2 focus-within:ring-teal-100 focus-within:border-teal-300 transition-all">
                        <Search size={20} className="text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search doctors, specialities, or clinics..." 
                            className="bg-transparent w-full h-full outline-none px-3 text-slate-700 placeholder:text-slate-400 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link to="/patient/book" className="flex items-center justify-center gap-2 h-14 px-8 rounded-2xl bg-slate-900 hover:bg-teal-700 transition-colors text-white font-bold shadow-md hover:shadow-teal-600/30 w-full md:w-auto">
                        <Calendar size={18} />
                        Book Appointment
                    </Link>
                </motion.div>

                {/* Available Doctors Horizontal List */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-3 text-xl font-extrabold text-slate-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                                <Stethoscope size={20} />
                            </div>
                            Top Specialists Available
                        </h2>
                        <Link to="/patient/book" className="group flex items-center gap-1.5 rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100">
                            Check all time slots <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    
                    <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
                        {filteredDoctors.length === 0 && !loading && (
                            <div className="w-full text-center py-6 text-slate-400 font-medium">No specialists found matching your search.</div>
                        )}
                        {filteredDoctors.map((doc, idx) => (
                            <div key={doc.id} onClick={() => navigate('/patient/book', { state: { specialization: doc.specialization } })} className="snap-start shrink-0 w-[280px] sm:w-[320px] cursor-pointer group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_40px_rgb(13,148,136,0.12)] hover:ring-teal-100">
                                <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-gradient-to-bl from-teal-50 to-transparent opacity-50 transition-opacity duration-300 group-hover:from-teal-100"></div>
                                
                                <div className="relative z-10 flex items-start gap-4 mb-5">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700 font-bold text-xl ring-2 ring-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        {doc.user.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-teal-700 transition-colors">Dr. {doc.user.fullName}</h3>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Star size={14} className="text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-bold text-slate-600">4.9</span>
                                            <span className="text-xs font-semibold text-slate-400 ml-1">({doc.experienceYears}+ yrs)</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="relative z-10 space-y-3">
                                    <span className="inline-flex w-full justify-center items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 uppercase tracking-wide">
                                        <Stethoscope size={12} />
                                        {doc.specialization}
                                    </span>
                                    <button onClick={(e) => { e.stopPropagation(); navigate('/patient/book', { state: { specialization: doc.specialization } }) }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-50 text-teal-700 font-bold border border-teal-100 transition-colors group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600">
                                        <Clock size={16} />
                                        Available Slots
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content Grid (Recent & Schedule) */}
                <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
                    
                    {/* Today's Schedule Timeline */}
                    <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl">
                        <h2 className="mb-10 flex items-center gap-3 text-xl font-extrabold text-slate-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Calendar size={20} />
                            </div>
                            Your Schedule
                        </h2>

                        <div className="relative ml-5 space-y-8 border-l-[3px] border-slate-100 pb-4 min-h-[200px]">
                            {upcoming.length === 0 ? (
                                <div className="absolute -left-5 top-0 w-full text-center py-6">
                                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                        <Calendar size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-[0.95rem] font-bold text-slate-400">No upcoming schedule.</p>
                                </div>
                            ) : (
                                upcoming.slice(0, 3).map((appt) => (
                                    <div key={appt.id} className="relative group">
                                        <div className="absolute -left-[1.2rem] top-1 flex h-[2.2rem] w-[2.2rem] items-center justify-center rounded-full bg-white ring-4 ring-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                                            <div className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        </div>
                                        <div className="pl-8 pt-0.5">
                                            <p className="mb-1.5 flex items-center gap-1.5 text-[0.85rem] font-bold text-slate-500 uppercase tracking-wide">
                                                {new Date(appt.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                            <p className="text-[1.05rem] font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                                                Dr. {appt.doctor.user.fullName}
                                            </p>
                                            <span className={`mt-3 inline-flex items-center justify-center rounded-lg px-3 py-1 text-[0.7rem] font-bold tracking-wider ${
                                                appt.status === 'CONFIRMED' ? 'bg-[#f0fdfa] text-[#0d9488]' : 'bg-[#fffbeb] text-[#d97706]'
                                            }`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Appointments */}
                    <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 backdrop-blur-xl flex flex-col">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="flex items-center gap-3 text-xl font-extrabold text-slate-800">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    <FileText size={20} />
                                </div>
                                Recent History
                            </h2>
                            <Link className="group flex items-center gap-1.5 rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100" to="/patient/history">
                                View All <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="flex-1 flex flex-col">
                            {past.length === 0 ? (
                                <div className="flex flex-1 flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 text-center text-slate-400">
                                    <FileText size={40} className="mb-4 text-slate-300" />
                                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">No History Found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {past.slice(0, 4).map((appt) => (
                                        <div key={appt.id} className="group flex flex-col justify-between rounded-2xl border border-transparent bg-slate-50/50 p-5 transition-all duration-300 hover:border-teal-100 hover:bg-white hover:shadow-lg hover:shadow-teal-500/5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 transition-colors group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:ring-teal-100">
                                                    <UserSquare2 size={24} />
                                                </div>
                                                <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest ${
                                                    appt.status === 'PENDING' ? 'bg-amber-100/50 text-amber-700 ring-1 ring-amber-500/20' : 
                                                    appt.status === 'CONFIRMED' ? 'bg-emerald-100/50 text-emerald-700 ring-1 ring-emerald-500/20' : 'bg-red-50 text-red-700 ring-1 ring-red-500/20'
                                                }`}>
                                                    {appt.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-[1.05rem] font-bold text-slate-800">Dr. {appt.doctor.user.fullName}</p>
                                                <p className="text-[0.8rem] mt-1 font-semibold text-slate-500">{appt.doctor.specialization}</p>
                                                <div className="w-full h-px bg-slate-100 my-3"></div>
                                                <p className="text-[0.85rem] font-bold text-slate-600 flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-teal-500" />
                                                    {new Date(appt.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            

        </div>
    );
};

export default PatientDashboard;
