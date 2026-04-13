import React from 'react';
import { Clock, Calendar, Plus, Settings } from 'lucide-react';

const ManageSlots = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Slots</h2>
                    <p className="text-gray-500 font-medium">Configure appointment time slots and duration.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-500/30">
                    <Plus size={20} /> Add New Slot
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuration Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Settings size={20} className="text-indigo-600" />
                        Global Settings
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Default Appointment Duration</label>
                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option>15 Minutes</option>
                                <option>30 Minutes</option>
                                <option>45 Minutes</option>
                                <option>60 Minutes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Buffer Time Between Slots</label>
                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option>No Buffer</option>
                                <option>5 Minutes</option>
                                <option>10 Minutes</option>
                            </select>
                        </div>
                        <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-2">
                            Save Configurations
                        </button>
                    </div>
                </div>

                {/* Active Slots Preview (Mock) */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Calendar size={20} className="text-teal-600" />
                        Active Time Blocks
                    </h3>
                    <div className="space-y-3">
                        {['09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '01:00 PM - 02:00 PM'].map((slot, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Clock size={18} className="text-gray-400" />
                                    <span className="font-bold text-gray-700">{slot}</span>
                                </div>
                                <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded-lg">ACTIVE</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageSlots;
