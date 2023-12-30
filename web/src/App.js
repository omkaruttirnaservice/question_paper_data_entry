import './App.css';
import AddQuestionForm from './components/AddQuestionForm/AddQuestionForm';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootComponent from './components/RootComponent/RootComponent';
import Dashboard from './components/Dashboard/Dashboard';
import AddNewTestForm from './components/AddNewTestForm/AddNewTestForm';
import QuestionsList from './components/QuestionsList/QuestionsList';
import SubjectsList from './components/SubjectsList/SubjectsList';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootComponent />,
        children: [
            { path: '/', element: <Dashboard /> },
            { path: '/question-form', element: <AddQuestionForm /> },
            { path: '/add-new-test-form', element: <AddNewTestForm /> },
            { path: '/questions-list', element: <QuestionsList /> },
            { path: '/subjects-list', element: <SubjectsList /> },
        ],
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
