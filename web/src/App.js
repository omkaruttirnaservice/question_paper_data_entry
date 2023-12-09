import './App.css';
import AddQuestionForm from './components/AddQuestionForm/AddQuestionForm';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootComponent from './components/RootComponent/RootComponent';
import Dashboard from './components/Dashboard/Dashboard';
import AddNewTestForm from './components/AddNewTestForm/AddNewTestForm';

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootComponent />,
        children: [
            { path: '/', element: <Dashboard /> },
            { path: '/add-question-form', element: <AddQuestionForm /> },
            { path: '/add-new-test-form', element: <AddNewTestForm /> },
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
