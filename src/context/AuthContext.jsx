import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create auth context
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for token in localStorage on initial load
        const token = localStorage.getItem('token');

        if (token) {
            // In a real app, validate the token with the server
            fetchUserInfo(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserInfo = async (token) => {
        try {
            // In a real app, make an API call to get user info
            // For now, we'll simulate the API call
            const response = await new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        user_id: 1,
                        username: 'admin',
                        role: 'cashier', // or 'cashier'
                        nama_lengkap: 'Admin Restoran',
                        email: 'admin@restoran.com'
                    });
                }, 500);
            });

            setUser(response);
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            setLoading(true);

            // In a real app, make an API call to authenticate
            // For now, we'll simulate the API call
            const response = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (username === 'admin' && password === 'password') {
                        resolve({
                            token: 'fake-jwt-token',
                            user: {
                                user_id: 1,
                                username: 'admin',
                                role: 'owner',
                                nama_lengkap: 'Admin Restoran',
                                email: 'admin@restoran.com'
                            }
                        });
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                }, 1000);
            });

            // Store token in localStorage
            localStorage.setItem('token', response.token);

            // Set user info
            setUser(response.user);

            // Redirect based on user role
            if (response.user.role === 'owner' || response.user.role === 'cashier') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }

            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Clear authentication data
        localStorage.removeItem('token');
        setUser(null);

        // Redirect to login
        navigate('/login');
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};