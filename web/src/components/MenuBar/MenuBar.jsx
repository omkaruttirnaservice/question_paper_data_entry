import { CgProfile } from 'react-icons/cg';
import { FaClock } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    MdLogout,
    MdDashboard,
    MdAddCircleOutline,
    MdFormatListBulleted,
    MdDeleteOutline
} from 'react-icons/md';
import { useEffect, useState } from 'react';
import './MenuBar.css';

function MenuBar({ isSidebarOpen }) {
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const menuButtons = [
        {
            name: 'Dashboard',
            icon: <MdDashboard />,
            path: '/dashboard',
        },
        {
            name: 'Add Questions',
            icon: <MdAddCircleOutline />,
            path: '/question-form',
        },
        {
            name: 'Questions List',
            icon: <MdFormatListBulleted />,
            path: '/questions-list',
        },
        {
            name: 'Recycle Bin',
            icon: <MdDeleteOutline />,
            path: '/deleted-questions-list',
        },
    ];

    return (
        <div className="menu-container">
            {/* ── Profile Card ── */}
            {isSidebarOpen && auth?.username ? (
                <div className="profile-card">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/30 flex-shrink-0">
                            <CgProfile className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[9px] text-white/55 uppercase tracking-wider font-bold">Data Operator</span>
                            <span className="text-sm text-white font-semibold truncate">{auth.username}</span>
                        </div>
                    </div>
                    <Clock />
                </div>
            ) : !isSidebarOpen ? (
                <div className="flex justify-center py-2 mb-1">
                    <div className="bg-white/15 p-2 rounded-full border border-white/20">
                        <CgProfile className="w-5 h-5 text-white/80" />
                    </div>
                </div>
            ) : null}

            {/* ── Scrollable Nav Area ── */}
            <div className="menu-scroll-area">
                {menuButtons.map((el, index) => (
                    <NavLink
                        key={index}
                        to={el.path}
                        className={({ isActive }) => `menu-item-base ${isActive ? 'active' : ''}`}
                        title={el.name}
                    >
                        <span className="text-xl flex-shrink-0">{el.icon}</span>
                        {isSidebarOpen && <span className="truncate">{el.name}</span>}
                    </NavLink>
                ))}
            </div>

            {/* ── Logout ── */}
            <div className="logout-area">
                <button
                    onClick={() => navigate('/logout')}
                    className={`logout-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-white font-bold ${isSidebarOpen ? '' : 'px-2'}`}
                >
                    <MdLogout className="text-xl flex-shrink-0" />
                    {isSidebarOpen && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}

function Clock() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setDate(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
            setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="clock-widget">
            <div className="clock-time flex items-center justify-center gap-1.5">
                <FaClock className="text-[9px] opacity-55" />
                {time}
            </div>
            <div className="clock-date">{date}</div>
        </div>
    );
}

export default MenuBar;
