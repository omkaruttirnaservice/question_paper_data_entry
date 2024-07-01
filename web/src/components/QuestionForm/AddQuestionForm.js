import { useEffect, useState } from 'react';
import { notificationActions } from '../../Store/notification-slice';

import { useDispatch, useSelector } from 'react-redux';
import { FaP, FaPlus } from 'react-icons/fa6';

import { ModalActions } from '../../Store/modal-slice.js';
import {
	QuestionFormActions,
	getPostListThunk,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/question-form-slice.js';
import useHttp from '../Hooks/use-http';
import CButton from '../UI/CButton.js';
import AddPostModal from './AddPost/AddPostModal.js';
import AddSubjectModal from './AddSubject/AddSubjectModal.js';
import AddTopicFormModal from './AddTopic/AddTopicModal.js';
import addQuestionFormSchema from './addQuestionFormSchema.js';
import OptionsInput from './OptionsInput.js';
import ExplanationInput from './ExplanationInput.js';

const AddQuestionForm = () => {
	let {
		data: _formData,
		subjectsList,
		topicsList,
		questionNumber,
		errors,
		postsList,
	} = useSelector((state) => state.questionForm);
	const dispatch = useDispatch();

	const { sendRequest } = useHttp();

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
		dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
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
		dispatch(getPostListThunk());
		getQuestionNumber();
	}, []);

	useEffect(() => {
		getSubjectList();
	}, [_formData.post_id]);

	useEffect(() => {
		getTopicList();
	}, [_formData.subject_id]);

	const handleSaveQuestion = async (e) => {
		console.log(1);
		e.preventDefault();
		try {
			console.log(2);
			await addQuestionFormSchema.validate(_formData, { abortEarly: false });
			console.log(3);
			postQuestionData();

			dispatch(QuestionFormActions.setErrors({}));
		} catch (error) {
			console.log(error.inner);
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

	const handlePostAddModal = () => {
		dispatch(ModalActions.toggleModal('add-post-modal'));
	};

	const handleSubjectAddModal = () => {
		if (_formData.post_id === '-1' || _formData.post_id === null) {
			dispatch(notificationActions.showNotification('Please select post.'));
			return;
		}
		dispatch(ModalActions.toggleModal('add-subject-modal'));
	};

	const handleTopicAddModal = () => {
		if (_formData.subject_id === '-1' || _formData.subject_id === null) {
			dispatch(notificationActions.showNotification('Please select subject.'));
			return;
		}
		dispatch(ModalActions.toggleModal('add-topic-modal'));
	};

	return (
		<>
			{/* add post modal */}
			<AddPostModal />
			{/* add subject modal  */}
			<AddSubjectModal />
			{/* add topic modal */}
			<AddTopicFormModal />
			<div className="container mx-auto px-10 mt-6 pb-10">
				<form
					id="add-question-form"
					className="grid gap-10"
					onSubmit={handleSaveQuestion}>
					<div className="flex flex-col items-start">
						<span className="bg-blue-500 px-3 py-2 w-fit rounded-full text-white font-bold">
							{questionNumber}
						</span>
					</div>

					<div className="flex gap-10">
						<div className="flex flex-col gap-1 relative">
							<label htmlFor="">Post</label>
							<div className="flex">
								<CButton onClick={handlePostAddModal} icon={<FaPlus />} />
								<select
									id="post-id"
									className="input-el grow w-48"
									name="post_id"
									onChange={handleChange}>
									<option value="-1" className="" name="">
										-- Select --
									</option>
									{postsList.length >= 1 &&
										postsList?.map((subject, i) => (
											<option key={i} value={subject.id}>
												{subject.mtl_test_name}
											</option>
										))}
								</select>
							</div>
							{errors.subject_id && (
								<div className=" error">{errors.post_id}</div>
							)}
						</div>

						<div className="flex flex-col gap-1 relative">
							<label htmlFor="">Subject</label>
							<div className="flex">
								<CButton onClick={handleSubjectAddModal} icon={<FaPlus />} />
								<select
									id="subject-id"
									className="input-el grow w-48"
									name="subject_id"
									onChange={handleChange}>
									<option value="-1" className="" name="subject_id">
										-- Select --
									</option>
									{subjectsList.length >= 1 &&
										subjectsList?.map((subject, i) => (
											<option key={i} value={subject.id}>
												{subject.mtl_name}
											</option>
										))}
								</select>
							</div>
							{errors.subject_id && (
								<div className=" error">{errors.subject_id}</div>
							)}
						</div>

						<div className="flex flex-col gap-1 relative">
							<label htmlFor="">Select Topic</label>
							<div className="flex">
								<CButton onClick={handleTopicAddModal} icon={<FaPlus />} />
								<select
									className="input-el grow w-48"
									name="topic_id"
									onChange={handleChange}>
									<option value="-1" className="">
										-- Select --
									</option>
									{topicsList?.map((topic, i) => (
										<option key={i} value={topic.id}>
											{topic.topic_name}
										</option>
									))}
								</select>
							</div>

							{errors.topic_id && (
								<div className=" error">{errors.topic_id}</div>
							)}
						</div>

						<div className="flex flex-col gap-1 relative ">
							<label htmlFor="pub-name">Pub Name</label>
							<input
								className="input-el grow"
								type="text"
								onChange={handleChange}
								name="pub_name"
								value={_formData.pub_name}
							/>

							{errors.pub_name && (
								<div className=" error">{errors.pub_name}</div>
							)}
						</div>

						<div className="flex flex-col gap-1 relative">
							<label htmlFor="pg_no">Pg No</label>
							<input
								className="input-el grow"
								type="number"
								min="0"
								onChange={handleChange}
								name="pg_no"
								value={_formData.pg_no}
							/>
							{errors.pg_no && <div className=" error">{errors.pg_no}</div>}
						</div>
					</div>

					<div className="">
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
						<div className="flex flex-col gap-10">
							<OptionsInput
								showNewInputField={showNewInputField}
								setShowNewInputField={setShowNewInputField}
							/>
						</div>
					</div>
					<div className="flex flex-col relative">
						<label htmlFor="correct-option">Correct Option</label>

						<input
							type="text"
							id="correct-option"
							className="input-el w-fit"
							name="correct_option"
							onChange={handleChange}
							value={_formData.correct_option}
							maxLength="1"
						/>

						{errors.correct_option && (
							<div className="error">{errors.correct_option}</div>
						)}
					</div>

					<hr />

					<ExplanationInput />

					<hr />

					<CButton
						className="w-[10%] flex justify-center items-center"
						type="submit"
						isLoading={useSelector((state) => state.loader.isLoading)}>
						Save
					</CButton>
				</form>
			</div>
			toast('hi')
		</>
	);
};

export default AddQuestionForm;
