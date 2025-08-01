import { Navigate, Outlet } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './RootComponent.css';
import { useSelector } from 'react-redux';

function RootComponent() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <ToastContainer autoClose={2000} />
            <div className="">
                <div className=" menubar ">
                    <MenuBar />
                </div>
                <div className="">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default RootComponent;
