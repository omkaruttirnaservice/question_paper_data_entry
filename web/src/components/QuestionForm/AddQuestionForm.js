import { useEffect, useRef, useState } from 'react';
import { notificationActions } from '../../Store/notification-slice';

import { useDispatch, useSelector } from 'react-redux';

import { ModalActions } from '../../Store/modal-slice.js';
import {
	QuestionFormActions,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/question-form-slice.js';
import useHttp from '../Hooks/use-http';
import CButton from '../UI/CButton.js';
import CModal from '../UI/CModal.js';
import ExplanationInput from './ExplanationInput.js';
import OptionsInput from './OptionsInput.js';
import addQuestionFormSchema from './addQuestionFormSchema.js';

const AddQuestionForm = () => {
	let {
		data: _formData,
		subjectsList,
		topicsList,
		questionNumber,
		errors,
	} = useSelector((state) => state.questionForm);
	const dispatch = useDispatch();

	const { sendRequest } = useHttp();

	const subjectNameRef = useRef();
	const topicNameRef = useRef();

	const [showNewInputField, setShowNewInputField] = useState(false);

	const handleChange = async (e) => {
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
				dispatch(notificationActions.showNotification('Something went wrong1'));
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
				dispatch(notificationActions.showNotification('Something went wrong2'));
			}
		});
	};

	const handleSaveQuestion = async (e) => {
		e.preventDefault();
		try {
			await addQuestionFormSchema.validate(_formData, { abortEarly: false });
			postQuestionData();

			dispatch(QuestionFormActions.setErrors({}));
		} catch (error) {
			const errorsObj = {};
			error.inner.forEach((el) => {
				errorsObj[el.path] = el.message;
			});
			dispatch(QuestionFormActions.setErrors(errorsObj));
		}
	};

	async function postQuestionData() {
		let reqData = {
			url: '/questions/add-question',
			method: 'POST',
			body: JSON.stringify(_formData),
		};
		sendRequest(reqData, (data) => {
			if (data.success == 1) {
				dispatch(
					notificationActions.showNotification('Successfully added question')
				);
			}
		});
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
				<label htmlFor="">Subject Name</label>
				<input type="text" name="subject_name" ref={subjectNameRef} />

				<CButton
					onClick={handleSubjectAdd}
					isLoading={useSelector((state) => state.loader.isLoading)}
				>
					Submit
				</CButton>
			</CModal>

			{/* add topic modal */}
			<CModal id={'add-topic-modal'} title={'Add Topic'}>
				<label htmlFor="">Selected Subject</label>
				<input
					type="text"
					value={subjectsList[_formData.subject_id - 1]?.subject_name}
					readOnly
				/>

				<label htmlFor="Topic Name"></label>
				<input type="text" name="topic_name" ref={topicNameRef} />

				<CButton
					onClick={handleAddTopic}
					isLoading={useSelector((state) => state.loader.isLoading)}
				>
					Submit
				</CButton>
			</CModal>

			<div className="container">
				<form id="add-question-form" className="" onSubmit={handleSaveQuestion}>
					<div className="">
						<div className="">
							<CButton
								onClick={() => {
									dispatch(ModalActions.toggleModal('add-subject-modal'));
								}}
							>
								+
							</CButton>
							<select id="subject-id" name="subject_id" onChange={handleChange}>
								<option value="-1" className="text-center" name="subject_id">
									-- Select Subject --
								</option>
								{subjectsList?.map((subject, i) => (
									<option key={i} value={subject.id}>
										{subject.subject_name}
									</option>
								))}
							</select>

							{errors.subject_id && (
								<div className=" error">{errors.subject_id}</div>
							)}
						</div>

						<div className="col-12 col-sm-6 col-lg-3">
							<CButton onClick={handleTopicAddModal}>+</CButton>
							<select name="topic_id" onChange={handleChange}>
								<option value="-1" className="text-center">
									-- Select topic --
								</option>
								{topicsList?.map((topic, i) => (
									<option key={i} value={topic.id}>
										{topic.topic_name}
									</option>
								))}
							</select>

							{errors.topic_id && (
								<div className=" error">{errors.topic_id}</div>
							)}
						</div>

						<div className="col-12 col-sm-6 col-lg-6">
							<label htmlFor="pub-name">Pub Name</label>
							<input
								type="text"
								onChange={handleChange}
								name="pub_name"
								value={_formData.pub_name}
							/>

							{errors.pub_name && (
								<div className=" error">{errors.pub_name}</div>
							)}
						</div>

						<div className="col-12 col-sm-6 col-lg-2">
							<label htmlFor="pg_no">Pg No</label>
							<input
								type="number"
								onChange={handleChange}
								name="pg_no"
								value={_formData.pg_no}
							/>
							{errors.pg_no && <div className=" error">{errors.pg_no}</div>}
						</div>

						<div className="col-12 col-sm-6 col-lg-3">
							<label htmlFor="question-number">Question Number</label>
							<input
								type="text"
								id="question-number"
								value={questionNumber}
								readOnly
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
								<OptionsInput
									showNewInputField={showNewInputField}
									setShowNewInputField={setShowNewInputField}
								/>
							</div>
						</div>
						<div className="col-md-3">
							<label htmlFor="correct-option">Correct Option</label>

							<input
								type="text"
								id="correct-option"
								className="text-uppercase"
								name="correct_option"
								onChange={handleChange}
								value={_formData.correct_option}
								maxLength="1"
							/>

							{errors.correct_option && (
								<div className="error">{errors.correct_option}</div>
							)}
						</div>

						<ExplanationInput />
					</div>

					<CButton
						type="submit"
						isLoading={useSelector((state) => state.loader.isLoading)}
					>
						Save
					</CButton>
				</form>
			</div>
		</>
	);
};

export default AddQuestionForm;
