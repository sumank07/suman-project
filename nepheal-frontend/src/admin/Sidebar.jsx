import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Calendar, ShieldCheck, Activity, LogOut, ChevronRight, Zap, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
    const { logout, user } = useAuth();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavClick = () => {
        if (onClose && isMobileView) onClose();
    };

    const navItems = [
        { name: 'Console', path: '/admin', icon: LayoutDashboard },
        { name: 'Specialists', path: '/admin/doctors', icon: UserPlus },
        { name: 'Patients', path: '/admin/patients', icon: Users },
        { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
        { name: 'Security', path: '/admin/profile', icon: ShieldCheck },
    ];

    return (
        <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 h-screen flex flex-col z-40 text-slate-300 overflow-y-auto border-r border-slate-700">
            {/* High-End Branding */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 lg:p-8 pb-8 lg:pb-10 border-b border-slate-700/50"
            >
                <div className="flex items-center gap-3 lg:gap-4">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-500/20 ring-4 ring-teal-500/10 flex-shrink-0"
                    >
                        <Activity size={24} strokeWidth={2.5} />
                    </motion.div>
                    <div className="min-w-0">
                        <h1 className="text-xl font-black text-white tracking-tight">NepHeal</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                            <p className="text-[10px] font-black text-teal-400/80 uppercase tracking-widest leading-none">Enterprise</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Premium Navigation */}
            <nav className="flex-1 px-3 lg:px-4 space-y-1 mt-2 overflow-y-auto">
                {navItems.map((item, idx) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <NavLink
                            to={item.path}
                            end={item.path === '/admin'}
                            onClick={handleNavClick}
                            className={({ isActive }) => `
                                flex items-center justify-between px-4 lg:px-5 py-3 lg:py-4 rounded-lg lg:rounded-2xl transition-all duration-300 group relative overflow-hidden
                                ${isActive 
                                    ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                                    : 'hover:bg-white/5 hover:text-slate-100'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center gap-3 lg:gap-4 relative z-10 font-bold tracking-tight min-w-0">
                                        <item.icon size={20} className={`${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-300 flex-shrink-0`} />
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                    <ChevronRight size={14} className={`relative z-10 transition-all duration-300 flex-shrink-0 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 -translate-x-2 scale-50 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 text-slate-600'}`} />
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-400 rounded-r-full shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>}
                                </>
                            )}
                        </NavLink>
                    </motion.div>
                ))}
            </nav>

            {/* Profile Section */}
            <div className="p-5 lg:p-6 border-t border-slate-700/50 bg-gradient-to-t from-slate-900 to-transparent">
                <motion.div 
                    whileHover={{ y: -2 }}
                    className="p-4 bg-white/5 rounded-lg lg:rounded-2xl border border-white/5 backdrop-blur-md mb-4 group hover:bg-white/10 transition-all"
                >
                    <div className="flex items-center gap-3 lg:gap-4 mb-4">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="w-11 h-11 rounded-lg lg:rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-teal-400 font-black text-sm shadow-inner ring-1 ring-white/10 flex-shrink-0"
                        >
                            {user?.fullName?.charAt(0) || 'A'}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate tracking-tight">{user?.fullName || 'Administrator'}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5 truncate">Root Access</p>
                        </div>
                    </div>
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border border-red-500/10"
                    >
                        <LogOut size={14} />
                        Exit Console
                    </motion.button>
                </motion.div>
                <div className="flex items-center justify-center gap-2 px-2">
                    <Zap size={10} className="text-amber-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Infrastructure Online</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
