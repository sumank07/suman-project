import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Mail, User, ShieldCheck, Key, LogOut, Stethoscope, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from './DoctorLayout';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(null);

    const [profileData, setProfileData] = useState({
        fullName: 'Loading...',
        email: 'Loading...'
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                fullName: user.fullName || 'Doctor Practitioner',
                email: user.email || 'doctor@example.com'
            });
        }
    }, [user]);

    useEffect(() => {
        const savedImage = localStorage.getItem('simulatedUserImage');
        if (savedImage) setPreviewImage(savedImage);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                localStorage.setItem('simulatedUserImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <DoctorLayout 
            title="Clinical Identity" 
            subtitle="Manage your professional credentials and account security."
        >
            <div className="max-w-4xl">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    {/* Left: Identity Card */}
                    <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-200 flex flex-col items-center">
                        <div className="relative group mb-6">
                            <div className="w-40 h-40 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center relative">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600 text-5xl font-black">
                                        {profileData.fullName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 bg-white text-teal-600 p-2.5 rounded-xl cursor-pointer hover:bg-teal-50 shadow-lg border border-slate-200 transition-all hover:scale-105 active:scale-95">
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight text-center">{profileData.fullName}</h3>
                        <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-teal-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                            <Stethoscope size={12} />
                            Active Specialist
                        </div>
                    </div>

                    {/* Right: Security Details */}
                    <div className="flex-1 p-10">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Clinical Authorization</h4>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Legal Name</label>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <User size={18} className="text-slate-400" />
                                        <span className="text-sm font-bold text-gray-900">{profileData.fullName}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Medical Endpoint</label>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <Mail size={18} className="text-slate-400" />
                                        <span className="text-sm font-bold text-gray-900">{profileData.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-50">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Security Protocol</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:text-teal-600 transition-colors">
                                                <Key size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">Rotate Password</span>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={logout}
                                        className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-xl hover:bg-red-50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                                <LogOut size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-red-600">Terminate Session</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default Profile;
