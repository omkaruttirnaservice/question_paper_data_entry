import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MenuBar() {
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const menuButtons = [
        {
            name: 'Add Questions',
            icon: 'fa-solid fa-square-plus',
            path: '/question-form',
        },
        {
            name: 'Questions List',
            icon: 'fa-solid fa-list',
            path: '/questions-list',
        },
        {
            name: 'Deleted Questions',
            icon: 'fa-solid fa-trash',
            path: '/deleted-questions-list',
        },
    ];

    return (
        <div className="bg-white shadow-lg px-6 py-3 flex justify-between items-center w-full sticky top-0 z-10">
            {/* Left side - Navigation buttons */}
            <div className="flex gap-3">
                {menuButtons.map((el, index) => (
                    <NavLink
                        key={index}
                        to={el.path}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 text-sm font-medium transition duration-200 ${
                                isActive
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }>
                        <i className={el.icon}></i>
                        <span>{el.name}</span>
                    </NavLink>
                ))}
            </div>

            {/* Right side - User Info */}
            <div className="flex items-center gap-4">
                {auth?.username && (
                    <span className="text-sm text-gray-700 font-medium">
                        👤 {auth.username}
                    </span>
                )}
                <button
                    onClick={() => navigate('/logout')}
                    className="text-sm text-white bg-red-500 hover:bg-red-600 transition px-4 py-1 ">
                    Logout
                </button>
            </div>
        </div>
    );
}

export default MenuBar;
