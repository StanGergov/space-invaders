import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../../Contexts/authContext';

const GuardRoute = () => {
    const { isAuthenticated } = useAuthContext();

    if (isAuthenticated) {
        return <Outlet />
    } else {
        return <Navigate to="/login" />
    }
}

export default GuardRoute;