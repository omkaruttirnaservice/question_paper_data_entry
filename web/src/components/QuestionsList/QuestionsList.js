import './questionsList.css';
import { FaRegTrashAlt } from 'react-icons/fa';
import { GoPencil } from 'react-icons/go';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loaderActions } from '../../Store/loader-slice';
import { notificationActions } from '../../Store/notification-slice';
import {
	QuestionFormActions,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/question-form-slice.js';
import useHttp from '../Hooks/use-http.js';
import CButton from '../UI/CButton.js';
import Loader from '../UI/Loader/Loader';

function QuestionsList() {
	const navigate = useNavigate();
	const [questionsList, setQuestionsList] = useState([]);

	const [selectedSubject, setSelectedSubject] = useState('');
	const [selectedTopic, setSelectedTopic] = useState('');

	// REDUX STATES
	const { subjectsList, topicsList } = useSelector(
		(state) => state.questionForm
	);
	const loader = useSelector((state) => state.loader.isLoading);

	const { sendRequest } = useHttp();

	const dispatch = useDispatch();

	const getSubjectList = async () => {
		dispatch(getSubjectsListThunk());
	};

	const getTopicList = async () => {
		dispatch(getTopicsListThunk(selectedSubject, sendRequest));
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

	const handleEditQuestion = (question) => {
		dispatch(QuestionFormActions.setEditQuestionDetails(question));
		navigate('/edit-question-form');
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
			<div className="px-3 mt-4">
				<div className="grid grid-cols-3 gap-3 mb-6">
					<div className="">
						{/* SUBJECT LIST */}
						<select
							name=""
							className="form-control"
							onChange={handleSubjectChange}
						>
							<option value="">-- Select Subject --</option>
							{subjectsList.length >= 1 &&
								subjectsList?.map((subject) => (
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

					<div className="">
						{/* TOPIC LIST */}
						<select
							name=""
							className="form-control"
							onChange={handleTopicChange}
						>
							<option value="">-- Select Topic --</option>
							{topicsList.length >= 1 &&
								topicsList?.map((topic) => (
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

					<div className="">
						<CButton isLoading={loader} onClick={handleSearchQuestions}>
							Search
						</CButton>
					</div>
				</div>

				<div className="overflow-auto mx-2 mt-6">
					<table className="w-[100%] question-list-table">
						<thead>
							<tr>
								<th className="text-center">#</th>
								<th>Question</th>
								<th>Option A</th>
								<th>Option B</th>
								<th>Option C</th>
								<th>Option D</th>
								<th>Correct Option</th>
								<th>Subject</th>
								<th>Topic</th>
								<th>Edit</th>
								<th>Delete</th>
							</tr>
						</thead>

						<tbody>
							{questionsList.length >= 1 &&
								questionsList?.map((question, i) => {
									return (
										<tr key={question.id}>
											<td className="text-center">{i + 1}</td>
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
												<CButton
													varient="btn--success"
													icon={<GoPencil />}
													onClick={() => handleEditQuestion(question)}
												></CButton>
											</td>
											<td className="text-center">
												<CButton
													varient="btn--danger"
													icon={<FaRegTrashAlt />}
													onClick={() => {
														handleDeleteQuestion(question.id);
													}}
												></CButton>
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
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
