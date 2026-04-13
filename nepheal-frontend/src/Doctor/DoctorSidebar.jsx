import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    Clock, 
    ShieldCheck, 
    Stethoscope, 
    LogOut, 
    ChevronRight,
    ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const DoctorSidebar = ({ onClose }) => {
    const { logout, user } = useAuth();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { name: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
        { name: 'Assignments', path: '/doctor/assignments', icon: ClipboardList },
        { name: 'Patients', path: '/doctor/patients', icon: Users },
        { name: 'Availability', path: '/doctor/slots', icon: Clock },
        { name: 'Profile', path: '/doctor/profile', icon: ShieldCheck },
    ];

    const handleNavClick = () => {
        if (onClose && isMobileView) onClose();
    };

    return (
        <aside className="w-72 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 h-screen flex flex-col z-30 overflow-y-auto">
            {/* Branding */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-6 lg:p-8 border-b border-slate-100"
            >
                <div className="flex items-center gap-3">
                    <motion.div 
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/30 flex-shrink-0"
                    >
                        <Stethoscope size={22} />
                    </motion.div>
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate">NepHeal</h1>
                        <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-widest leading-none">Clinic</p>
                    </div>
                </div>
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 p-2 sm:p-3 lg:p-4 space-y-1 mt-2 overflow-y-auto">
                {navItems.map((item, idx) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <NavLink
                            to={item.path}
                            end={item.path === '/doctor'}
                            onClick={handleNavClick}
                            className={({ isActive }) => `
                                flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 group relative
                                ${isActive 
                                    ? 'bg-gradient-to-r from-teal-500/10 to-teal-600/10 text-teal-700 shadow-sm border border-teal-200/50' 
                                    : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0">
                                    <item.icon size={20} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
                                </motion.div>
                                <span className="text-xs sm:text-sm font-semibold truncate">{item.name}</span>
                            </div>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </NavLink>
                    </motion.div>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-2 sm:p-3 lg:p-4 border-t border-slate-100 bg-gradient-to-t from-slate-50 to-transparent space-y-3">
                {/* Profile Peek */}
                <motion.div 
                    whileHover={{ y: -2 }}
                    className="p-2 sm:p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2 sm:gap-3 shadow-sm"
                >
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0 overflow-hidden"
                    >
                        {localStorage.getItem('simulatedUserImage') ? (
                            <img src={localStorage.getItem('simulatedUserImage')} alt="P" className="w-full h-full object-cover" />
                        ) : (
                            user?.fullName?.charAt(0) || 'D'
                        )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{user?.fullName || 'Dr. Practitioner'}</p>
                        <p className="text-[10px] font-medium text-slate-500 truncate">Clinical Staff</p>
                    </div>
                </motion.div>

                <motion.button 
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all font-semibold text-xs sm:text-sm border border-transparent hover:border-red-200"
                >
                    <LogOut size={18} />
                    <span className="truncate">Sign Out</span>
                </motion.button>
            </div>
        </aside>
    );
};

export default DoctorSidebar;
