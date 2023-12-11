import react, { useEffect, useState, useRef } from 'react';
import { Table } from 'react-bootstrap';
import './SubjectsList.css';
import Loader from '../UI/Loader/Loader';
import Alert_om from '../UI/AlertComponent/Alert_om';

function SubjectsList() {
    const editedSubjectName = useRef();

    const [subjectsList, setSubjectsList] = useState([]);
    const [isSubjectNameEdit, setIsSubjectNameEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const [alert, setAlert] = useState(false);

    const getSubjectList = async () => {
        let response = await fetch('/get-subject-list');
        let { success, data } = await response.json();
        console.log(data[0]);
        if (success === 1) {
            setSubjectsList(data[0]);
        }
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
            alert('Successfully deleted');
            setSubjectsList(
                subjectsList.filter((subject) => {
                    return subject.id !== subjectId;
                })
            );
        } else {
            alert('Something went wrong!');
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
            // alert('Successfully updated data');
            setIsSubjectNameEdit(false);
            getSubjectList();
            return <Alert_om type="success">Successfully updated!</Alert_om>;
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
                                <tr>
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

                {subjectsList.length == 0 && <Loader />}
            </div>
        </>
    );
}

export default SubjectsList;
