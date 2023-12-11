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

    const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
    const [showAddTopicModal, setShowAddTopicModal] = useState(false);

    const [showNewInputField, setShowNewInputField] = useState(false);

    const [questionCount, setQuestionCount] = useState(0);

    const [toggleOptions, setToggleOptions] = useState(false);

    const [subjects, setSubjects] = useState([]);

    const [topics, setTopics] = useState([]);

    const [formData, setFormData] = useState({
        subject_id: '-1',
        topic_id: '-1',
        question_content: '',
        option_A: '',
        option_B: '',
        option_C: '',
        option_D: '',
        option_E: '',
        correct_option: '',
        explanation: '',
    });

    const handleChange = (e) => {
        setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
    };

    const handleSaveQuestion = async () => {
        // Send data using Fetch API or any other method
        await fetch('/questions/add-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleAddInputField = (e) => {
        e.preventDefault();
        setShowNewInputField(!showNewInputField);
    };

    const handleAddSubjectModal = () => setShowAddSubjectModal(true);
    const handleClose = () => setShowAddSubjectModal(false);
    const handleCloseAddTopicModal = () => setShowAddTopicModal(false);

    const getSubjectList = async () => {
        let response = await fetch('/get-subject-list');
        let { success, data } = await response.json();

        if (success === 1) {
            console.log(data[0], 'subjects array');
            setSubjects(data[0]);
        }
    };

    const getTopicList = async () => {
        let response = await fetch('/get-topic-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subjectId: selectedSubject.id }),
        });
        let { data } = await response.json();
        setTopics(data);
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
            setShowAddSubjectModal(false);
            alert('Subject added successfully');
            getSubjectList();
        } else {
            alert('Something went wrong');
        }
    };

    useEffect(() => {
        getSubjectList();
    }, []);

    const handleSubjectChange = (e) => {
        subjects.forEach((subject) => {
            console.log(subject.id === +e.target.value);
            if (+subject.id === +e.target.value) {
                setSelectedSubject(subject);
            }
        });
    };

    useEffect(() => {
        getTopicList();
    }, [selectedSubject]);

    const handleTopicAddModal = () => {
        if (selectedSubject === '') {
            alert('Please select subject');
            return;
        }
        setShowAddTopicModal(true);
    };

    const handleAddTopic = async () => {
        console.log(selectedSubject.id, topicNameRef.current.value);

        let subjectId = selectedSubject.id;
        let topicName = topicNameRef.current.value;

        if (topicName === '') {
            alert('Please enter topic name');
            return;
        }
        let response = await fetch('/add-topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subjectId, topicName }),
        });

        let data = await response.json();
        console.log(data, 'after adding topic');
        if (data.success === 1) {
            alert('Successfully added new topic');
            setShowAddTopicModal(false);
            getTopicList();
            return;
        } else {
            alert('Something went wrong');
        }
    };
    return (
        <>
            {/* ADD SUBJECT MODAL */}
            <Modal show={showAddSubjectModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form action="">
                        <InputGroup>
                            <InputGroup.Text>Subject Name</InputGroup.Text>
                            <Form.Control type="text" ref={subjectNameRef} />
                        </InputGroup>
                        <Button className="mt-3" variant="primary" onClick={handleSubjectAdd}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ADD TOPIC MODAL */}

            <Modal show={showAddTopicModal} onHide={handleCloseAddTopicModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup>
                            <InputGroup.Text>Selected Subject</InputGroup.Text>
                            <Form.Control
                                type="text"
                                value={selectedSubject.subject_name}
                                readOnly
                            />
                        </InputGroup>
                        <InputGroup className="mt-3">
                            <InputGroup.Text>Topic Name</InputGroup.Text>
                            <Form.Control type="text" ref={topicNameRef} />
                        </InputGroup>
                        <Button
                            variant="primary"
                            className="mt-3"
                            type="button"
                            onClick={handleAddTopic}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <div className="container">
                <form id="add-question-form" className="">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-lg-3">
                            <InputGroup>
                                <InputGroup.Text>
                                    <Button
                                        className="btn p-0 px-1 btn-secondary btn-sm"
                                        onClick={handleAddSubjectModal}>
                                        <i className="fa-solid fa-plus"></i>
                                    </Button>
                                </InputGroup.Text>
                                <Form.Select
                                    id="subject-id"
                                    name="subject_id"
                                    onChange={handleSubjectChange}>
                                    <option value="-1" className="text-center">
                                        -- Select Subject --
                                    </option>
                                    {subjects?.map((subject) => (
                                        <option value={subject.id}>{subject.subject_name}</option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <InputGroup>
                                <InputGroup.Text>
                                    <Button
                                        className="btn p-0 px-1 btn-secondary btn-sm"
                                        onClick={handleTopicAddModal}>
                                        <i className="fa-solid fa-plus"></i>
                                    </Button>
                                </InputGroup.Text>
                                <Form.Select>
                                    <option value="-1" className="text-center">
                                        -- Select topic --
                                    </option>
                                    {topics?.map((topic) => (
                                        <option value={topic.id}>{topic.topic_name}</option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <InputGroup>
                                <InputGroup.Text>Pub. Name</InputGroup.Text>
                                <Form.Control type="text"></Form.Control>
                            </InputGroup>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3">
                            <InputGroup>
                                <InputGroup.Text>Question Number</InputGroup.Text>
                                <Form.Control value={questionCount + 1} readOnly></Form.Control>
                            </InputGroup>
                        </div>

                        <div className="col-md-12 mt-4 mb-4">
                            <label htmlFor="question-content" className="form-label">
                                Enter Question
                            </label>
                            <CKEditor
                                id="question-content"
                                name="question_content"
                                editor={ClassicEditor}
                                onChange={(e, editor) => {
                                    handleChange({
                                        target: {
                                            name: 'question_content',
                                            value: editor.getData(),
                                        },
                                    });
                                }}
                            />
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
                                {['A', 'B', 'C', 'D'].map((option) => (
                                    <div key={option}>
                                        <label htmlFor={`option-${option}`}>{option}</label>
                                        {toggleOptions ? (
                                            <div className="ckeditor">
                                                <CKEditor
                                                    id={`option-${option}`}
                                                    editor={ClassicEditor}
                                                    onChange={(e, editor) =>
                                                        handleChange({
                                                            target: {
                                                                name: `option_${option}`,
                                                                value: editor.getData(),
                                                            },
                                                        })
                                                    }
                                                    data={formData[`option_${option}`]}
                                                />
                                            </div>
                                        ) : (
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                id={`option-${option}`}
                                                name={`option_${option}`}
                                                onChange={(e) => handleChange(e)}
                                                value={formData[`option_${option}`]}>
                                                {formData[`option_${option}`]}
                                            </textarea>
                                        )}
                                    </div>
                                ))}

                                {showNewInputField ? (
                                    <>
                                        <div className="">
                                            <label htmlFor="option-E">E</label>
                                            {toggleOptions ? (
                                                <div className="ckeditor">
                                                    <CKEditor
                                                        id={`option-E`}
                                                        editor={ClassicEditor}
                                                        onChange={(e, editor) =>
                                                            handleChange({
                                                                target: {
                                                                    name: `option_E`,
                                                                    value: editor.getData(),
                                                                },
                                                            })
                                                        }
                                                        data={formData[`option_E`]}
                                                    />
                                                </div>
                                            ) : (
                                                <textarea
                                                    type="text"
                                                    className="form-control"
                                                    id={`option-E`}
                                                    name={`option_E`}
                                                    onChange={(e) => handleChange(e)}
                                                    value={formData[`option_E`]}>
                                                    {formData[`option_E`]}
                                                </textarea>
                                            )}
                                        </div>
                                        <button
                                            className="btn btn-danger"
                                            id="remove-new-option-btn"
                                            onClick={() =>
                                                setShowNewInputField(!showNewInputField)
                                            }>
                                            Remove
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-secondary"
                                        id="add-new-option-btn"
                                        onClick={() => setShowNewInputField(!showNewInputField)}>
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <InputGroup>
                                <InputGroup.Text>Correct Option</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    id="correct-option"
                                    name="correct-option"></Form.Control>
                            </InputGroup>
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
                                            data-bs-target="#accordion-target-explanation"
                                            aria-expanded="true"
                                            aria-controls="accordion-target-explanation">
                                            Add Explanation
                                        </button>
                                    </h2>
                                    <div
                                        id="accordion-target-explanation"
                                        className="accordion-collapse collapse show"
                                        data-bs-parent="#add-explanation-accordion">
                                        <div className="accordion-body">
                                            <CKEditor
                                                id={``}
                                                editor={ClassicEditor}
                                                onChange={(e, editor) =>
                                                    handleChange({
                                                        target: {
                                                            name: `explantion`,
                                                            value: editor.getData(),
                                                        },
                                                    })
                                                }
                                            />
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
                        onClick={() => {
                            setQuestionCount(questionCount + 1);
                            handleSaveQuestion();
                        }}>
                        Save
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddQuestionForm;
