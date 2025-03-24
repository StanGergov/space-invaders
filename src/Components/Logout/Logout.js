import { useEffect } from 'react';
import { useNavigate } from 'react-router'

import { useAuthContext } from '../../Contexts/authContext';
import * as authServices from '../../Services/authservices';

const Logout = () => {

    const navigate = useNavigate();
    const { logout } = useAuthContext();

    useEffect(() => {
        authServices.logout();

        logout();

        navigate('/login');
    })

    return null
};

export default Logout;