import { useState, useRef, useEffect } from 'react';
import { Modal, Button, InputGroup, Form } from 'react-bootstrap';

// CSS IMPORT
import './addQuestionForm.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddQuestionForm = () => {
    const subjectNameRef = useRef();
    const topicNameRef = useRef();
    const [selectedSubject, setSelectedSubject] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [showNewInputField, setShowNewInputField] = useState(false);

    const [questionCount, setQuestionCount] = useState(0);

    const [toggleOptions, setToggleOptions] = useState(false);

    const [subjects, setSubjects] = useState([]);

    const topics = ['Topic1', 'Topic2', 'Topic3'];

    const handleAddInputField = (e) => {
        e.preventDefault();
        setShowNewInputField(!showNewInputField);
    };

    const handleAddSubjectModal = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const getSubjectList = async () => {
        let response = await fetch('/get-subject-list');
        let { success, data } = await response.json();
        if (success === 1) {
            setSubjects(data);
        }
        console.log(data, 'subject list');
    };

    const handleSubjectAdd = async () => {
        let subjectName = subjectNameRef.current.value;
        if (subjectName === '') {
            alert('Please enter subject name');
            return;
        }
        let response = await fetch('/add-subject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subjectName }),
        });

        let { success } = await response.json();

        if (success === 1) {
            setShowModal(false);
            alert('Subject added successfully');
            getSubjectList();
        } else {
            alert('Something went wrong');
        }
    };

    useEffect(() => {
        getSubjectList();
    }, []);

    const handleTopicAddModal = () => {
        console.log(selectedSubject);
        if (selectedSubject === '') {
            alert('Please select subject');
            return;
        }
        setShowModal(true);
    };
    return (
        <>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    {!selectedSubject && <Modal.Title>Add Subject</Modal.Title>}
                    {selectedSubject && <Modal.Title>Add Topic</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    {!selectedSubject && (
                        <Form action="">
                            <InputGroup>
                                <InputGroup.Text>Subject Name</InputGroup.Text>
                                <Form.Control type="text" ref={subjectNameRef} />
                            </InputGroup>
                            <Button className="mt-3" variant="primary" onClick={handleSubjectAdd}>
                                Submit
                            </Button>
                        </Form>
                    )}
                    {selectedSubject && (
                        <Form>
                            <InputGroup>
                                <InputGroup.Text>Selected Subject</InputGroup.Text>
                                <Form.Control type="text" value={selectedSubject} readOnly />
                            </InputGroup>
                            <InputGroup className='mt-3'>
                                <InputGroup.Text>Topic Name</InputGroup.Text>
                                <Form.Control type="text" ref={topicNameRef} />
                            </InputGroup>
                            <Button variant="primary" className="mt-3" type="button">
                                Submit
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            <div className="container">
                <form id="add-question-form" className="">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-lg-3">
                            <label htmlFor="" className="form-label">
                                <span>Select Subject</span>
                                <button
                                    className="btn"
                                    type="button"
                                    onClick={handleAddSubjectModal}>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </label>
                            <select
                                className="form-control"
                                name="subject-name"
                                onChange={(e) => setSelectedSubject(e.target.value)}>
                                <option value="-1" className="text-center">
                                    -- Select Subject --
                                </option>
                                {subjects?.map((subject) => (
                                    <option value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <label htmlFor="" className="form-label">
                                Select Topic
                                <button className="btn" type="button" onClick={handleTopicAddModal}>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </label>
                            <select className="form-control" name="topic-name" id="">
                                <option value="-1" className="text-center">
                                    -- Select topic --
                                </option>
                                {topics?.map((topic) => (
                                    <option value={topic}>{topic}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <label htmlFor="" className="form-label">
                                Publication Name
                            </label>
                            <input type="text" className="form-control" id="" />
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <label htmlFor="" className="form-label">
                                Question Number
                            </label>
                            <div className="">{questionCount + 1}</div>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="" className="form-label">
                                Enter Question
                            </label>
                            <CKEditor editor={ClassicEditor} />
                        </div>

                        <div className="col-md-12">
                            <div className="mt-2 d-flex align-items-center gap-2">
                                Text Editor{' '}
                                <span
                                    className="toggle-options-editor"
                                    onClick={() => setToggleOptions(!toggleOptions)}>
                                    {toggleOptions ? (
                                        <i className="fa-solid fa-toggle-on"></i>
                                    ) : (
                                        <i className="fa-solid fa-toggle-off"></i>
                                    )}
                                </span>
                            </div>
                            <div className="form-options">
                                <div>
                                    <label htmlFor="option-A">A</label>

                                    {toggleOptions ? (
                                        <div className="ckeditor">
                                            <CKEditor editor={ClassicEditor} />
                                        </div>
                                    ) : (
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="option-A"
                                            name="option-A"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="option-B">B</label>
                                    {toggleOptions ? (
                                        <div className="ckeditor">
                                            <CKEditor editor={ClassicEditor} />
                                        </div>
                                    ) : (
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="option-B"
                                            name="option-B"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="option-C">C</label>
                                    {toggleOptions ? (
                                        <div className="ckeditor">
                                            <CKEditor editor={ClassicEditor} />
                                        </div>
                                    ) : (
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="option-C"
                                            name="option-C"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="option-D">D</label>
                                    {toggleOptions ? (
                                        <div className="ckeditor">
                                            <CKEditor editor={ClassicEditor} />
                                        </div>
                                    ) : (
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            id="option-D"
                                            name="option-D"
                                        />
                                    )}
                                </div>

                                {showNewInputField ? (
                                    <>
                                        <div className="d-flex gap-2">
                                            <label htmlFor="option-E">E</label>
                                            {toggleOptions ? (
                                                <div className="ckeditor">
                                                    <CKEditor editor={ClassicEditor} />
                                                </div>
                                            ) : (
                                                <textarea
                                                    type="text"
                                                    className="form-control"
                                                    id="option-E"
                                                    name="option-E"
                                                />
                                            )}
                                        </div>
                                        <button
                                            className="btn btn-danger"
                                            id="remove-new-option-btn"
                                            onClick={handleAddInputField}>
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-secondary"
                                        id="add-new-option-btn"
                                        onClick={handleAddInputField}>
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="correct-option" className="form-label">
                                Correct Option
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="correct-option"
                                name="correct-option"
                            />
                        </div>

                        <div className="col-md-12 mt-3">
                            <div
                                className="accordion accordion-flush"
                                id="add-explanation-accordion">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapse-1"
                                            aria-expanded="true"
                                            aria-controls="collapseOne">
                                            Add Explanation
                                        </button>
                                    </h2>
                                    <div
                                        id="collapse-1"
                                        className="accordion-collapse collapse show"
                                        data-bs-parent="#add-explanation-accordion">
                                        <div className="accordion-body">
                                            <CKEditor editor={ClassicEditor} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary mt-2"
                        id="save-new-question-btn"
                        onClick={() => setQuestionCount(questionCount + 1)}>
                        Save
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddQuestionForm;
