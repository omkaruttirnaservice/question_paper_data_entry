import react, { useEffect, useState, useRef } from 'react';
import { Table } from 'react-bootstrap';
import './SubjectsList.css';
import Loader from '../UI/Loader/Loader';
import { notificationActions } from '../../Store/notification-slice';
import { useSelector, useDispatch } from 'react-redux';
import useHttp from '../Hooks/use-http';
import { loaderActions } from '../../Store/loader-slice';
function SubjectsList() {
    const editedSubjectName = useRef();

    // REDUX
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.loader.isLoading);
    const { sendRequest } = useHttp();

    const [subjectsList, setSubjectsList] = useState([]);
    const [isSubjectNameEdit, setIsSubjectNameEdit] = useState(false);
    const [editId, setEditId] = useState('');

    const getSubjectList = async () => {
        dispatch(loaderActions.showLoader());
        const requestData = {
            url: '/get-subject-list',
        };
        sendRequest(requestData, (data) => {
            if (data.success === 1) {
                console.log(data);
                setSubjectsList(data.data[0]);
                dispatch(loaderActions.hideLoader());
            }
        });
    };

    useEffect(() => {
        getSubjectList();
    }, []);

    async function handleDeleteSubject(subjectId) {
        let response = await fetch('/delete-subject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subjectId }),
        });

        let { success, data } = await response.json();
        if (success === 1) {
            setSubjectsList(
                subjectsList.filter((subject) => {
                    return subject.id !== subjectId;
                })
            );
            dispatch(notificationActions.showNotification('Successfully deleted subject.'));
        } else {
            dispatch(notificationActions.showNotification('Something went wrong!'));
        }
    }

    const handleSubjectEdit = (subjectId) => {
        setEditId(subjectId);
        setIsSubjectNameEdit(true);
    };

    const handleSaveEditedSubjectName = async (subjectId) => {
        let _editedSubjectName = editedSubjectName.current.value;
        let response = await fetch('/post-edit-subject-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newSubjectName: _editedSubjectName, subjectId }),
        });
        let { success, data } = await response.json();

        if (success === 1) {
            setIsSubjectNameEdit(false);
            getSubjectList();
            return;
        } else {
            alert('Something went wrong');
        }
    };

    return (
        <>
            <div className="container mt-4">
                <Table bordered>
                    <thead>
                        <tr>
                            <th className="text-center" width="7%">
                                SR NO
                            </th>
                            <th className="text-center" width="10%">
                                Subject ID
                            </th>
                            <th>Subject Name</th>
                            <th width="15%">Questions Count</th>
                            <th className="text-center" width="10%">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {subjectsList?.map((subject, i) => {
                            return (
                                <tr key={subject.id}>
                                    <td className="text-center">{i + 1}</td>
                                    <td className="text-center">{subject.id}</td>
                                    <td>
                                        {subject.subject_name}
                                        {isSubjectNameEdit && subject.id === editId && (
                                            <>
                                                <input
                                                    ref={editedSubjectName}
                                                    className="form-control w-50 d-inline-block p-0 ms-2"
                                                />
                                                <i
                                                    className="btn fa-solid fa-floppy-disk text-success d-inline-block ms-2 px-0"
                                                    onClick={handleSaveEditedSubjectName.bind(
                                                        null,
                                                        subject.id
                                                    )}></i>
                                                <i
                                                    onClick={() => setIsSubjectNameEdit(false)}
                                                    className="btn fa-solid fa-xmark ps-1 px-0"></i>
                                            </>
                                        )}
                                    </td>
                                    <td className="text-center">3</td>
                                    <td className="text-center">
                                        <i
                                            type="button"
                                            onClick={handleDeleteSubject.bind(null, subject.id)}
                                            className="btn text-danger btn-sm fa-solid fa-trash"></i>
                                        <i
                                            type="button"
                                            onClick={handleSubjectEdit.bind(null, subject.id)}
                                            className="btn text-danger btn-sm fa-solid fa-pen"></i>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>

                {isLoading && <Loader />}
            </div>
        </>
    );
}

export default SubjectsList;
