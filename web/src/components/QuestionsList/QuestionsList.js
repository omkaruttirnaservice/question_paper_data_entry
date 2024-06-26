import './questionsList.css';

import react, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import Loader from '../UI/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { loaderActions } from '../../Store/loader-slice';
import { notificationActions } from '../../Store/notification-slice';
import { useNavigate } from 'react-router-dom';
import CButton from '../UI/CButton.js';

function QuestionsList() {
	const navigate = useNavigate();
	const [subjects, setSubjects] = useState([]);
	const [topics, setTopics] = useState([]);
	const [questionsList, setQuestionsList] = useState([]);

	const [selectedSubject, setSelectedSubject] = useState('');
	const [selectedTopic, setSelectedTopic] = useState('');

	// REDUX STATES
	const loader = useSelector((state) => state.loader.isLoading);

	const dispatch = useDispatch();

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
	}, [subjects]);

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
		dispatch(loaderActions.showLoader());
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
			console.log(data, '==data==');
		}
		dispatch(loaderActions.hideLoader());
	}

	const handleEditQuestion = (questionId) => {
		navigate(`/question-form?forUpdate=true&questionId=${questionId}`);
	};

	const handleDeleteQuestion = async (questionId) => {
		console.log(questionId, 'que id delete');
		try {
			let response = await fetch('/questions/delete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ questionId }),
			});
			let { success, data } = await response.json();
			if (success === 1) {
				setQuestionsList(
					questionsList.filter((que) => {
						return que.id !== questionId;
					})
				);
				dispatch(
					notificationActions.showNotification('Successfully deleted question.')
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
						<select
							name=""
							className="form-control"
							onChange={handleSubjectChange}
						>
							<option value="">-- Select Subject --</option>
							{subjects?.map((subject) => (
								<option
									key={subject.id}
									value={subject.id}
									data-subject_name={subject.subject_name}
								>
									{subject.subject_name}
								</option>
							))}
						</select>
					</div>
					<div className="col-md-2">
						{/* TOPIC LIST */}
						<select
							name=""
							className="form-control"
							onChange={handleTopicChange}
						>
							<option value="">-- Select Topic --</option>
							{topics?.map((topic) => (
								<option
									key={topic.id}
									value={topic.id}
									data-topic_name={topic.topic_name}
								>
									{topic.topic_name}
								</option>
							))}
						</select>
					</div>

					<div className="col-md-2">
						<CButton isLoading={loader} onClick={handleSearchQuestions}>
							Search
						</CButton>
					</div>
				</div>

				<Table bordered>
					<thead>
						<tr>
							<th width="8%">SR NO</th>
							<th>Question</th>
							<th>Option A</th>
							<th>Option B</th>
							<th>Option C</th>
							<th>Option D</th>
							<th>Correct Option</th>
							<th width="8%">Topic</th>
							<th width="8%">Subject</th>
							<th width="5%">Edit</th>
							<th width="5%">Delete</th>
						</tr>
					</thead>

					<tbody>
						{questionsList.length >= 1 &&
							questionsList?.map((question, i) => {
								return (
									<tr key={question.id}>
										<td>{i + 1}</td>
										<td
											dangerouslySetInnerHTML={{
												__html: question.question_content,
											}}
										></td>
										<td
											dangerouslySetInnerHTML={{ __html: question.option_A }}
										></td>
										<td
											dangerouslySetInnerHTML={{ __html: question.option_B }}
										></td>
										<td
											dangerouslySetInnerHTML={{ __html: question.option_C }}
										></td>

										<td
											dangerouslySetInnerHTML={{ __html: question.option_D }}
										></td>
										<td>{question.correct_option}</td>
										<td>{question.subject_name}</td>
										<td>{question.topic_name}</td>
										<td className="text-center">
											<i
												type="button"
												className="fa-solid fa-pen-to-square btn-sm text-success"
												onClick={() => handleEditQuestion(question.id)}
											></i>
										</td>
										<td className="text-center">
											<i
												type="button"
												className="btn text-danger btn-sm fa-solid fa-trash"
												onClick={() => {
													// handleDeleteQuestion.bind(null, question.id);
													handleDeleteQuestion(question.id);
												}}
											></i>
										</td>
									</tr>
								);
							})}
					</tbody>
				</Table>
				{selectedSubject !== '' &&
					selectedTopic !== '' &&
					questionsList.length === 0 && (
						<p className="text-center fw-bold text-danger">
							Nothing but crickets.{' '}
						</p>
					)}
				{selectedSubject === '' && (
					<p className="text-center fw-bold text-danger">
						Please select the subject
					</p>
				)}
				{selectedSubject !== '' && selectedTopic === '' && (
					<p className="text-center fw-bold text-danger">
						Please select the topic
					</p>
				)}
				{loader && <Loader />}
			</div>
		</>
	);
}

export default QuestionsList;
