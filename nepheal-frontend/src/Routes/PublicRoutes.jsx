import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Homeinterface from '../Landing/Homeinterface';

const PublicRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Homeinterface />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            {/* Fallback for legacy /login access if needed, or redirect */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> */}
        </Routes>
    );
};

export default PublicRoutes;
