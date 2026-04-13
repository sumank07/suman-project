import React from 'react';
import { Link } from 'react-router-dom';
import AppointmentForm from './AppointmentForm';
import AvailableDoctors from './AvailableDoctors';

const BookAppointment = () => {
    return (
        <div className="relative min-h-[calc(100vh-2rem)] rounded-3xl overflow-hidden bg-gray-50">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 rounded-b-[3rem] shadow-xl z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-900/10 rounded-full blur-2xl mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 p-6 lg:p-10 space-y-8">
                <header className="text-white mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold mb-2 tracking-tight">Book Appointment</h2>
                        <p className="text-teal-50 font-medium text-lg opacity-90">Choose a specialist and schedule your consultation in seconds.</p>
                    </div>
                    <Link to="/patient" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-xl font-bold transition-colors w-max">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        Back to Dashboard
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Section - Wider on desktop */}
                    <div className="lg:col-span-5">
                        <AppointmentForm />
                    </div>
                    {/* List Section */}
                    <div className="lg:col-span-7">
                        <AvailableDoctors />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
