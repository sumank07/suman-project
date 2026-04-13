import React, { useState, useEffect } from 'react';
import DoctorSidebar from './DoctorSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const DoctorLayout = ({ children, title, subtitle, actions }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 1024;
            setIsMobileView(isMobile);
            // Close sidebar when resizing to desktop
            if (!isMobile) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col lg:flex-row">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && isMobileView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Navigation */}
            <motion.div
                initial={false}
                animate={{ x: sidebarOpen ? 0 : isMobileView ? -320 : 0 }}
                transition={{ duration: 0.3 }}
                className={`fixed lg:static top-0 left-0 h-screen z-50 lg:z-30 ${isMobileView ? 'w-72' : ''}`}
            >
                <DoctorSidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:overflow-hidden">
                {/* Header */}
                <header className="h-16 sm:h-18 lg:h-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-20">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight truncate">{title}</h2>
                            {subtitle && <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 truncate hidden sm:block">{subtitle}</p>}
                        </div>
                    </div>
                    {actions && (
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
                            {actions}
                        </div>
                    )}
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 sm:p-4 md:p-6 lg:p-10"
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="px-4 sm:px-6 lg:px-10 py-4 sm:py-5 lg:py-6 border-t border-slate-100 flex justify-center items-center bg-white/50 backdrop-blur-sm text-slate-400">
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                        &copy; 2026 NepHeal • Clinical Workspace
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default DoctorLayout;
