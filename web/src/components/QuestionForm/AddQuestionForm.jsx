import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import {
	QuestionFormActions,
	getBooksListThunk,
	getPostListThunk,
	getPublicationsListThunk,
	getQuestionNumberThunk,
	getSubjectsListThunk,
	getTopicsListThunk,
} from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import AddBookModal from './AddBook/AddBookModal.jsx';
import AddPostModal from './AddPost/AddPostModal.jsx';
import AddPublicationModal from './AddPublication/AddPublicationModal.jsx';
import AddSubjectModal from './AddSubject/AddSubjectModal.jsx';
import AddTopicFormModal from './AddTopic/AddTopicModal.jsx';
import BookNameDropdown from './BookNameDropdown/BookNameDropdown.jsx';
import DifficultyLevelDropdown from './DifficultyLevelDropdown/DifficultyLevelDropdown.jsx';
import ExplanationInput from './ExplanationInput.jsx';
import OptionsInput from './OptionsInput.jsx';
import PostListDropdown from './PostListDropdown/PostListDropdown.jsx';
import PublicationNameDropdown from './PublicationNameDropdown/PublicationNameDropdown.jsx';
import QuestionMonthDropdown from './QuestionMonthDropdown/QuestionMonthDropdown.jsx';
import QuestionPgNo from './QuestionPgNo/QuestionPgNo.jsx';
import QuestionPreview from './QuestionPreview/QuestionPreview.jsx';
import QuestionYearDropdown from './QuestionYearDropdown/QuestionYearDropdown.jsx';
import SubjectListDropdown from './SubjectListDropdown/SubjectListDropdown.jsx';
import TopicListDropdown from './TopicListDropdown/TopicListDropdown.jsx';
import addQuestionFormSchema from './addQuestionFormSchema.jsx';
import Swal from 'sweetalert2';

const AddQuestionForm = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useHttp();
	let { data: _formData } = useSelector((state) => state.questionForm);

	useEffect(() => {
		dispatch(getQuestionNumberThunk());
		dispatch(getPostListThunk());
		dispatch(getPublicationsListThunk(sendRequest));
	}, []);

	useEffect(() => {
		dispatch(getSubjectsListThunk(_formData.post_id, sendRequest));
	}, [_formData.post_id]);

	useEffect(() => {
		dispatch(getTopicsListThunk(_formData.subject_id, sendRequest));
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
			const errorsObj = {};
			error.inner.forEach((el) => {
				errorsObj[el.path] = el.message;
			});
			dispatch(QuestionFormActions.setErrors(errorsObj));
		}
	};

	async function postQuestionData() {
		let reqData = {
			url: SERVER_IP + '/api/questions/add-question',
			method: 'POST',
			body: JSON.stringify(_formData),
		};
		sendRequest(reqData, (data) => {
			if (data.success == 1) {
				toast('Successfully added question');
				Swal.fire({
					title: 'Success',
					text: 'Successfully saved question',
				});
				dispatch(QuestionFormActions.resetFormData());
				resetCkEditorInstances();
			}
		});
	}

	function resetCkEditorInstances() {
		window.CKEDITOR.instances[`question_content`].setData('');
		window.CKEDITOR.instances[`option_A`].setData('');
		window.CKEDITOR.instances[`option_B`].setData('');
		window.CKEDITOR.instances[`option_C`].setData('');
		window.CKEDITOR.instances[`option_D`].setData('');
		window.CKEDITOR.instances[`option_E`].setData('');
		window.CKEDITOR.instances[`explanation`].setData('');
	}

	// useEffect(() => {
	// 	return () => {
	// 		let isConfirm = confirm('Do you want to leave');
	// 		if (!isConfirm) return false;
	// 	};
	// }, []);

	return (
		<div className="">
			<AddPostModal />
			<AddSubjectModal />
			<AddTopicFormModal />
			<AddPublicationModal />
			<AddBookModal />

			<form id="add-question-form" className="grid grid-cols-1 md:grid-cols-2 gap-5 ms-5" onSubmit={handleSaveQuestion}>
				<div>
					<div className={`bg-white pb-2 sticky top-0 z-30 shadow-md my-2`}>
						<div className="grid grid-cols-3 gap-y-6 gap-x-2">
							<PostListDropdown />
							<SubjectListDropdown />
							<TopicListDropdown />
							<DifficultyLevelDropdown />

							<PublicationNameDropdown />
							<BookNameDropdown />
							<QuestionPgNo />
							<QuestionMonthDropdown />
							<QuestionYearDropdown />
						</div>
					</div>
					<OptionsInput />

					<OptionsDropdown />

					<hr />

					<ExplanationInput />

					<div className="flex justify-end m-3">
						<CButton className="flex justify-center items-center text-2xl" type="submit" isLoading={useSelector((state) => state.loader.isLoading)}>
							Save
						</CButton>
					</div>
				</div>

				<QuestionPreview />
			</form>
		</div>
	);
};

export function OptionsDropdown() {
	const dispatch = useDispatch();
	const { data: _formData } = useSelector((state) => state.questionForm);
	const handleOptionChange = (e) => {
		dispatch(
			QuestionFormActions.handleInputChange({
				key: e.target.name,
				value: e.target.value,
			})
		);
	};
	return (
		<>
			<div className="flex flex-col gap-3 relative w-fit">
				<div className="flex items-center gap-2">
					<label htmlFor="option_C" className="question-option !top-[-3rem]">
						Correct Option
					</label>
					<select id="post-id" className="input-el grow w-48" name="correct_option" onChange={handleOptionChange}>
						<option value="" className="" name="">
							-- Select --
						</option>
						<option value={'A'} selected={_formData.correct_option == 'A' ? true : false}>
							A
						</option>
						<option value={'B'} selected={_formData.correct_option == 'B' ? true : false}>
							B
						</option>
						<option value={'C'} selected={_formData.correct_option == 'C' ? true : false}>
							C
						</option>
						<option value={'D'} selected={_formData.correct_option == 'D' ? true : false}>
							D
						</option>
						{_formData.showOptionE && (
							<option value={'E'} selected={_formData.correct_option == 'E' ? true : false}>
								E
							</option>
						)}
					</select>
				</div>
			</div>
		</>
	);
}

export default AddQuestionForm;
