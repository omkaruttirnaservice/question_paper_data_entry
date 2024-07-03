import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { QuestionFormActions } from '../../Store/question-form-slice.js';
import useHttp from '../Hooks/use-http.js';
import CButton from '../UI/CButton.js';
import ExplanationInput from './ExplanationInput.js';
import OptionsInput from './OptionsInput.js';
import editQuestionFormSchema from './editQuestionFormSchema.js';
import { toast } from 'react-toastify';

const EditQuestionForm = () => {
	let { data: _formData, errors } = useSelector((state) => state.questionForm);
	const dispatch = useDispatch();

	const navigate = useNavigate();

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

	const handleEditQuestion = async (e) => {
		e.preventDefault();
		try {
			await editQuestionFormSchema.validate(_formData, { abortEarly: false });
			postQuestionData();

			dispatch(QuestionFormActions.setErrors({}));
		} catch (error) {
			console.log(error);
			const errorsObj = {};
			error.inner.forEach((el) => {
				errorsObj[el.path] = el.message;
			});
			dispatch(QuestionFormActions.setErrors(errorsObj));
		}
	};

	async function postQuestionData() {
		let reqData = {
			url: '/questions/edit-question',
			method: 'PUT',
			body: JSON.stringify(_formData),
		};
		sendRequest(reqData, (data) => {
			if (data.success == 1) {
				toast('Successfully updated question');
				dispatch(QuestionFormActions.setEditingFalse());
				navigate('/questions-list');
			}
		});
	}

	return (
		<>
			<div className="">
				<form
					id="edit-question-form"
					className=""
					onSubmit={handleEditQuestion}>
					<div>
						{_formData.subject_name} / {_formData.topic_name}
					</div>

					<div className="">
						<div className="">
							<label htmlFor="">Pub Name</label>
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
						<div className="">
							<label htmlFor="">Pg No</label>
							<input
								type="number"
								onChange={handleChange}
								name="pg_no"
								value={_formData.pg_no}
							/>
							{errors.pg_no && <div className=" error">{errors.pg_no}</div>}
						</div>
						<div className="">
							<div className="">
								<OptionsInput
									showNewInputField={showNewInputField}
									setShowNewInputField={setShowNewInputField}
								/>
							</div>
						</div>
						<div className="">
							<label htmlFor="">Correct Option</label>
							<input
								type="text"
								id="correct-option"
								className=""
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
						isLoading={useSelector((state) => state.loader.isLoading)}>
						Update
					</CButton>
				</form>
			</div>
		</>
	);
};

export default EditQuestionForm;
