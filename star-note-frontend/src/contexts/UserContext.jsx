import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user data from localStorage on initial render
    useEffect(() => {
        const loadUser = () => {
            const userData = localStorage.getItem('starnote-user');
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } catch (error) {
                    console.error('Error parsing user data from localStorage', error);
                    localStorage.removeItem('starnote-user');
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Update user data
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('starnote-user', JSON.stringify(userData));
    };

    // Value to be provided by context
    const value = {
        user,
        loading,
        updateUser
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;
