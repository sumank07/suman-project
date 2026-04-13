import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, ExternalLink, Filter } from 'lucide-react';
import api from '../services/api';
import DoctorLayout from './DoctorLayout';

const Patient = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.get('/appointments/my');
                const allPatients = response.data.map(app => app.patient).filter(Boolean);
                const uniquePatients = Array.from(new Map(allPatients.map(p => [p.id, p])).values());
                setPatients(uniquePatients);
            } catch (error) {
                console.error("Patient registry failure", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filtered = patients.filter(p => 
        p.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DoctorLayout 
            title="Patient Registry" 
            subtitle="Centralized access to medical profiles and history under your care."
        >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {/* Registry Controls */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Find record by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all border border-slate-200">
                        <Filter size={16} /> Filter List
                    </button>
                </div>

                {/* Patient Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitals / Context</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm border border-teal-100">
                                                {patient.user?.fullName?.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-900 text-sm leading-none">{patient.user?.fullName}</span>
                                                <span className="text-[10px] font-medium text-slate-400 mt-1 block tracking-tight">{patient.user?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                                            {patient.gender || 'Not Recorded'} • {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'DOB Pending'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded-md text-slate-600 tracking-widest">
                                            PAT-{patient.id.toString().padStart(4, '0')}
                                        </code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            <div className="w-1 h-1 rounded-full bg-green-600"></div>
                                            Active Record
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <ExternalLink size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50/10">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Zero medical records identified</p>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

export default Patient;
