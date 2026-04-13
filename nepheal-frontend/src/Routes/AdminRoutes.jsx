import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../admin/Dashboard';
import ManageDoctors from '../admin/ManageDoctor';
import ManagePatients from '../admin/ManagePatient';
import ManageSlots from '../admin/ManageSlots';
import RobinAssignment from '../admin/RobinAssignment';
import UsersPanels from '../admin/UsersPannels';
import ManageAppointments from '../admin/ManageAppointments';
import Profile from '../admin/Profile';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="doctors" element={<ManageDoctors />} />
            <Route path="patients" element={<ManagePatients />} />
            <Route path="appointments" element={<ManageAppointments />} />
            <Route path="profile" element={<Profile />} />
        </Routes>
    );
};

export default AdminRoutes;
