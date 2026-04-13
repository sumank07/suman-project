import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const fullName = localStorage.getItem('fullName');
        const email = localStorage.getItem('email');

        if (token) {
            setUser({ role, fullName, email });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, role, fullName } = response.data;

        // Note: Using the email from arguments since the backend response might not include it directly 
        // if the DTO didn't have it, but usually it should. 
        // Assuming response.data *might* not have it based on DTO check, 
        // but for now let's use the one passed to login if missing, or prioritize response.

        // Actually, let's check AuthResponse DTO content from context or just use input email safe-guard
        const userEmail = response.data.email || email;

        const userData = { role, fullName, token, email: userEmail };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', role);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('email', userEmail);

        setUser(userData);
    };

    const register = async (data) => {
        const response = await api.post('/auth/register', data);
        const { token, role, fullName } = response.data;
        const userEmail = data.email; // Register data has email

        const userData = { role, fullName, token, email: userEmail };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', role);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('email', userEmail);

        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        localStorage.removeItem('email');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
