import { useEffect, useState } from 'react';
import { notificationActions } from '../../Store/notification-slice';

import { FaPlus } from 'react-icons/fa6';

import { useDispatch, useSelector } from 'react-redux';

import { ModalActions } from '../../Store/modal-slice.js';
import {
	QuestionFormActions,
	getBooksListThunk,
	getPostListThunk,
	getPublicationsListThunk,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/question-form-slice.js';
import useHttp from '../Hooks/use-http';
import CButton from '../UI/CButton.js';
import AddBookModal from './AddBook/AddBookModal.js';
import AddPostModal from './AddPost/AddPostModal.js';
import AddPublicationModal from './AddPublication/AddPublicationModal.js';
import AddSubjectModal from './AddSubject/AddSubjectModal.js';
import AddTopicFormModal from './AddTopic/AddTopicModal.js';
import ExplanationInput from './ExplanationInput.js';
import OptionsInput from './OptionsInput.js';
import QuestionPreview from './QuestionPreview/QuestionPreview.js';
import addQuestionFormSchema from './addQuestionFormSchema.js';

const AddQuestionForm = () => {
	// prettier-ignore
	const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', ];
	const [years, setYears] = useState([]);

	useState(() => {
		let _y = [];
		let _currentYear = new Date().getFullYear();
		for (let i = _currentYear; i >= 2000; i--) {
			_y.push(i);
		}
		setYears(_y);
	}, []);

	let {
		data: _formData,
		subjectsList,
		topicsList,
		errors,
		postsList,
		publicationsList,
		bookNamesList,
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
		dispatch(getPublicationsListThunk(sendRequest));
		dispatch(getPostListThunk());
		getQuestionNumber();
	}, []);

	useEffect(() => {
		getSubjectList();
	}, [_formData.post_id]);

	useEffect(() => {
		getTopicList();
	}, [_formData.subject_id]);

	useEffect(() => {
		dispatch(getBooksListThunk(_formData.pub_name, sendRequest));
	}, [_formData.pub_name]);

	const handleSaveQuestion = async (e) => {
		e.preventDefault();
		try {
			await addQuestionFormSchema.validate(_formData, { abortEarly: false });
			postQuestionData();

			dispatch(QuestionFormActions.setErrors({}));
		} catch (error) {
			console.log({ ...error }, '-here======');
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

	const handleAddPulicationModal = () => {
		dispatch(ModalActions.toggleModal('add-publication-modal'));
	};

	const handleAddBookModal = () => {
		dispatch(ModalActions.toggleModal('add-book-modal'));
	};

	return (
		<>
			<QuestionPreview />
			{/* add post modal */}
			<AddPostModal />
			{/* add subject modal  */}
			<AddSubjectModal />
			{/* add topic modal */}
			<AddTopicFormModal />
			{/* add publication modal */}
			<AddPublicationModal />
			{/* add book modal */}
			<AddBookModal />
			<div className="container mx-auto px-10 mt-6 pb-10 ">
				<form
					id="add-question-form"
					className="grid gap-10"
					onSubmit={handleSaveQuestion}>
					{/* view question button */}

					<div className={`bg-white pb-6 observe-container sticky top-0 z-40`}>
						<div className="grid grid-cols-4 gap-6 mb-8">
							<div className="flex flex-col gap-1 relative">
								<label htmlFor="">Post</label>
								<div className="flex">
									<CButton onClick={handlePostAddModal} icon={<FaPlus />} />
									<select
										id="post-id"
										className="input-el grow w-48"
										name="post_id"
										onChange={handleChange}>
										<option value="" className="" name="">
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
								{errors.post_id && (
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
										<option value="" className="" name="subject_id">
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
								<label htmlFor="">Topic</label>
								<div className="flex">
									<CButton onClick={handleTopicAddModal} icon={<FaPlus />} />
									<select
										className="input-el grow w-48"
										name="topic_id"
										onChange={handleChange}>
										<option value="" className="">
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

							<div className="flex flex-col gap-1 relative">
								<label htmlFor="">Difficulty</label>
								<div className="flex">
									<select
										className="input-el grow w-48"
										name="difficulty"
										onChange={handleChange}>
										<option value="" className="">
											-- Select --
										</option>
										<option value="1">Easy</option>
										<option value="2">Medium</option>
										<option value="3">Hard</option>
									</select>
								</div>

								{errors.difficulty && (
									<div className=" error">{errors.difficulty}</div>
								)}
							</div>
						</div>
						<div className="grid grid-cols-5 gap-6 ">
							<div className="flex flex-col gap-1 relative ">
								<label htmlFor="pub-name">Publication Name</label>

								<div className="flex">
									<CButton
										onClick={handleAddPulicationModal}
										icon={<FaPlus />}
									/>
									<select
										className="input-el grow"
										type="text"
										onChange={handleChange}
										name="pub_name"
										value={_formData.pub_name}>
										<option value="">-- Select --</option>
										{publicationsList.length >= 1 &&
											publicationsList.map((el) => {
												return (
													<option value={el.msq_publication_name}>
														{el.msq_publication_name}
													</option>
												);
											})}
									</select>
								</div>
								{errors.pub_name && (
									<div className=" error">{errors.pub_name}</div>
								)}
							</div>

							<div className="flex flex-col gap-1 relative ">
								<label htmlFor="pub-name">Book Name</label>

								<div className="flex">
									<CButton onClick={handleAddBookModal} icon={<FaPlus />} />
									<select
										className="input-el grow"
										type="text"
										onChange={handleChange}
										name="book_name"
										value={_formData.book_name}>
										<option value="">-- Select --</option>
										{bookNamesList.length >= 1 &&
											bookNamesList.map((el) => {
												return (
													<option value={el.msq_book_name}>
														{el.msq_book_name}
													</option>
												);
											})}
									</select>
								</div>
								{errors.book_name && (
									<div className=" error">{errors.book_name}</div>
								)}
							</div>

							<div className="flex flex-col gap-1 relative">
								<label htmlFor="pg_no">Page No</label>
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

							<div className="flex flex-col gap-1 relative">
								<label htmlFor="">Month</label>
								<div className="flex">
									<select
										className="input-el grow w-48"
										name="month"
										onChange={handleChange}>
										<option value="" className="">
											-- Select --
										</option>
										{months.map((el) => {
											return <option value={el}>{el}</option>;
										})}
									</select>
								</div>

								{errors.month && <div className=" error">{errors.month}</div>}
							</div>

							<div className="flex flex-col gap-1 relative">
								<label htmlFor="">Year</label>
								<div className="flex">
									<select
										className="input-el grow w-48"
										name="year"
										onChange={handleChange}>
										<option value="" className="">
											-- Select --
										</option>
										{years.length >= 1 &&
											years.map((_y) => {
												return <option value={_y}>{_y}</option>;
											})}
									</select>
								</div>

								{errors.month && <div className=" error">{errors.month}</div>}
							</div>
						</div>
					</div>

					<hr />

					<div className="">
						<div className="flex flex-col gap-10">
							<OptionsInput
								showNewInputField={showNewInputField}
								setShowNewInputField={setShowNewInputField}
							/>
						</div>
					</div>

					<hr />

					<ExplanationInput />

					<CButton
						className="w-[10%] flex justify-center items-center"
						type="submit"
						isLoading={useSelector((state) => state.loader.isLoading)}>
						Save
					</CButton>
				</form>
			</div>
		</>
	);
};

export default AddQuestionForm;
