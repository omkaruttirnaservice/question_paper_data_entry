import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    MdAddCircleOutline,
    MdFormatListBulleted,
    MdDeleteOutline,
    MdArrowForward,
    MdDashboard,
    MdTrendingUp,
    MdLayers,
    MdBook,
    MdQuestionAnswer
} from 'react-icons/md';
import {
    getQuestionNumberThunk,
    getPostListThunk,
    getPublicationsListThunk
} from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sendRequest } = useHttp();

    // Redux selectors for counts
    const auth = useSelector((state) => state.auth);
    const questionNumber = useSelector((state) => state.questionForm.questionNumber);
    const postsList = useSelector((state) => state.questionForm.postsList);
    const publicationsList = useSelector((state) => state.questionForm.publicationsList);

    useEffect(() => {
        // Dispatch thunks to get live statistics
        dispatch(getQuestionNumberThunk());
        dispatch(getPostListThunk(sendRequest));
        dispatch(getPublicationsListThunk(sendRequest));
    }, [dispatch]);

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    /* ── Stat Cards Configuration ── */
    const statCards = [
        {
            label: 'Total Questions',
            value: questionNumber !== undefined ? questionNumber : '—',
            icon: <MdQuestionAnswer />,
            gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            shadow: 'rgba(37, 99, 235, 0.2)',
        },
        {
            label: 'Active Posts',
            value: postsList?.length || 0,
            icon: <MdLayers />,
            gradient: 'linear-gradient(135deg, #10B981, #059669)',
            shadow: 'rgba(16, 185, 129, 0.2)',
        },
        {
            label: 'Publications',
            value: publicationsList?.length || 0,
            icon: <MdBook />,
            gradient: 'linear-gradient(135deg, #EC4899, #BE185D)',
            shadow: 'rgba(236, 72, 153, 0.2)',
        },
    ];

    /* ── Quick Action Cards Configuration ── */
    const quickActions = [
        {
            title: 'Add Questions',
            description: 'Enter new single or bulk questions with options and solutions',
            icon: <MdAddCircleOutline />,
            url: '/question-form',
            gradient: 'from-blue-500 to-indigo-600',
            bg: '#EFF6FF',
            iconColor: '#2563EB',
            borderColor: '#BFDBFE',
            tag: 'Entry Panel',
        },
        {
            title: 'Questions List',
            description: 'Browse, search, filter, edit, and print compiled questions',
            icon: <MdFormatListBulleted />,
            url: '/questions-list',
            gradient: 'from-emerald-500 to-teal-600',
            bg: '#ECFDF5',
            iconColor: '#10B981',
            borderColor: '#A7F3D0',
            tag: 'Database',
        },
        {
            title: 'Recycle Bin',
            description: 'Recover temporarily deleted questions or delete permanently',
            icon: <MdDeleteOutline />,
            url: '/deleted-questions-list',
            gradient: 'from-rose-500 to-red-600',
            bg: '#FFF5F5',
            iconColor: '#EF4444',
            borderColor: '#FCA5A5',
            tag: 'Recycle Bin',
        },
    ];

    return (
        <div className="dashboard-root">

            {/* ── Hero Banner ── */}
            <div className="dashboard-hero">
                <div className="hero-bg-orb orb-1" />
                <div className="hero-bg-orb orb-2" />
                <div className="hero-content">
                    <div className="hero-icon-wrap">
                        <MdDashboard className="hero-icon" />
                    </div>
                    <div>
                        <p className="hero-greeting">{greeting()}, {auth?.username || 'Operator'} 👋</p>
                        <h1 className="hero-title">ExamPortal Data Entry</h1>
                        <p className="hero-subtitle">
                            Quickly populate and manage the exam database. Input questions, organize publications, and keep tables optimized.
                        </p>
                    </div>
                </div>
                <div className="hero-stat-row">
                    {statCards.map((s, i) => (
                        <div className="hero-stat-card" key={i} style={{ '--shadow': s.shadow }}>
                            <div className="hero-stat-icon" style={{ background: s.gradient, boxShadow: `0 8px 20px -4px ${s.shadow}` }}>
                                {s.icon}
                            </div>
                            <div>
                                <div className="hero-stat-value">{s.value}</div>
                                <div className="hero-stat-label">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Quick Actions Heading ── */}
            <div className="section-header">
                <div className="section-header-left">
                    <MdTrendingUp className="text-blue-500 text-xl" />
                    <h2 className="section-title">Quick Actions</h2>
                </div>
                <span className="section-badge">{quickActions.length} shortcuts</span>
            </div>

            {/* ── Action Cards Grid ── */}
            <div className="action-grid">
                {quickActions.map((action, i) => (
                    <button
                        key={i}
                        className="action-card"
                        onClick={() => navigate(action.url)}
                        style={{ '--card-bg': action.bg, '--icon-color': action.iconColor }}
                    >
                        <div className="action-card-top">
                            <div className="action-icon-wrap" style={{ background: action.bg }}>
                                <span className="action-icon" style={{ color: action.iconColor }}>
                                    {action.icon}
                                </span>
                            </div>
                            <span className="action-tag"
                                style={{ background: action.bg, color: action.iconColor, borderColor: action.borderColor, borderWidth: '1px' }}>
                                {action.tag}
                            </span>
                        </div>

                        <div className="action-card-body">
                            <h3 className="action-title">{action.title}</h3>
                            <p className="action-desc">{action.description}</p>
                        </div>

                        <div className="action-card-footer">
                            <span className="action-cta">Open</span>
                            <span className="action-arrow-wrap"
                                style={{ background: `linear-gradient(135deg, ${action.iconColor}22, ${action.iconColor}44)`, color: action.iconColor }}>
                                <MdArrowForward className="action-arrow" />
                            </span>
                        </div>

                        {/* Hover gradient bar */}
                        <div className={`action-bar bg-gradient-to-r ${action.gradient}`} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
