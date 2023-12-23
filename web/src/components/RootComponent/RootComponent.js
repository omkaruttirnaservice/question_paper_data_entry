import react from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar';
import { useDispatch, useSelector } from 'react-redux';
import Notification from '../Notification/Notification';
import './RootComponent.css';
import ModalComponent from '../Modal/ModalComponent';

function RootComponent() {
    const showNoti = useSelector((state) => state.notification.show);
    const openModal = useSelector((state) => state.modal.isOpen);
    return (
        <>
            <div className="row p-0 m-0 vh-100">
                <div className="col-md-2 menubar p-0">
                    <MenuBar />
                </div>
                <div className="col-md-10 ">
                    {showNoti && <Notification />}
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default RootComponent;
