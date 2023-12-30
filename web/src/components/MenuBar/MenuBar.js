import react from 'react';
import { NavLink } from 'react-router-dom';

import './MenuBar.css';

function MenuBar() {
    const menuButtons = [
        { name: 'Dashboard', icon: 'fa-solid fa-house', path: '/' },
        { name: 'New Test', icon: 'fa-solid fa-square-plus', path: '/add-new-test-form' },
        { name: 'Add Questions', icon: 'fa-solid fa-square-plus', path: '/question-form' },
        { name: 'Questions List', icon: 'fa-solid fa-circle-question', path: '/questions-list' },
        { name: 'Subjects List', icon: 'fa-solid fa-book', path: '/subjects-list' },
    ];

    return (
        <>
            <div className="menu-button-list">
                {menuButtons?.map((el, index) => {
                    return (
                        <NavLink
                            key={index}
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
