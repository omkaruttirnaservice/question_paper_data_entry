import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../Store/question-form-slice.js';

function OptionsInput({ showNewInputField, setShowNewInputField }) {
	const { data: _formData, errors } = useSelector(
		(state) => state.questionForm
	);
	const dispatch = useDispatch();
	useEffect(() => {
		/**
		 * Replace function replaces the textarea element with ck editor instance
		 * */
		let questionContentInstance = window.CKEDITOR.instances['question_content'];
		let optionAInstance = window.CKEDITOR.instances['option_A'];
		let optionBInstance = window.CKEDITOR.instances['option_B'];
		let optionCInstance = window.CKEDITOR.instances['option_C'];
		let optionDInstance = window.CKEDITOR.instances['option_D'];

		if (questionContentInstance) {
			questionContentInstance.destroy(true);
		}
		if (optionAInstance) {
			optionAInstance.destroy(true);
		}

		if (optionBInstance) {
			optionBInstance.destroy(true);
		}

		if (optionCInstance) {
			optionCInstance.destroy(true);
		}

		if (optionDInstance) {
			optionDInstance.destroy(true);
		}

		window.CKEDITOR.replace(`question_content`, {
			height: 100,
		});

		window.CKEDITOR.replace(`option_A`, {
			height: 100,
		});

		window.CKEDITOR.replace(`option_B`, {
			height: 100,
		});
		window.CKEDITOR.replace(`option_C`, {
			height: 100,
		});

		window.CKEDITOR.replace(`option_D`, {
			height: 100,
		});

		/**
		 * Get value of the editor by listening to change event
		 * Value is available by calling .getData() function
		 * */
		window.CKEDITOR.instances[`question_content`].on('change', function () {
			dispatch(
				QuestionFormActions.handleInputChange({
					key: `question_content`,
					value: window.CKEDITOR.instances[`question_content`].getData(),
				})
			);
		});

		window.CKEDITOR.instances[`option_A`].on('change', function () {
			dispatch(
				QuestionFormActions.handleInputChange({
					key: `option_A`,
					value: window.CKEDITOR.instances[`option_A`].getData(),
				})
			);
		});

		window.CKEDITOR.instances[`option_B`].on('change', function () {
			dispatch(
				QuestionFormActions.handleInputChange({
					key: `option_B`,
					value: window.CKEDITOR.instances[`option_B`].getData(),
				})
			);
		});

		window.CKEDITOR.instances[`option_C`].on('change', function () {
			dispatch(
				QuestionFormActions.handleInputChange({
					key: `option_C`,
					value: window.CKEDITOR.instances[`option_C`].getData(),
				})
			);
		});
		window.CKEDITOR.instances[`option_D`].on('change', function () {
			dispatch(
				QuestionFormActions.handleInputChange({
					key: `option_D`,
					value: window.CKEDITOR.instances[`option_D`].getData(),
				})
			);
		});
	}, []);

	useEffect(() => {
		let optionEInstance = window.CKEDITOR?.instances['option_E'];

		if (!optionEInstance && !showNewInputField) {
			return;
		}

		window.CKEDITOR.replace(`option_E`, {
			height: 50,
		});

		window.CKEDITOR.instances[`option_E`].on('change', function () {
			dispatch(
				QuestionFormActions.handleInputChange({
					key: `option_E`,
					value: window.CKEDITOR.instances[`option_E`].getData(),
				})
			);
		});
	}, [showNewInputField]);

	return (
		<>
			<div className="mb-16">
				<textarea
					name={`question_content`}
					id={`question_content`}
					value={_formData.question_content}
					className="top-10"
				></textarea>
				<label htmlFor="question_content" className="!top-[-3rem] !rounded-sm">
					Question
				</label>
			</div>
			{errors.question_content && (
				<div className=" error">{errors.question_content}</div>
			)}

			<div className="mb-16">
				<textarea
					name={`option_A`}
					id={`option_A`}
					value={_formData.option_A}
					className="top-10"
				></textarea>
				<label htmlFor="option_A" className="!top-[-3rem]">
					A
				</label>
			</div>
			{errors.option_A && <div className=" error">{errors.option_A}</div>}

			<div className="mb-16">
				<textarea
					name={`option_B`}
					id={`option_B`}
					value={_formData.option_B}
					className="top-10"
				></textarea>
				<label htmlFor="option_B" className="!top-[-3rem]">
					B
				</label>
			</div>
			{errors.option_B && <div className=" error">{errors.option_B}</div>}

			<div className="mb-16">
				<textarea
					name={`option_C`}
					id={`option_C`}
					value={_formData.option_C}
					className="top-10"
				></textarea>
				<label htmlFor="option_C" className="!top-[-3rem]">
					C
				</label>
			</div>
			{errors.option_C && <div className=" error">{errors.option_C}</div>}

			<div className="mb-16">
				<textarea
					name={`option_D`}
					id={`option_D`}
					value={_formData.option_D}
					className="top-10"
				></textarea>
				<label htmlFor="option_D" className="!top-[-3rem]">
					D
				</label>
			</div>
			{errors.option_D && <div className=" error">{errors.option_D}</div>}

			{showNewInputField ? (
				<>
					<div className="mb-16">
						<textarea
							name={`option_E`}
							id={`option_E`}
							value={_formData.option_E}
							className="top-10"
						></textarea>
						<label htmlFor="option_E" className="!top-[-3rem]">
							D
						</label>
					</div>
					{errors.option_E && (
						<div className="!top-[1rem]">{errors.option_E}</div>
					)}
					<button
						className="btn btn-danger"
						id="remove-new-option-btn"
						onClick={() => {
							window.CKEDITOR?.instances['option_E'].destroy(true);
							dispatch(
								QuestionFormActions.handleInputChange({
									key: 'option_E',
									value: null,
								})
							);
							setShowNewInputField(!showNewInputField);
						}}
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
		</>
	);
}

export default OptionsInput;
