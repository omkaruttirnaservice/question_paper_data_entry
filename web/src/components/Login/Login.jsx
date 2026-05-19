import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../Store/auth-slice';
import useHttp from '../Hooks/use-http'; // adjust path if needed
import { SERVER_IP } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';
import { isDevEnv } from '../utils/utils';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sendRequest } = useHttp();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [selectedDb, setSelectedDb] = useState('');

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            url: SERVER_IP + '/api/auth/login',
            method: 'POST',
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
                dbConfig: selectedDb ? JSON.parse(selectedDb) : null,
            }),
        };

        sendRequest(requestData, (res) => {
            console.log({ res });
            if (res.success === 1) {
                const { username, role, id: userId } = res.data;

                dispatch(
                    authActions.login({
                        username: username,
                        role: role,
                        userId: userId,
                    }),
                );
                navigate('/dashboard');
            } else {
                setError('Invalid login credentials');
            }
        });
    };

    const [databases, setDatabases] = useState([]);
    // get databases list from backend on component mount
    useState(() => {
        const requestData = {
            url: SERVER_IP + '/api/auth/databases',
            method: 'GET',
        };

        sendRequest(requestData, (res) => {
            console.log({ res });
            if (res.success) {
                // handle databases list if needed
                console.log('Databases List:', res.data);

                setDatabases(res?.data || []);
            }
        });
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <form
                onSubmit={handleSubmit}
                className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl w-full max-w-md border border-white/50">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-3">
                        <i className="fa-solid fa-lock text-white text-xl"></i>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800">Welcome Back</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sign in to your account data entry panel</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {error}
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-slate-700 text-sm font-bold mb-2 ml-1">Username</label>
                    <div className="relative">
                        <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-slate-700 text-sm font-bold mb-2 ml-1">Password</label>
                    <div className="relative">
                        <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-slate-700 text-sm font-bold mb-2 ml-1">Database Instance</label>
                    <div className="relative">
                        <i className="fa-solid fa-database absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <select
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                            value={selectedDb}
                            onChange={(e) => setSelectedDb(e.target.value)}
                            required>
                            <option value="">Select a database...</option>
                            {databases.map((db, index) => (
                                <option key={index} value={JSON.stringify(db)}>
                                    {db.processName} ({db.dbName})
                                </option>
                            ))}
                        </select>
                        <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-right-to-bracket"></i>
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
