import React, { useEffect, useState } from 'react';
import { FaAngleDoubleRight, FaEyeSlash } from 'react-icons/fa';
import { FaAngleRight, FaEye } from 'react-icons/fa6';

import { useDispatch, useSelector } from 'react-redux';
import { QuestionFormActions } from '../../../Store/question-form-slice.jsx';
import CButton from '../../UI/CButton.jsx';

function QuestionPreview() {
	const dispatch = useDispatch();

	const [dataEntryFor, setDataEntryFor] = useState({
		postName: null,
		subjectName: null,
		topicName: null,
	});

	const { data: _formData, isQuestionPreview, postsList, subjectsList, topicsList, questionNumber } = useSelector((state) => state.questionForm);

	useEffect(() => {
		if (isQuestionPreview) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [isQuestionPreview]);

	useEffect(() => {
		if (_formData.post_id) {
			let postDetails = postsList.find((post) => post.id == _formData.post_id);
			let subjectDetails = subjectsList.find((sub) => sub.id == _formData.subject_id);
			let topicDetails = topicsList.find((topic) => topic.id == _formData.topic_id);

			setDataEntryFor({
				postName: postDetails?.mtl_test_name || '',
				subjectName: subjectDetails?.mtl_name || '',
				topicName: topicDetails?.topic_name || '',
			});
		}
	}, [_formData.post_id, _formData.subject_id, _formData.topic_id]);

	const handleKeyPress = (e) => {
		let key = e.key;
		if (e.altKey && key.toLowerCase() == 'p') {
			dispatch(QuestionFormActions.toggleQuestionPreview());
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeyPress);
		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);

	return (
		<>
			<div className={`text-gray-600 bg-gray-100  sticky top-0 p-2 h-[100vh] overflow-auto`}>
				<div className="flex items-center gap-3 py-1">
					<p>Data entry for</p>
					<FaAngleRight />
					<span className="underline">{dataEntryFor.postName}</span>
					<FaAngleDoubleRight />
					<span className="underline">{dataEntryFor.subjectName}</span>
					<FaAngleDoubleRight />
					<span className="underline">{dataEntryFor.topicName}</span>
				</div>

				<hr />

				<div className="flex justify-end py-1 items-center gap-3">
					[<span>{_formData.pub_name}</span>] [<span>{_formData.book_name}</span>] [<span>Pg. No. {_formData.pg_no}</span>]
				</div>

				<hr />

				<div className="flex flex-col gap-1 py-1">
					<PreviewOptionContainer title={`Question-${questionNumber}`} html={_formData.question_content} />

					<PreviewOptionContainer title={`Option A`} html={_formData.option_A} />
					<hr />
					<PreviewOptionContainer title={`Option B`} html={_formData.option_B} />
					<hr />
					<PreviewOptionContainer title={`Option C`} html={_formData.option_C} />
					<hr />
					<PreviewOptionContainer title={`Option D`} html={_formData.option_D} />
					<hr />

					{_formData.option_E && (
						<>
							<PreviewOptionContainer title={`Option E`} html={_formData.option_E} /> <hr />
						</>
					)}

					<p className="font-semibold text-sm py-2">
						Correct Option&nbsp;&nbsp;
						<span className="bg-gray-700 text-white p-1 font-bold">{_formData.correct_option}</span>
					</p>
					<hr />

					<PreviewOptionContainer title={`Explanation`} html={_formData.explanation} />
					<hr />
				</div>
			</div>
		</>
	);
}

function PreviewOptionContainer({ title, html }) {
	return (
		<>
			<p className="font-semibold text-sm">{title}</p>
			<div
				dangerouslySetInnerHTML={{
					__html: html,
				}}
				className="mb-2 bg-gray-50 p-1"></div>
		</>
	);
}

export default QuestionPreview;
