import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../doctor/Dashboard';
import MyAssignment from '../doctor/MyAssignment';
import DoctorSlots from '../doctor/DoctorSlots';
import Patient from '../doctor/Patient';
import Profile from '../doctor/Profile';

const DoctorRoutes = () => {
    return (
        <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="assignments" element={<MyAssignment />} />
            <Route path="slots" element={<DoctorSlots />} />
            <Route path="patients" element={<Patient />} />
            <Route path="profile" element={<Profile />} />
        </Routes>
    );
};

export default DoctorRoutes;
