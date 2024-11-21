export const saveToken = (token) => localStorage.setItem('access_token', token);

export const removeToken = () => localStorage.removeItem('access_token');

export const getToken = () => localStorage.getItem('access_token');
