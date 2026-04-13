import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./Routes/PublicRoutes"
import PatientRoute from "./Routes/PatientRoutes";
import DoctorsRoute from "./Routes/DoctorsRoutes";
import AdminRoute from "./Routes/AdminRoutes";
import { getUserRole, isAuthenticated } from "./utils/auth";
import { useAuth } from "./context/AuthContext";
import ProtectedRoutes from "./Routes/ProtectedRoutes";

const App = () => {
  const { user, authenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/login/*" element={<PublicRoutes />} />
        <Route path="/register/*" element={<PublicRoutes />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes allowedRoles={["PATIENT"]} />}>
          <Route path="/patient/*" element={<PatientRoute />} />
        </Route>
        
        <Route element={<ProtectedRoutes allowedRoles={["DOCTOR"]} />}>
          <Route path="/doctor/*" element={<DoctorsRoute />} />
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/*" element={<AdminRoute />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
