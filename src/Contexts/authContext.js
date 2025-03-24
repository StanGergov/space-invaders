import { createContext, useContext } from 'react';

import useLocalStorage from '../Hooks/useLocaleStorage';

const initialAuthState = {
    _id: '',
    name: '',
    email: '',
    accessToken: '',
};

export const AuthContext = createContext(initialAuthState);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', initialAuthState);

    const login = (authData) => {
        const {uid, name, email, accessToken} = authData.user;
        setUser({_id: uid, name, email, accessToken});
    }

    const logout = () => {
        setUser(initialAuthState);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: user.email }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const authState = useContext(AuthContext);

    return authState;
}