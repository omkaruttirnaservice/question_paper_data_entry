import * as Yup from 'yup';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalActions } from '../../../Store/modal-slice.js';
import { notificationActions } from '../../../Store/notification-slice.js';
import { getTopicsListThunk } from '../../../Store/question-form-slice.js';
import useHttp from '../../Hooks/use-http.js';
import CButton from '../../UI/CButton.js';
import CModal from '../../UI/CModal.js';

function AddTopicFormModal() {
	const topicNameRef = useRef();
	const [error, setError] = useState({});
	const dispatch = useDispatch();
	const { sendRequest } = useHttp();
	const { data: _formData, subjectsList } = useSelector(
		(state) => state.questionForm
	);

	const addTopicSchema = Yup.object().shape({
		topic_name: Yup.string('Topic name should be in string').required(
			'Topic name requied'
		),
	});

	async function handleInputChange(e) {
		let { name: topic_name, value } = e.target;
		console.log(topic_name, value);
		try {
			await addTopicSchema.validateAt(topic_name, { topic_name: value });
			setError({ ...error, topic_name: null });
		} catch (error) {
			console.log(error.message);
			setError({ ...error, topic_name: error.message });
		}
	}

	const handleAddTopic = async () => {
		let subjectId = _formData.subject_id;
		let topicName = topicNameRef.current.value;

		if (!topicName) {
			dispatch(notificationActions.showNotification('Please enter topic name'));
			return;
		}

		try {
			await addTopicSchema.validate({ topic_name: topicName });
			setError({ ...error, subject_name: null });
			postTopicAdd(subjectId, topicName);
		} catch (error) {
			console.log(error.message);
			setError({ ...error, topic_name: error.message });
		}
	};

	function postTopicAdd(subjectId, topicName) {
		const requestData = {
			url: '/add-topic',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectId, topicName }),
		};

		sendRequest(requestData, (data) => {
			console.log(data, 'data=== after adding topic');
			if (data.success === 1) {
				dispatch(ModalActions.toggleModal('add-topic-modal'));
				dispatch(
					notificationActions.showNotification('Successfully added new topic')
				);
				dispatch(getTopicsListThunk(subjectId, sendRequest));
			} else {
				dispatch(notificationActions.showNotification('Something went wrong2'));
			}
		});
	}
	return (
		<div>
			<CModal id={'add-topic-modal'} title={'Add Topic'}>
				<div className="flex flex-col gap-3">
					<div className="flex flex-col">
						<label htmlFor="" className="">
							Selected Subject
						</label>
						<input
							type="text"
							className="input-el mt-2 mb-3"
							// value={subjectsList[_formData.subject_id - 1]?.subject_name}
							value={subjectsList
								.map((el) => {
									if (el.id == _formData.subject_id) return el.mtl_name;
								})
								.join('')}
							readOnly
						/>
					</div>

					<div className="flex flex-col relative mb-6">
						<label htmlFor="Topic Name" className="">
							Topic Name
						</label>
						<input
							type="text"
							className="input-el mt-2"
							name="topic_name"
							ref={topicNameRef}
							onChange={handleInputChange}
						/>

						{error.topic_name && (
							<span className="error">{error.topic_name}</span>
						)}
					</div>

					<CButton
						className="w-[30%] flex justify-center mx-auto"
						onClick={handleAddTopic}
						isLoading={useSelector((state) => state.loader.isLoading)}>
						Submit
					</CButton>
				</div>
			</CModal>
		</div>
	);
}

export default AddTopicFormModal;
