import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Activity, UserPlus, Users, ClipboardList, Clock, Menu, X } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-teal-900 z-40 flex items-center justify-between px-4 shadow-md">
                <div className="flex items-center gap-2">
                    <Activity className="text-teal-400" size={24} />
                    <h2 className="text-xl font-bold tracking-tight text-white">NepHeal</h2>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white hover:bg-teal-800 rounded-lg transition"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-teal-900 text-white shadow-xl flex flex-col fixed inset-y-0 left-0 z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="p-6 flex items-center gap-3 border-b border-teal-800">
                    <div className="bg-teal-800 p-2 rounded-lg backdrop-blur-sm">
                        <Activity className="text-teal-400" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">NepHeal</h2>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden ml-auto text-teal-200 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4">
                    <ul className="space-y-2">
                        <li>
                            <Link to={user.role === 'PATIENT' ? '/patient/' : user.role === 'DOCTOR' ? '/doctor/' : '/admin/'}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-teal-100 hover:bg-teal-800 hover:text-white">
                                <Calendar size={20} />
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        {/* Patient Specific Links */}
                        {user.role === 'PATIENT' && (
                            <>
                                <li>
                                    <Link to="/patient/book" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-teal-100 hover:bg-teal-800 hover:text-white">
                                        <Calendar size={20} />
                                        <span>Book Appointment</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/patient/history" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-teal-100 hover:bg-teal-800 hover:text-white">
                                        <ClipboardList size={20} />
                                        <span>Medical History</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/patient/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-teal-100 hover:bg-teal-800 hover:text-white">
                                        <User size={20} />
                                        <span>My Profile</span>
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Doctor Specific Links */}
                        {user.role === 'DOCTOR' && (
                            <>
                                <li>
                                    <Link to="/doctor/assignments" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-teal-100 hover:bg-teal-800 hover:text-white">
                                        <ClipboardList size={20} />
                                        <span>Assignments</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/doctor/patients" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-teal-100 hover:bg-teal-800 hover:text-white">
                                        <Users size={20} />
                                        <span>My Patients</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/doctor/slots" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-teal-100 hover:bg-teal-800 hover:text-white">
                                        <Clock size={20} />
                                        <span>Manage Slots</span>
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Admin Specific Links */}
                        {user.role === 'ADMIN' && (
                            <>
                                <li>
                                    <Link to="/admin/doctors" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-teal-100 hover:bg-teal-800 hover:text-white">
                                        <UserPlus size={20} />
                                        <span>Doctors</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/patients" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-teal-100 hover:bg-teal-800 hover:text-white">
                                        <Users size={20} />
                                        <span>Patients</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                <div className="p-4 border-t border-teal-800 bg-teal-900/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="relative">
                            {localStorage.getItem('simulatedUserImage') ? (
                                <img
                                    src={localStorage.getItem('simulatedUserImage')}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
                                />
                            ) : (
                                <div className="bg-teal-800 p-2 rounded-full shadow-inner">
                                    <User size={20} className="text-teal-200" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                            <p className="text-xs text-teal-300 font-medium truncate">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-800/50 border border-teal-700 text-teal-100 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-200 transition-all font-medium text-sm cursor-pointer z-50"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
