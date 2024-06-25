// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { QuestionFormActions } from '../../Store/question-form-slice.js';

// function InputCkEditor({ option, _formData }) {
// 	const dispatch = useDispatch();
// 	const [isInitial, setIsInitial] = useState(true);

// 	useEffect(() => {
// 		if (isInitial) {
// 			setIsInitial(false);
// 			return;
// 		}
// 		window.CKEDITOR.replace(option);
// 		/**
// 		 * Replace function replaces the textarea element with ck editor instance
// 		 * */

// 		/**
// 		 * Get value of the editor by listening to change event
// 		 * Value is available by calling .getData() function
// 		 * */
// 		window.CKEDITOR.instances[option].on('change', function () {
// 			dispatch(
// 				QuestionFormActions.handleInputChange({
// 					key: option,
// 					value: window.CKEDITOR.instances[option].getData(),
// 				})
// 			);
// 		});
// 		setIsInitial(true);
// 	}, [isInitial]);

// 	return (
// 		<>
// 			<div>
// 				{/* <label htmlFor={`${option}`}>{option}</label> */}

// 				<textarea
// 					name={option}
// 					id={option}
// 					value={_formData.question_content}
// 				></textarea>
// 			</div>
// 		</>
// 	);
// }

// export default InputCkEditor;
