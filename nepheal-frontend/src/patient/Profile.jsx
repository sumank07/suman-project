import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Camera, Settings, Activity, Heart, Bell, Moon, LogOut, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [profileData, setProfileData] = useState({
        fullName: 'Loading...',
        email: 'Loading...'
    });

    useEffect(() => {
        // Load Dark Mode Preference
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }

        const localEmail = localStorage.getItem('email');
        const localName = localStorage.getItem('fullName');

        if (user) {
            setProfileData({
                fullName: user.fullName || localName || 'Patient Name',
                email: user.email || localEmail || 'patient@example.com'
            });
        } else if (localEmail) {
            setProfileData({
                fullName: localName || 'Patient Name',
                email: localEmail || 'patient@example.com'
            });
        }
    }, [user]);

    useEffect(() => {
        const savedImage = localStorage.getItem('simulatedUserImage');
        if (savedImage) setPreviewImage(savedImage);
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="relative mx-auto max-w-5xl pb-20 font-sans px-4 sm:px-0">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 w-full max-w-4xl h-[400px] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-lighten blur-3xl transition-opacity">
                <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br from-indigo-200 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full"></div>
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-bl from-teal-100 to-emerald-100 dark:from-teal-900 dark:to-emerald-900 rounded-full"></div>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pt-8 text-slate-800 dark:text-slate-100 transition-colors">
                
                {/* Clean Navigation */}
                <motion.div variants={itemVariants} className="flex flex-col gap-6">
                    <Link to="/patient" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 font-bold transition-colors w-max group bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>
                </motion.div>

                {/* Banner & Profile Header */}
                <motion.div variants={itemVariants} className="relative rounded-[2rem] bg-white/80 dark:bg-slate-800/80 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-700 backdrop-blur-xl overflow-hidden transition-colors">
                    {/* Banner Background */}
                    <div className="h-48 w-full rounded-[1.75rem] bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="px-8 pb-10 pt-0 relative flex flex-col md:flex-row items-center md:items-end gap-6">
                        {/* Avatar Picker */}
                        <div className="relative -mt-20 group z-10">
                            <div className="h-40 w-40 rounded-full border-[6px] border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transition-colors">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700 text-5xl font-bold">
                                        {profileData.fullName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 border-2 border-white dark:border-slate-800 dark:bg-slate-700 text-white shadow-lg transition-transform hover:scale-105 hover:bg-teal-700 dark:hover:bg-teal-600">
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1 text-center md:text-left mb-2">
                            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white transition-colors">{profileData.fullName}</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-1 flex items-center justify-center md:justify-start gap-2 transition-colors">
                                <Mail size={16} />
                                {profileData.email}
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-3 mb-2">
                            <button className="flex items-center gap-2 rounded-full bg-slate-50 dark:bg-slate-700 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600 transition-colors hover:bg-slate-100 dark:hover:bg-slate-600">
                                <Settings size={16} /> Edit Profile
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                    {/* Left Column: Stats & Security */}
                    <div className="space-y-8">
                        {/* Security Card */}
                        <motion.div variants={itemVariants} className="rounded-[2rem] bg-white/80 dark:bg-slate-800/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-700 backdrop-blur-xl transition-colors">
                            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors">
                                <Shield className="text-teal-600 dark:text-teal-400" size={20} />
                                Account Security
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 transition-colors">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Role Status</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Verified Patient Account</p>
                                    </div>
                                    <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">Active</div>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Two-Factor Auth</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Not enabled</p>
                                    </div>
                                    <button className="text-teal-600 dark:text-teal-400 font-bold text-sm hover:text-teal-700 dark:hover:text-teal-300 transition-colors">Enable</button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Danger Zone */}
                        <motion.div variants={itemVariants} className="rounded-[2rem] bg-red-50/50 dark:bg-red-500/5 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-red-100 dark:ring-red-500/20 backdrop-blur-xl transition-colors">
                            <h3 className="text-lg font-extrabold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
                                <LogOut size={20} />
                                Session
                            </h3>
                            <p className="text-sm font-medium text-red-600/80 dark:text-red-400/80 mb-6 max-w-xs transition-colors">
                                securely log out of your account on this device to protect your health data.
                            </p>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 font-bold py-3.5 rounded-xl border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-sm transition-all"
                            >
                                <LogOut size={18} />
                                Log Out Now
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Information & Preferences */}
                    <div className="space-y-8">
                        <motion.div variants={itemVariants} className="rounded-[2rem] bg-white/80 dark:bg-slate-800/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] default-dark-shadow ring-1 ring-slate-100 dark:ring-slate-700 backdrop-blur-xl transition-colors">
                            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <User className="text-blue-600 dark:text-blue-400" size={20} />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 transition-colors">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Full Name</p>
                                    <p className="text-base font-bold text-slate-800 dark:text-slate-200">{profileData.fullName}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 transition-colors">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Email Address</p>
                                    <p className="text-base font-bold text-slate-800 dark:text-slate-200">{profileData.email}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 opacity-60 transition-colors">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between">Phone Number <span className="bg-slate-200 dark:bg-slate-600 text-[10px] px-2 rounded-full text-slate-500 dark:text-slate-300">Add</span></p>
                                    <p className="text-base font-bold text-slate-800 dark:text-slate-200">Not provided</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 opacity-60 transition-colors">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between">Date of Birth <span className="bg-slate-200 dark:bg-slate-600 text-[10px] px-2 rounded-full text-slate-500 dark:text-slate-300">Add</span></p>
                                    <p className="text-base font-bold text-slate-800 dark:text-slate-200">Not provided</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="rounded-[2rem] bg-white/80 dark:bg-slate-800/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 dark:ring-slate-700 backdrop-blur-xl transition-colors">
                            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <Settings className="text-slate-600 dark:text-slate-400" size={20} />
                                App Preferences
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600 cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 flex items-center justify-center transition-colors">
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Notifications</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manage appointment alerts</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-teal-500 rounded-full relative shadow-inner cursor-pointer before:absolute before:h-5 before:w-5 before:bg-white before:rounded-full before:left-0.5 before:top-0.5 before:shadow-sm before:translate-x-6 before:transition-transform"></div>
                                </div>
                                <div onClick={toggleDarkMode} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600 cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center transition-colors">
                                            <Moon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Dark Mode</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Toggle dark interface</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative shadow-inner cursor-pointer transition-colors ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                        <div className={`absolute h-5 w-5 bg-white rounded-full top-0.5 shadow-sm transition-transform ${isDarkMode ? 'left-0.5 translate-x-6' : 'left-0.5'}`}></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Profile;
