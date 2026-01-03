import RootComponent from './components/RootComponent/RootComponent';

import LoginPage from './components/Login/Login.jsx';
import Logout from './components/Logout/Logout.jsx';
import AddQuestionForm from './components/QuestionForm/AddQuestionForm.jsx';
import EditQuestionForm from './components/QuestionForm/EditQuestionForm.jsx';
import QuestionsList from './components/QuestionsList/QuestionsList.jsx';
import TrashQuestionsList from './components/TrashQuestionsList/TrashQuestionsList.jsx';
import { createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export const _router = createBrowserRouter([
    {
        path: '/',
        element: <RootComponent />,
        children: [
            { path: '/questions-list', element: <QuestionsList /> },
            { path: '/deleted-questions-list', element: <TrashQuestionsList /> },
            { path: '/question-form', element: <AddQuestionForm /> },
            { path: '/edit-question-form', element: <EditQuestionForm /> },
        ],
    },
    {
        path: '/login',
        element: (
            <>
                <ToastContainer autoClose={2000} />
                <LoginPage />
            </>
        ),
    },
    {
        path: '/logout',
        element: <Logout />,
    },

    // Print routes
    {
        path: '/print',
    },
]);
