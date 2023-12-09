import react from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar';

import './RootComponent.css';

function RootComponent() {
    return (
        <>
            <div className="row p-0 m-0 vh-100">
                <div className="col-md-2 menubar p-0">
                    <MenuBar />
                </div>
                <div className="col-md-10 ">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default RootComponent;
