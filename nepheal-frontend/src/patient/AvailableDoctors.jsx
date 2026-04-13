import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Award, Stethoscope, Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const AvailableDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get('/doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return (
        <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="text-teal-200" size={24} />
                    Available Specialists ({doctors.length})
                </h3>
                {/* Fake Search Bar for aesthetics */}
                <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 text-white/80">
                    <Search size={16} className="mr-2" />
                    <span className="text-sm">Search doctors...</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map(doc => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        key={doc.id}
                        className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/50 hover:shadow-xl hover:bg-white transition-all group relative overflow-hidden"
                    >
                        {/* Decorative background accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50"></div>

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center text-teal-700 font-bold border border-white shadow-sm group-hover:scale-110 transition-transform">
                                    {doc.user.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">Dr. {doc.user.fullName}</h4>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 mt-1 uppercase tracking-wide">
                                        <Stethoscope size={10} />
                                        {doc.specialization}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <Award size={16} className="text-amber-400" />
                                    <span className="font-semibold text-gray-700">{doc.experienceYears}+ Years</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                    <MapPin size={12} />
                                    <span>Kathmandu</span>
                                </div>
                            </div>

                            <button className="px-4 py-2 bg-gray-50 hover:bg-teal-600 hover:text-white text-gray-600 text-xs font-bold rounded-lg transition-colors border border-gray-200 hover:border-teal-600">
                                View Profile
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {doctors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/50 backdrop-blur-md rounded-3xl border border-white/50 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-pulse shadow-lg">
                        <User size={40} className="text-teal-400 opacity-50" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Finding Specialists...</h4>
                    <p className="text-gray-600 max-w-sm mx-auto mb-6">
                        We are currently updating our doctor schedules. Please check back in a few moments or try selecting a different specialization.
                    </p>
                    <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Refresh List
                    </button>
                </div>
            )}
        </div>
    );
};

export default AvailableDoctors;
