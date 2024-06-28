import React, { useRef } from 'react';
import CModal from '../../UI/CModal.js';
import { useDispatch, useSelector } from 'react-redux';
import { notificationActions } from '../../../Store/notification-slice.js';
import useHttp from '../../Hooks/use-http.js';
import { ModalActions } from '../../../Store/modal-slice.js';
import { getSubjectsListThunk } from '../../../Store/question-form-slice.js';
import CButton from '../../UI/CButton.js';

function AddSubjectModal() {
	const subjectNameRef = useRef();
	const dispatch = useDispatch();
	const { sendRequest } = useHttp();

	const handleSubjectAdd = async () => {
		let subjectName = subjectNameRef.current.value;
		if (!subjectName) {
			dispatch(
				notificationActions.showNotification('Please enter subject name')
			);
			return;
		}

		const requestData = {
			url: '/add-subject',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ subjectName }),
		};
		sendRequest(requestData, (data) => {
			dispatch(ModalActions.toggleModal('add-subject-modal'));
			if (data.success === 1) {
				dispatch(
					notificationActions.showNotification('Subject added successfully')
				);
				dispatch(getSubjectsListThunk());
			} else {
				dispatch(notificationActions.showNotification('Something went wrong1'));
			}
		});
	};
	return (
		<div>
			<CModal id={'add-subject-modal'} title={'Add Subject'}>
				<div className="flex flex-col">
					<label htmlFor="" className="mb-1">
						Subject Name
					</label>
					<input
						type="text"
						name="subject_name"
						className="input-el mb-6"
						ref={subjectNameRef}
					/>

					<CButton
						className="w-[30%] flex justify-center mx-auto"
						onClick={handleSubjectAdd}
						isLoading={useSelector((state) => state.loader.isLoading)}>
						Submit
					</CButton>
				</div>
			</CModal>
		</div>
	);
}

export default AddSubjectModal;
