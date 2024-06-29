import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalActions } from '../../../Store/modal-slice.js';
import { notificationActions } from '../../../Store/notification-slice.js';
import { getTopicsListThunk } from '../../../Store/question-form-slice.js';
import useHttp from '../../Hooks/use-http.js';
import CButton from '../../UI/CButton.js';
import CModal from '../../UI/CModal.js';

function AddTopicFormModal() {
	const topicNameRef = useRef();
	const dispatch = useDispatch();
	const { sendRequest } = useHttp();
	const { data: _formData, subjectsList } = useSelector(
		(state) => state.questionForm
	);
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
	};
	return (
		<div>
			<CModal id={'add-topic-modal'} title={'Add Topic'}>
				<div className="flex flex-col">
					<label htmlFor="" className="mb-1">
						Selected Subject
					</label>
					<input
						type="text"
						className="input-el mb-3"
						// value={subjectsList[_formData.subject_id - 1]?.subject_name}
						value={subjectsList
							.map((el) => {
								if (el.id == _formData.subject_id) return el.subject_name;
							})
							.join('')}
						readOnly
					/>

					<label htmlFor="Topic Name" className="mb-1">
						Topic Name
					</label>
					<input
						type="text"
						className="input-el mb-6"
						name="topic_name"
						ref={topicNameRef}
					/>

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
