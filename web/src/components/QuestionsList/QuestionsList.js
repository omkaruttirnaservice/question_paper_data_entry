import react, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import './questionsList.css';
import Loader from '../UI/Loader/Loader';
function QuestionsList() {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [questionsList, setQuestionsList] = useState([]);

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');

    const [loader, setLoader] = useState(false);

    const getSubjectList = async () => {
        let response = await fetch('/get-subject-list');
        let { success, data } = await response.json();

        if (success === 1) {
            setSubjects(data[0]);
        }
    };

    const getTopicList = async () => {
        let response = await fetch('/get-topic-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subjectId: selectedSubject }),
        });
        let { data } = await response.json();
        setTopics(data);
    };

    useEffect(() => {
        getSubjectList();
    }, []);

    useEffect(() => {
        getTopicList();
    }, [selectedSubject]);

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleTopicChange = (e) => {
        setSelectedTopic(e.target.value);
    };

    const handleSearchQuestions = (e) => {
        e.preventDefault();

        if (selectedSubject === '') {
            alert('Please select subject');
            return;
        }
        if (selectedTopic === '') {
            alert('Please select topic');
            return;
        }

        getQuestionsList(selectedSubject, selectedTopic);
    };

    async function getQuestionsList(subjectId, topicId) {
        setLoader(true);
        let response = await fetch('/questions/get-question-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subjectId, topicId }),
        });

        let { success, data } = await response.json();

        if (success === 1) {
            setQuestionsList(data);
            setLoader(false);
        }
    }

    const handleDeleteQuestion = async (questionId) => {
        try {
            let response = await fetch('/questions/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                bodya: JSON.stringify({ questionId }),
            });
            let { success, data } = await response.json();
            if (success === 1) {
                // TODO (OMKAR): SHOW NOTIFICATION AFTER SUCCESSFUL DELETION
                setQuestionsList(
                    questionsList.filter((que) => {
                        return que.id !== questionId;
                    })
                );
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <div className="container mt-4">
                <div className="row mb-4">
                    <div className="col-md-2">
                        {/* SUBJECT LIST */}
                        <select name="" className="form-control" onChange={handleSubjectChange}>
                            <option value="">-- Select Subject --</option>
                            {subjects?.map((subject) => (
                                <option value={subject.id}>{subject.subject_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        {/* TOPIC LIST */}
                        <select name="" className="form-control" onChange={handleTopicChange}>
                            <option value="">-- Select Topic --</option>
                            {topics?.map((topic) => (
                                <option value={topic.id}>{topic.topic_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <Button verient="primary" onClick={handleSearchQuestions}>
                            Search
                        </Button>
                    </div>
                </div>

                <Table bordered>
                    <thead>
                        <tr>
                            <th width="8%">SR NO</th>
                            <th>Question</th>
                            <th width="8%">Topic</th>
                            <th width="8%">Subject</th>
                            <th width="5%">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {questionsList.map((question, i) => {
                            return (
                                <tr>
                                    <td>{i + 1}</td>
                                    <td>{question.question_content}</td>
                                    <td>{question.subject_name}</td>
                                    <td>{question.topic_name}</td>
                                    <td className="text-center">
                                        <i
                                            type="button"
                                            className="btn text-danger btn-sm fa-solid fa-trash"
                                            onClick={() => {
                                                handleDeleteQuestion.bind(null, question.id);
                                            }}></i>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                {selectedSubject !== '' && selectedTopic !== '' && questionsList.length === 0 && (
                    <p>Nothing but crickets. </p>
                )}
                {selectedSubject === '' && <p>Please select the subject</p>}
                {selectedSubject !== '' && selectedTopic === '' && <p>Please select the topic</p>}
                {loader && <Loader />}
            </div>
        </>
    );
}

export default QuestionsList;
