import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, User, Mail, Lock, Phone, Calendar as CalendarIcon, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'PATIENT',
        dob: '',
        gender: '',
        contactNumber: '',
        specialization: '',
        experienceYears: 0
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Email might be in use.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            <div className="hidden lg:flex w-1/3 bg-slate-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="relative z-10 text-center px-8">
                    <Activity size={48} className="text-teal-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">Join NepHeal</h2>
                    <p className="text-slate-400">Begin your journey to better healthcare management.</p>
                </div>
            </div>

            <div className="w-full lg:w-2/3 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-2xl"
                >
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-gray-500 mt-2">
                            Already a member? <Link to="/auth/login" className="text-teal-600 font-semibold hover:underline">Log in</Link>
                        </p>
                    </div>

                    {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Common Fields */}
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                            <div className="flex p-1 bg-gray-100 rounded-xl">
                                {['PATIENT', 'DOCTOR'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role })}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${formData.role === role
                                            ? 'bg-white text-teal-700 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {role.charAt(0) + role.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-full md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-span-full md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {formData.role === 'PATIENT' ? (
                            <>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <CalendarIcon size={18} />
                                        </div>
                                        <input
                                            type="date"
                                            className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={formData.dob}
                                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            placeholder="+977 98..."
                                            value={formData.contactNumber}
                                            onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Briefcase size={18} />
                                        </div>
                                        <select
                                            className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white appearance-none"
                                            value={formData.specialization}
                                            onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Specialization</option>
                                            <option value="General Practice">General Practice</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Dermatology">Dermatology</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Psychiatry">Psychiatry</option>
                                            <option value="Surgery">Surgery</option>
                                            <option value="Gynecology">Gynecology</option>
                                            <option value="Dental">Dental</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                        placeholder="O"
                                        value={formData.experienceYears}
                                        onChange={e => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="col-span-full mt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-teal-700/20"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
