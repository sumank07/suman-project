import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Clock, User, Calendar, MoreHorizontal, ExternalLink, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const MyAssignment = ({ isPreview = false }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await api.get('/appointments/my');
                setAssignments(response.data);
            } catch (error) {
                console.error("Fetch failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const filtered = assignments.filter(app => {
        const matchesSearch = app.patient?.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'ALL' || app.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    // If it's a preview (for dashboard), we might show fewer columns or limited rows
    const displayData = isPreview ? filtered.slice(0, 5) : filtered;

    const getStatusStyles = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'COMPLETED':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-amber-500';
            case 'COMPLETED':
                return 'bg-green-500';
            default:
                return 'bg-slate-400';
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 opacity-50">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Loading appointments...</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {!isPreview && (
                <>
                    <div className="p-3 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white space-y-3 sm:space-y-4">
                        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center justify-between">
                            <div className="relative flex-1 w-full max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder={isMobileView ? "Search..." : "Search patient name..."}
                                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap w-full lg:w-auto">
                                {['ALL', 'PENDING', 'COMPLETED'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setSelectedStatus(status)}
                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                                            selectedStatus === status
                                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300'
                                        }`}
                                    >
                                        {isMobileView && status !== 'ALL' ? status.charAt(0) : status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isPreview ? (
                // Card View for Preview - Mobile First
                <div className="p-2 sm:p-4 flex-1 overflow-y-auto space-y-2 sm:space-y-3">
                    {displayData.length > 0 ? (
                        displayData.map((app, idx) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-gradient-to-r from-slate-50 to-white p-3 sm:p-4 rounded-lg border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between gap-3 sm:gap-4">
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-md flex-shrink-0">
                                            {app.patient?.user?.fullName?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{app.patient?.user?.fullName}</p>
                                            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 mt-1 truncate">
                                                <Calendar size={isMobileView ? 10 : 12} />
                                                {new Date(app.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                <Clock size={isMobileView ? 10 : 12} className="ml-1" />
                                                {new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border flex-shrink-0 whitespace-nowrap ${getStatusStyles(app.status)}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeColor(app.status)}`} />
                                        <span className="hidden sm:inline">{app.status}</span>
                                        <span className="sm:hidden">{app.status.charAt(0)}</span>
                                    </span>
                                </div>
                                {app.notes && (
                                    <p className="text-[10px] sm:text-xs text-slate-600 mt-2 sm:mt-3 line-clamp-2">{app.notes}</p>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12">
                            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">No appointments found</p>
                        </div>
                    )}
                </div>
            ) : (
                // Responsive Table View for Full Page
                <div className="overflow-x-auto flex-1">
                    {isMobileView ? (
                        // Mobile Card View
                        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            {displayData.length > 0 ? (
                                displayData.map((app, idx) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 hover:border-teal-300 transition-all"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                                                {app.patient?.user?.fullName?.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm truncate">{app.patient?.user?.fullName}</p>
                                                <p className="text-xs text-slate-500">ID: {app.patient?.id}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 border-t border-slate-100 pt-2 mt-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-900">
                                                <Calendar size={14} className="text-teal-600" />
                                                <span className="font-semibold">{new Date(app.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <Clock size={14} className="text-teal-600 ml-2" />
                                                <span className="font-semibold">{new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            
                                            {app.notes && (
                                                <p className="text-xs text-slate-600 line-clamp-2">{app.notes}</p>
                                            )}
                                            
                                            <div className="flex items-center justify-between pt-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(app.status)}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeColor(app.status)}`} />
                                                    {app.status}
                                                </span>
                                                <button className="p-1 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                                                    <ExternalLink size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center py-12">
                                    <p className="text-sm font-semibold text-slate-400">No appointments found</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Desktop Table View
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white sticky top-0">
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Patient</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:table-cell">Appointment</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Notes</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {displayData.map((app, idx) => (
                                    <motion.tr 
                                        key={app.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-md flex-shrink-0">
                                                    {app.patient?.user?.fullName?.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="block font-semibold text-gray-900 text-xs sm:text-sm truncate">{app.patient?.user?.fullName}</span>
                                                    <span className="text-[10px] sm:text-xs text-slate-500 truncate">ID: {app.patient?.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-900">
                                                    <Calendar size={12} className="text-teal-600 flex-shrink-0" />
                                                    <span className="truncate">{new Date(app.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500">
                                                    <Clock size={10} className="flex-shrink-0" />
                                                    {new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                                            <p className="text-xs sm:text-sm text-slate-600 max-w-xs truncate" title={app.notes}>
                                                {app.notes || '—'}
                                            </p>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(app.status)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeColor(app.status)}`} />
                                                <span className="hidden sm:inline">{app.status}</span>
                                                <span className="sm:hidden">{app.status.charAt(0)}</span>
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                                            <button className="p-1.5 sm:p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                <ExternalLink size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {displayData.length === 0 && !isPreview && (
                <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-20 bg-slate-50/30">
                    <p className="text-xs sm:text-sm font-semibold text-slate-400">No appointments matching your search</p>
                    <button 
                        onClick={() => { setSearchTerm(''); setSelectedStatus('ALL'); }}
                        className="mt-4 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyAssignment;
