import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import AddQuestionForm from './components/QuestionForm/AddQuestionForm.jsx';
import EditQuestionForm from './components/QuestionForm/EditQuestionForm.jsx';
import QuestionsList from './components/QuestionsList/QuestionsList.jsx';
import RootComponent from './components/RootComponent/RootComponent';
import TrashQuestionsList from './components/TrashQuestionsList/TrashQuestionsList.jsx';
import LoginPage from './components/Login/Login.jsx';

const router = createBrowserRouter([
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
        element: <LoginPage />,
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
