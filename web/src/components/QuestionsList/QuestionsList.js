import react, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import './questionsList.css';

function QuestionsList() {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [questionsList, setQuestionsList] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState([]);

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
            body: JSON.stringify({ subjectId: selectedSubject.id }),
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
        setSelectedSubject(subjects[e.target.value - 1]);
    };

    const handleTopicChange = (e) => {
        setSelectedTopic(topics[e.target.value - 1]);
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

        getQuestionsList(selectedSubject.id, selectedTopic.id);
    };

    async function getQuestionsList(subjectId, topicId) {
        let response = await fetch('/get-question-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subjectId, topicId }),
        });
        let { success, data } = await response.json();
    }

    return (
        <>
            <div className="row">
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
                    </tr>
                </thead>

                <tbody>
                    {questionsList?.map((question) => {
                        <tr>
                            <td>1</td>
                            <td>Tset question 1</td>
                            <td>Living organism</td>
                            <td>Biology</td>
                        </tr>;
                    })}
                </tbody>
            </Table>
        </>
    );
}

export default QuestionsList;
