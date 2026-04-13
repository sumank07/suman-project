import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, ArrowUpRight, Activity } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';

const Dashboard = () => {
    const { user } = useAuth();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, appRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/appointments')
                ]);
                setStats(statsRes.data);
                // Get the 5 most recent appointments by reverse sorting the ID or Date
                const sortedApps = appRes.data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
                setRecentActivity(sortedApps.slice(0, 5));
            } catch (err) {
                console.error("Dashboard stats failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-4 sm:p-5 lg:p-8 rounded-lg sm:rounded-xl lg:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 truncate">{title}</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{value}</h3>
            </div>
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl bg-slate-50 flex items-center justify-center ${color} group-hover:scale-110 transition-transform flex-shrink-0`}>
                <Icon size={isMobileView ? 20 : 28} />
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <AdminLayout 
                title="System Overview" 
                subtitle={`Loading dashboard for ${user?.fullName || 'Administrator'}`}
            >
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout 
            title="System Overview" 
            subtitle={`Management workspace for ${user?.fullName || 'Administrator'}`}
        >
            {/* Stats Grid - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
                <StatCard 
                    title="Total Doctors" 
                    value={stats.totalDoctors} 
                    icon={UserPlus} 
                    color="text-teal-600"
                />
                <StatCard 
                    title="Registered Patients" 
                    value={stats.totalPatients} 
                    icon={Users} 
                    color="text-blue-600"
                />
                <StatCard 
                    title="Total Appointments" 
                    value={stats.totalAppointments} 
                    icon={Calendar} 
                    color="text-purple-600" 
                />
            </div>

            {/* Recent Activity Card */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent System Activity</h2>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Latest Clinical Sessions</p>
                    </div>
                    <Activity className="text-teal-600" size={20} />
                </div>
                
                <div className="divide-y divide-slate-100">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((app) => (
                            <div key={app.id} className="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                        app.status === 'PENDING' ? 'bg-blue-50 text-blue-600' :
                                        app.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                        'bg-red-50 text-red-600'
                                    }`}>
                                        {app.patient?.user?.fullName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{app.patient?.user?.fullName || 'Unknown Patient'}</p>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">Assigned to Dr. {app.doctor?.user?.fullName || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                    <span className="text-xs font-bold text-slate-600">
                                        {new Date(app.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                        app.status === 'PENDING' ? 'bg-blue-50 text-blue-600' :
                                        app.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                                        'bg-red-50 text-red-600'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-400 font-bold text-sm">No recent activity found.</div>
                    )}
                </div>
            </motion.div>
        </AdminLayout>
    );
};

export default Dashboard;
