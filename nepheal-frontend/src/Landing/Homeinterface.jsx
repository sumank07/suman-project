import React, { useState } from "react";
import { Stethoscope, Calendar, Shield, Menu, X } from "lucide-react";
import landingImg from "../assets/landingImg.png";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomeInterface = () => {
    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div
                className="h-[90vh] w-full bg-cover bg-center bg-no-repeat flex flex-col"
                style={{ backgroundImage: `url(${landingImg})` }}
            >
                <header className="w-full bg-white/60 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 shadow-sm z-50">
                    <h1 className="text-2xl md:text-3xl font-bold text-teal-700">
                        NepHeal
                    </h1>

                    <nav className="hidden md:flex items-center space-x-4">
                        <Link to="/auth/login">
                            <button className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-black transition transform hover:scale-105 cursor-pointer">
                                Login
                            </button>
                        </Link>

                        <Link to="/auth/register">
                            <button className="px-6 py-3 border-2 border-gray-700 text-gray-800 font-medium rounded-lg hover:bg-gray-800 hover:text-white transition cursor-pointer">
                                Register
                            </button>
                        </Link>
                    </nav>
                    <button
                        className="md:hidden z-50"
                        onClick={() => setMobileMenu(!mobileMenu)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenu ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </header>

                {mobileMenu && (
                    <Motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 bg-white/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
                    >
                        <Link
                            to="/auth/login"
                            className="w-64 py-4 bg-gray-800 text-white text-xl font-semibold rounded-xl text-center hover:bg-black transition"
                            onClick={() => setMobileMenu(false)}
                        >
                            Login
                        </Link>

                        <Link
                            to="/auth/register"
                            className="w-64 py-4 border-2 border-gray-800 text-gray-800 text-xl font-semibold rounded-xl text-center hover:bg-gray-800 hover:text-white transition"
                            onClick={() => setMobileMenu(false)}
                        >
                            Register
                        </Link>
                    </Motion.div>
                )}
                <section className="flex-1 flex flex-col justify-center items-center text-center px-6 md:px-12 py-16 bg-black/40 backdrop-blur-sm">
                    <Motion.h2
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-5xl md:text-7xl font-extrabold text-white leading-tight"
                    >
                        Smart Clinic
                    </Motion.h2>

                    <Motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-6 text-lg md:text-2xl text-white/90 max-w-3xl font-light"
                    >
                        Manage appointments, patient records, doctors, billing & more — all
                        in one powerful, secure, and modern platform.
                    </Motion.p>
                </section>
            </div>
            <section className="bg-white py-20 px-6 md:px-12">
                <Motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900"
                >
                    Powerful Features
                </Motion.h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {[
                        {
                            Icon: Stethoscope,
                            title: "Patient Records",
                            desc: "Complete medical history, reports, and secure data storage.",
                        },
                        {
                            Icon: Calendar,
                            title: "Smart Scheduling",
                            desc: "Book, reschedule, and track appointments effortlessly.",
                        },
                        {
                            Icon: Shield,
                            title: "Bank-Level Security",
                            desc: "Encrypted data and role-based access control.",
                        },
                    ].map((item, i) => (
                        <Motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.7 }}
                            viewport={{ once: true }}
                            whileHover={{
                                y: -10,
                                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                            }}
                            className="p-8 bg-gray-50 rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-all"
                        >
                            <item.Icon className="w-14 h-14 text-teal-600 mb-4" />
                            <h4 className="text-2xl font-bold text-gray-800">
                                {item.title}
                            </h4>
                            <p className="mt-3 text-gray-600 leading-relaxed">{item.desc}</p>
                        </Motion.div>
                    ))}
                </div>
            </section>

            <footer className="text-center py-8 bg-gray-800 text-white">
                <p className="text-sm md:text-base">
                    © {new Date().getFullYear()}{" "}
                    <span className="font-bold text-teal-400">NepHeal</span> — All Rights
                    Reserved.
                </p>
            </footer>
        </div>
    );
};

export default HomeInterface;