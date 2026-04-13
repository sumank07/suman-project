import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../patient/Dashboard';
import BookAppointment from '../patient/BookAppointment';
import MyAppointments from '../patient/MyAppointments';
import Profile from '../patient/Profile';

const PatientRoutes = () => {
    return (
        <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="book" element={<BookAppointment />} />
            <Route path="history" element={<MyAppointments />} />
            <Route path="profile" element={<Profile />} />
        </Routes>
    );
};

export default PatientRoutes;
