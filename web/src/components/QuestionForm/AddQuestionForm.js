import { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { notificationActions } from '../../Store/notification-slice';

import { useDispatch, useSelector } from 'react-redux';

// CSS IMPORT
import './addQuestionForm.css';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import { ModalActions } from '../../Store/modal-slice.js';
import useHttp from '../Hooks/use-http';
import CModal from '../UI/CModal.js';
import CButton from '../UI/CButton.js';
import {
	QuestionFormActions,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/question-form-slice.js';
import InputCkEditor from './InputCkEditor.js';

const AddQuestionForm = () => {
	let {
		data: _formData,
		subjectsList,
		topicsList,
		questionNumber,
	} = useSelector((state) => state.questionForm);
	const dispatch = useDispatch();

	const { sendRequest } = useHttp();

	const subjectNameRef = useRef();
	const topicNameRef = useRef();

	const [showNewInputField, setShowNewInputField] = useState(false);

	const handleChange = (e) => {
		dispatch(
			QuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};

	const getSubjectList = async () => {
		dispatch(getSubjectsListThunk());
	};

	const getTopicList = async () => {
		dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
	};

	const getQuestionNumber = async () => {
		let response = await fetch('/questions/get-question-number');
		let { data } = await response.json();
		dispatch(QuestionFormActions.setQuestionNumber(data.total_questions));
	};

	useEffect(() => {
		getSubjectList();
		getQuestionNumber();
	}, []);

	useEffect(() => {
		getTopicList();
	}, [_formData.subject_id]);

	const handleSubjectAdd = async () => {
		let subjectName = subjectNameRef.current.value;
		if (!subjectName) {
			dispatch(
				notificationActions.showNotification('Please enter subject name')
			);
			return;
		}

		const requestData = {
			url: '/add-subject',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectName }),
		};
		sendRequest(requestData, (data) => {
			dispatch(ModalActions.toggleModal('add-subject-modal'));
			if (data.success === 1) {
				dispatch(
					notificationActions.showNotification('Subject added successfully')
				);
				getSubjectList();
			} else {
				dispatch(notificationActions.showNotification('Something went wrong'));
			}
		});
	};

	const handleAddTopic = async () => {
		let subjectId = _formData.subject_id;
		let topicName = topicNameRef.current.value;

		if (!topicName) {
			dispatch(notificationActions.showNotification('Please enter topic name'));
			return;
		}

		const requestData = {
			url: '/add-topic',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectId, topicName }),
		};
		sendRequest(requestData, (data) => {
			dispatch(ModalActions.toggleModal('add-topic-modal'));
			if (data.success === 1) {
				dispatch(
					notificationActions.showNotification('Successfully added new topic')
				);
				getTopicList();
			} else {
				dispatch(notificationActions.showNotification('Something went wrong'));
			}
		});
	};

	const handleSaveQuestion = async () => {
		checkFormDetailsEmpty(_formData, (data) => {
			if (data === true) {
				postQuestionData();
			}
		});
	};

	const checkFormDetailsEmpty = (data, cb) => {
		if (data.subject_id === '-1') {
			dispatch(notificationActions.showNotification(`Please select subject`));
		} else if (data.topic_id === '-1') {
			dispatch(notificationActions.showNotification(`Please select topic`));
		} else if (data.question_content === '') {
			dispatch(notificationActions.showNotification(`Please enter question`));
		} else if (data.option_A === '') {
			dispatch(notificationActions.showNotification(`Please enter option A`));
		} else if (data.option_B === '') {
			dispatch(notificationActions.showNotification(`Please enter option B`));
		} else if (data.option_C === '') {
			dispatch(notificationActions.showNotification(`Please enter option C`));
		} else if (data.option_D === '') {
			dispatch(notificationActions.showNotification(`Please enter option D`));
		} else if (data.correct_option === '') {
			dispatch(
				notificationActions.showNotification(`Please enter correct option`)
			);
		} else {
			cb(true);
		}
	};

	async function postQuestionData() {
		// Send data using Fetch API or any other method
		try {
			let response = await fetch('/questions/add-question', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(_formData),
			});
			let { success, data } = await response.json();
			if (success === 0) {
				throw new Error(data);
			}
			dispatch(
				notificationActions.showNotification('Successfully submitted question')
			);
		} catch (error) {
			alert(error.message);
		}
	}
	const handleTopicAddModal = () => {
		if (_formData.subject_id === '-1' || _formData.subject_id === null) {
			dispatch(notificationActions.showNotification('Please select subject.'));
			return;
		}
		dispatch(ModalActions.toggleModal('add-topic-modal'));
	};

	return (
		<>
			{/* add subject modal  */}
			<CModal id={'add-subject-modal'} title={'Add Subject'}>
				<InputGroup>
					<InputGroup.Text>Subject Name</InputGroup.Text>
					<Form.Control type="text" name="subject_name" ref={subjectNameRef} />
				</InputGroup>

				<CButton
					onClick={handleSubjectAdd}
					isLoading={useSelector((state) => state.loader.isLoading)}
				>
					Submit
				</CButton>
			</CModal>

			{/* add topic modal */}
			<CModal id={'add-topic-modal'} title={'Add Topic'}>
				<InputGroup>
					<InputGroup.Text>Selected Subject</InputGroup.Text>
					<Form.Control
						type="text"
						value={subjectsList[_formData.subject_id - 1]?.subject_name}
						readOnly
					/>
				</InputGroup>
				<InputGroup className="mt-3">
					<InputGroup.Text>Topic Name</InputGroup.Text>
					<Form.Control type="text" name="topic_name" ref={topicNameRef} />
				</InputGroup>

				<CButton
					onClick={handleAddTopic}
					isLoading={useSelector((state) => state.loader.isLoading)}
				>
					Submit
				</CButton>
			</CModal>

			<div className="container">
				<form id="add-question-form" className="">
					<div className="row g-3">
						<div className="col-12 col-sm-6 col-lg-3">
							<InputGroup>
								<InputGroup.Text>
									<Button
										className="btn p-0 px-1 btn-secondary btn-sm"
										onClick={() => {
											dispatch(ModalActions.toggleModal('add-subject-modal'));
										}}
									>
										<i className="fa-solid fa-plus"></i>
									</Button>
								</InputGroup.Text>

								<Form.Select
									id="subject-id"
									name="subject_id"
									onChange={handleChange}
								>
									<option value="-1" className="text-center">
										-- Select Subject --
									</option>
									{subjectsList?.map((subject, i) => (
										<option key={i} value={subject.id}>
											{subject.subject_name}
										</option>
									))}
								</Form.Select>
							</InputGroup>
						</div>

						<div className="col-12 col-sm-6 col-lg-3">
							<InputGroup>
								<InputGroup.Text>
									<Button
										className="btn p-0 px-1 btn-secondary btn-sm"
										onClick={handleTopicAddModal}
									>
										<i className="fa-solid fa-plus"></i>
									</Button>
								</InputGroup.Text>
								<Form.Select name="topic_id" onChange={handleChange}>
									<option value="-1" className="text-center">
										-- Select topic --
									</option>
									{topicsList?.map((topic, i) => (
										<option key={i} value={topic.id}>
											{topic.topic_name}
										</option>
									))}
								</Form.Select>
							</InputGroup>
						</div>

						<div className="col-12 col-sm-6 col-lg-6">
							<InputGroup>
								<InputGroup.Text>Pub. Name</InputGroup.Text>
								<Form.Control
									type="text"
									onChange={handleChange}
									name="pub_name"
									value={_formData.pub_name}
								></Form.Control>
							</InputGroup>
						</div>

						<div className="col-12 col-sm-6 col-lg-2">
							<InputGroup>
								<InputGroup.Text>Pg No</InputGroup.Text>
								<Form.Control
									type="number"
									onChange={handleChange}
									name="pg_no"
									value={_formData.pg_no}
								></Form.Control>
							</InputGroup>
						</div>

						<div className="col-12 col-sm-6 col-lg-3">
							<InputGroup>
								<InputGroup.Text>Question Number</InputGroup.Text>
								<Form.Control value={questionNumber} readOnly></Form.Control>
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
							{/* <div className="mt-2 d-flex align-items-center gap-2">
								Text Editor{' '}
								<span
									className="toggle-options-editor"
									onClick={() => setToggleOptions(!toggleOptions)}
								>
									{toggleOptions ? (
										<i className="fa-solid fa-toggle-on text-success"></i>
									) : (
										<i className="fa-solid fa-toggle-off"></i>
									)}
								</span>
							</div> */}
							<div className="form-options">
								{['A', 'B', 'C', 'D'].map((option) => (
									<InputCkEditor
										option={option}
										handleChange={handleChange}
										_formData={_formData}
									/>
								))}

								{showNewInputField ? (
									<>
										<InputCkEditor
											option={'E'}
											handleChange={handleChange}
											_formData={_formData}
										/>

										<button
											className="btn btn-danger"
											id="remove-new-option-btn"
											onClick={() => setShowNewInputField(!showNewInputField)}
										>
											Remove
										</button>
									</>
								) : (
									<button
										className="btn btn-secondary"
										id="add-new-option-btn"
										onClick={() => setShowNewInputField(!showNewInputField)}
									>
										Add option
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
									className="text-uppercase"
									name="correct_option"
									onChange={handleChange}
									value={_formData.correct_option}
									maxLength="1"
								></Form.Control>
							</InputGroup>
						</div>

						<div className="col-md-12 mt-3">
							<div
								className="accordion accordion-flush"
								id="add-explanation-accordion"
							>
								<div className="accordion-item">
									<h2 className="accordion-header">
										<button
											className="accordion-button"
											type="button"
											data-bs-toggle="collapse"
											data-bs-target="#accordion-target-explanation"
											aria-expanded="true"
											aria-controls="accordion-target-explanation"
										>
											Add Explanation
										</button>
									</h2>
									<div
										id="accordion-target-explanation"
										className="accordion-collapse collapse show"
										data-bs-parent="#add-explanation-accordion"
									>
										<div className="accordion-body">
											<CKEditor
												id={`explanation`}
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
						onClick={handleSaveQuestion}
					>
						Save
					</button>
				</form>
			</div>
		</>
	);
};

export default AddQuestionForm;
