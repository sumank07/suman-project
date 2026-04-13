import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Stethoscope, FileText, CheckCircle, AlertCircle, Clock, Heart, Activity, Brain, Bone, ChevronDown, User, Baby, Ear, Eye, ShieldAlert, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentForm = ({ onSuccess }) => {
    const location = useLocation();
    const [formData, setFormData] = useState({ 
        specialization: location.state?.specialization || 'Cardiology', 
        dateTime: '', 
        notes: '' 
    });
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const specializations = [
        { id: 'Cardiology', label: 'Cardiology', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
        { id: 'Neurology', label: 'Neurology', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { id: 'Orthopedics', label: 'Orthopedics', icon: Bone, color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 'Dermatology', label: 'Dermatology', icon: Activity, color: 'text-sky-500', bg: 'bg-sky-50' },
        { id: 'General', label: 'General Practice', icon: User, color: 'text-teal-500', bg: 'bg-teal-50' },
        { id: 'Pediatrics', label: 'Pediatrics', icon: Baby, color: 'text-pink-500', bg: 'bg-pink-50' },
        { id: 'ENT', label: 'ENT (Ear, Nose, Throat)', icon: Ear, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'Ophthalmology', label: 'Ophthalmology', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'Oncology', label: 'Oncology', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 'Psychology', label: 'Psychology', icon: Smile, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    const selectedSpec = specializations.find(s => s.id === formData.specialization) || specializations[0];

    const handleBook = async (e) => {
        e.preventDefault();
        setStatus('');
        try {
            await api.post('/appointments/book', {
                ...formData,
                dateTime: new Date(formData.dateTime).toISOString()
            });
            setMessage('Success! Your appointment is confirmed.');
            setStatus('success');
            if (onSuccess) onSuccess();
            setFormData({ specialization: 'Cardiology', dateTime: '', notes: '' });
        } catch (error) {
            setMessage('Booking failed. Please try a different slot.');
            setStatus('error');
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-teal-900/10 border border-white/50 p-8 sticky top-6 min-h-[600px]">
            {/* Added min-height to allow dropdown to not be cut off if at bottom */}
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-teal-100 p-2 rounded-lg text-teal-700">
                    <Calendar size={20} />
                </span>
                New Consultation
            </h3>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl mb-6 flex items-center gap-3 border-l-4 ${status === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-red-50 text-red-800 border-red-500'}`}
                >
                    {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="font-semibold text-sm">{message}</p>
                </motion.div>
            )}

            <form onSubmit={handleBook} className="space-y-8">
                {/* Specialization Selection - Scalable Dropdown */}
                <div className="space-y-3 relative z-50">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Select Department</label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:border-teal-300 transition-all focus:ring-2 focus:ring-teal-500/20 text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${selectedSpec.bg} ${selectedSpec.color}`}>
                                    <selectedSpec.icon size={20} />
                                </div>
                                <span className="font-bold text-gray-900">{selectedSpec.label}</span>
                            </div>
                            <ChevronDown className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-64 overflow-y-auto"
                                >
                                    {specializations.map((spec) => (
                                        <button
                                            key={spec.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, specialization: spec.id });
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <div className={`p-2 rounded-lg ${spec.bg} ${spec.color}`}>
                                                <spec.icon size={18} />
                                            </div>
                                            <span className="font-medium text-gray-700">{spec.label}</span>
                                            {formData.specialization === spec.id && <CheckCircle size={16} className="ml-auto text-teal-600" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-3 relative z-0">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Schedule</label>
                    <div className="relative">
                        <input
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-4 font-semibold shadow-sm transition-all focus:bg-white"
                            type="datetime-local"
                            value={formData.dateTime}
                            onChange={e => setFormData({ ...formData, dateTime: e.target.value })}
                            required
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 relative z-0">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Reason for Visit</label>
                    <div className="relative">
                        <textarea
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-4 font-medium shadow-sm transition-all focus:bg-white resize-none"
                            rows="3"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Eg. Persistent headache for 3 days..."
                        ></textarea>
                        <div className="absolute top-4 left-3 pointer-events-none">
                            <FileText size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 font-bold rounded-xl text-lg px-5 py-4 text-center shadow-lg shadow-teal-500/30 transition-all relative z-0"
                >
                    Confirm Appointment
                </motion.button>
            </form>
        </div>
    );
};

export default AppointmentForm;
