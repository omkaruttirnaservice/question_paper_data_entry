import React, { useRef } from 'react';
import CModal from '../../UI/CModal.js';
import { useDispatch, useSelector } from 'react-redux';
import { notificationActions } from '../../../Store/notification-slice.js';
import useHttp from '../../Hooks/use-http.js';
import { ModalActions } from '../../../Store/modal-slice.js';
import { getSubjectsListThunk } from '../../../Store/question-form-slice.js';
import CButton from '../../UI/CButton.js';

function AddPostModal() {
	const postNameRef = useRef();
	const dispatch = useDispatch();
	const { sendRequest } = useHttp();

	const handlePostAdd = async () => {
		let postName = postNameRef.current.value;
		if (!postName) {
			dispatch(notificationActions.showNotification('Please enter post name'));
			return;
		}

		const requestData = {
			url: 'posts/add',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ postName }),
		};
		sendRequest(requestData, (data) => {
			dispatch(ModalActions.toggleModal('add-post-modal'));
			if (data.success === 1) {
				dispatch(
					notificationActions.showNotification('Post added successfully')
				);
				dispatch(getSubjectsListThunk());
			} else {
				dispatch(notificationActions.showNotification('Something went wrong1'));
			}
		});
	};
	return (
		<div>
			<CModal id={'add-post-modal'} title={'Add Post'}>
				<div className="flex flex-col">
					<label htmlFor="" className="mb-1">
						Post Name
					</label>
					<input
						type="text"
						name="subject_name"
						className="input-el mb-6"
						ref={postNameRef}
					/>

					<CButton
						className="w-[30%] flex justify-center mx-auto"
						onClick={handlePostAdd}
						isLoading={useSelector((state) => state.loader.isLoading)}>
						Submit
					</CButton>
				</div>
			</CModal>
		</div>
	);
}

export default AddPostModal;
