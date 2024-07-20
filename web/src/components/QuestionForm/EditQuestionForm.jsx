import { useEffect, useLayoutEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import QuestionPreview from './QuestionPreview/QuestionPreview.jsx';

import { QuestionFormActions } from '../../Store/question-form-slice.jsx';
import useHttp from '../Hooks/use-http.jsx';
import CButton from '../UI/CButton.jsx';
import ExplanationInput from './ExplanationInput.jsx';

import { FaAngleDoubleRight } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { OptionsDropdown } from './AddQuestionForm.jsx';
import BookNameDropdown from './BookNameDropdown/BookNameDropdown.jsx';
import DifficultyLevelDropdown from './DifficultyLevelDropdown/DifficultyLevelDropdown.jsx';
import EditOptionsInput from './EditOptionsInput.jsx';
import editQuestionFormSchema from './editQuestionFormSchema.jsx';
import PublicationNameDropdown from './PublicationNameDropdown/PublicationNameDropdown.jsx';
import QuestionMonthDropdown from './QuestionMonthDropdown/QuestionMonthDropdown.jsx';
import QuestionPgNo from './QuestionPgNo/QuestionPgNo.jsx';
import QuestionYearDropdown from './QuestionYearDropdown/QuestionYearDropdown.jsx';

const EditQuestionForm = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sendRequest } = useHttp();
	let { data: _formData, isEdit } = useSelector((state) => state.questionForm);

	useLayoutEffect(() => {
		if (!isEdit) {
			navigate('/questions-list');
		}
	}, [isEdit]);

	useEffect(() => {
		return () => {
			dispatch(QuestionFormActions.setEditingFalse());
			dispatch(QuestionFormActions.resetFormData());
		};
	}, []);

	const handleUpdateQuestion = async (e) => {
		e.preventDefault();
		try {
			await editQuestionFormSchema.validate(_formData, { abortEarly: false });
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
			url: '/api/questions/update-question',
			method: 'PUT',
			body: JSON.stringify(_formData),
		};
		sendRequest(reqData, (data) => {
			if (data.success == 1) {
				Swal.fire({
					title: 'Success!',
					text: 'Question has been updated.',
					icon: 'success',
				});
				resetCkEditorInstances();
				// dispatch(QuestionFormActions.resetFormData());
				setTimeout(() => {
					dispatch(QuestionFormActions.setEditingFalse());
				}, 1);
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

	return (
		<>
			<div className="container mx-auto sticky top-0 bg-white z-50"></div>

			<form id="add-question-form" className="grid grid-cols-1 md:grid-cols-2 gap-5 ms-5" onSubmit={handleUpdateQuestion}>
				<div>
					<div className={`bg-white pb-2 sticky top-0 z-30 shadow-md my-2`}>
						<div className="flex items-center py-3 gap-3">
							<p>Edit data for</p>
							<FaAngleRight />
							<span className="underline">Post Name</span>
							<FaAngleDoubleRight />
							<span className="underline">{_formData.subject_name}</span>
							<FaAngleDoubleRight />
							<span className="underline">{_formData.topic_name}</span>
						</div>

						<div className="flex justify-end py-3 items-center gap-3">
							[<span>{_formData.pub_name}</span>] [<span>{_formData.book_name}</span>] [<span>Pg. No. {_formData.pg_no}</span>]
						</div>
						<div className="grid grid-cols-3 gap-y-6 gap-x-2">
							<DifficultyLevelDropdown />

							<PublicationNameDropdown />
							<BookNameDropdown />
							<QuestionPgNo />
							<QuestionMonthDropdown />
							<QuestionYearDropdown />
						</div>
					</div>

					<EditOptionsInput />
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
		</>
	);
};

export default EditQuestionForm;
