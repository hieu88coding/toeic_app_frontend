// auth-callback.jsx hoặc auth-callback.js trong frontend
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('x-auth-token', token);

            navigate('/');
        }
    }, [history]);

    return <div>Authenticating...</div>;
};

export default AuthCallback;
