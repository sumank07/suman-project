export const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.role : null;
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};
