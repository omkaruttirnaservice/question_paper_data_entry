import react from 'react';
import { NavLink } from 'react-router-dom';

import './MenuBar.css';

function MenuBar() {
    const menuButtons = [
        { name: 'Dashboard', icon: 'fa-solid fa-house', path: '/' },
        { name: 'New Test', icon: 'fa-solid fa-square-plus', path: '/add-new-test-form' },
    ];

    return (
        <>
            <div className="menu-button-list">
                {menuButtons.map((el) => {
                    return (
                        <NavLink
                            to={el.path}
                            className={({ isActive }) =>
                                isActive ? 'menu-button-item active' : 'menu-button-item'
                            }>
                            <i className={el.icon}></i>
                            <span>{el.name}</span>
                        </NavLink>
                    );
                })}
            </div>
        </>
    );
}

export default MenuBar;
