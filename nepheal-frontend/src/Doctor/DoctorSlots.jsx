import React, { useState } from 'react';
import { Plus, X, Clock, Calendar } from 'lucide-react';
import DoctorLayout from './DoctorLayout';

const DoctorSlots = () => {
    const [slots, setSlots] = useState([
        { id: 1, day: 'Monday', startTime: '09:00', endTime: '12:00' },
        { id: 2, day: 'Wednesday', startTime: '14:00', endTime: '17:00' },
    ]);
    const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '', endTime: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        const id = slots.length + 1;
        setSlots([...slots, { ...newSlot, id }]);
        setNewSlot({ day: 'Monday', startTime: '', endTime: '' });
    };

    const handleRemove = (id) => {
        setSlots(slots.filter(s => s.id !== id));
    };

    return (
        <DoctorLayout 
            title="Availability Window" 
            subtitle="Configure your clinical hours for the round-robin synchronization system."
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Active Slots list */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <Clock size={16} className="text-teal-600" />
                            Current Operational Slots
                        </h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-2.5 py-1 rounded-md">
                            {slots.length} Active
                        </span>
                    </div>
                    <div className="p-6 space-y-3">
                        {slots.map(slot => (
                            <div key={slot.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:border-teal-200 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2.5 rounded-lg shadow-sm text-teal-600">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-900 text-sm">{slot.day}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{slot.startTime} — {slot.endTime}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleRemove(slot.id)} 
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        {slots.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No slots defined</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add New Slot form */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <Plus size={16} className="text-teal-600" />
                            Provision New Window
                        </h4>
                    </div>
                    <form onSubmit={handleAdd} className="p-8 space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Effective Day</label>
                            <select 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20 appearance-none cursor-pointer" 
                                value={newSlot.day} 
                                onChange={e => setNewSlot({ ...newSlot, day: e.target.value })}
                            >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Start Time</label>
                                <input 
                                    type="time" 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" 
                                    value={newSlot.startTime} 
                                    onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">End Time</label>
                                <input 
                                    type="time" 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20" 
                                    value={newSlot.endTime} 
                                    onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })} 
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            className="w-full py-4 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2" 
                            type="submit"
                        >
                            <Plus size={16} /> Authorize Window
                        </button>
                    </form>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorSlots;
