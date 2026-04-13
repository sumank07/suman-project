import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, ClipboardList, ArrowUpRight, Activity, CheckCircle, AlertCircle, TrendingUp, Stethoscope, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import DoctorLayout from './DoctorLayout';
import MyAssignment from './MyAssignment';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const [stats, setStats] = useState({
        todayAppointments: 0,
        totalPatients: 0,
        pendingReports: 0,
        completedToday: 0,
        avgConsultTime: '28 min',
        satisfactionRate: 4.8
    });
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/appointments/my');
                const apps = response.data;
                const todayApps = apps.filter(a => {
                    const d = new Date(a.dateTime);
                    const today = new Date();
                    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
                });
                const uniquePats = Array.from(new Set(apps.map(a => a.patient?.id).filter(Boolean)));
                
                setStats(prev => ({
                    ...prev,
                    todayAppointments: todayApps.length,
                    totalPatients: uniquePats.length,
                    pendingReports: apps.filter(a => a.status === 'PENDING').length,
                    completedToday: todayApps.filter(a => a.status === 'COMPLETED').length
                }));
                
                const upcoming = apps
                    .filter(a => new Date(a.dateTime) > new Date() && a.status !== 'CANCELLED')
                    .sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime))
                    .slice(0, 5)
                    .map(a => ({
                        id: a.id,
                        patient: a.patient?.user?.fullName || 'Unknown',
                        time: new Date(a.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: a.status.toLowerCase()
                    }));
                setUpcomingAppointments(upcoming);
            } catch (err) {
                console.error("Dashboard data fetch failed", err);
            }
        };
        fetchDashboardData();
    }, []);

    // Quick actions
    const quickActions = [
        { label: 'View All Patients', icon: Users, color: 'from-blue-500 to-blue-600' },
        { label: 'Manage Schedule', icon: Clock, color: 'from-amber-500 to-amber-600' },
        { label: 'View Reports', icon: ClipboardList, color: 'from-purple-500 to-purple-600' },
    ];

    const StatCard = ({ title, value, icon: Icon, color, bgColor, subtitle, trend }) => (
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 truncate">{title}</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</h3>
                        {trend && <span className="text-xs font-semibold text-green-600 flex items-center gap-1 whitespace-nowrap">
                            <TrendingUp size={12} />
                            <span className="hidden sm:inline">{trend}</span>
                            <span className="sm:hidden">+1</span>
                        </span>}
                    </div>
                    {subtitle && <p className="text-xs text-slate-400 mt-2 truncate">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg ${bgColor} group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <Icon size={isMobileView ? 20 : 24} />
                </div>
            </div>
        </motion.div>
    );

    const TimelineItem = ({ time, title, icon: Icon, status }) => (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 sm:gap-4 pb-4 relative"
        >
            <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm ${
                    status === 'confirmed' ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'
                }`}>
                    <Icon size={isMobileView ? 16 : 18} />
                </div>
                <div className="w-1 h-6 sm:h-8 bg-slate-200 mt-2" />
            </div>
            <div className="flex-1 pt-1 min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{time}</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 truncate">{title}</p>
                <span className={`text-xs font-semibold inline-block mt-2 px-2 py-1 rounded-full ${
                    status === 'confirmed' ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'
                }`}>
                    {status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </span>
            </div>
        </motion.div>
    );

    return (
        <DoctorLayout 
            title={`Welcome back, Dr. ${user?.fullName?.split(' ')[0] || 'Practitioner'}`}
            subtitle="Here's your clinical overview for today."
        >
            {/* Primary Stats Row - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
                <StatCard 
                    title="Today's Appointments" 
                    value={stats.todayAppointments} 
                    icon={Calendar}
                    color="from-teal-500 to-teal-600"
                    subtitle="Active consultations"
                    trend="+1 vs yesterday"
                />
                <StatCard 
                    title="Total Patients" 
                    value={stats.totalPatients} 
                    icon={Users}
                    color="from-blue-500 to-blue-600"
                    subtitle="Under your care"
                    trend="+3 this month"
                />
                <StatCard 
                    title="Completed Today" 
                    value={stats.completedToday} 
                    icon={CheckCircle}
                    color="from-green-500 to-green-600"
                    subtitle={isMobileView ? `${stats.avgConsultTime} avg` : `${stats.avgConsultTime} avg per consult`}
                    trend="+2 pending"
                />
            </div>

            {/* Secondary Row - Performance Metrics - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
                <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-purple-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4 gap-4">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">Patient Satisfaction</h4>
                        <Stethoscope className="text-purple-600 flex-shrink-0" size={isMobileView ? 18 : 20} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.satisfactionRate}</p>
                        <p className="text-base sm:text-lg text-purple-600">/5.0</p>
                    </div>
                    <div className="flex gap-1 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-2 flex-1 rounded-full ${i < 4 ? 'bg-purple-600' : 'bg-purple-300'}`} />
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-amber-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4 gap-4">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">Pending Reports</h4>
                        <AlertCircle className="text-amber-600 flex-shrink-0" size={isMobileView ? 18 : 20} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.pendingReports}</p>
                        <p className="text-xs sm:text-sm text-amber-600">to review</p>
                    </div>
                    <button className="mt-4 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                        View Reports →
                    </button>
                </motion.div>
            </div>

            {/* Main Content Grid - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Appointments Table - Full Width on Mobile */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[300px] sm:min-h-[400px] lg:min-h-[450px]">
                        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                                <ClipboardList size={isMobileView ? 18 : 20} className="text-teal-600 flex-shrink-0" />
                                <span className="truncate">Recent Assignments</span>
                            </h3>
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 flex-shrink-0"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                <span className="hidden sm:inline">Live</span>
                            </motion.div>
                        </div>
                        <div className="p-2 sm:p-4 flex-1 overflow-auto">
                            <MyAssignment isPreview={true} />
                        </div>
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-slate-50">
                            <button className="text-teal-600 font-semibold text-xs sm:text-sm hover:text-teal-700 transition-colors flex items-center gap-1">
                                View All <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Timeline and Quick Actions - Stack on Mobile */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Timeline */}
                    <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
                            <Calendar size={isMobileView ? 16 : 18} className="text-teal-600 flex-shrink-0" />
                            <span className="truncate">Today's Schedule</span>
                        </h4>
                        <div className="space-y-2 sm:space-y-3">
                            {upcomingAppointments.map((apt, idx) => (
                                <TimelineItem 
                                    key={apt.id}
                                    time={apt.time}
                                    title={apt.patient}
                                    icon={Calendar}
                                    status={apt.status}
                                />
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 sm:py-2.5 text-teal-600 font-semibold text-xs sm:text-sm border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors">
                            View Full Schedule
                        </button>
                    </div>

                    {/* Status Card */}
                    <motion.div 
                        animate={{ boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 8px rgba(16, 185, 129, 0)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-gradient-to-br from-green-50 to-teal-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-200 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-green-200 opacity-20 rounded-full -mr-8 -mt-8" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse flex-shrink-0" />
                                <span className="text-xs font-bold text-green-600 uppercase tracking-widest truncate">Active Status</span>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Ready to Consult</h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {isMobileView ? 'You are online and available.' : 'You are online and available for patient consultations.'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Quick Actions</h4>
                        {quickActions.map((action, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ x: 4 }}
                                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg bg-gradient-to-r ${action.color} text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                            >
                                <action.icon size={isMobileView ? 16 : 18} />
                                <span className="truncate">{action.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorDashboard;
