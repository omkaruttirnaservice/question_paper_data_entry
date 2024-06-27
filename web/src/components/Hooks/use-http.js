import { useDispatch } from 'react-redux';
import { notificationActions } from '../../Store/notification-slice';
import { loaderActions } from '../../Store/loader-slice.js';
const useHttp = () => {
	const dispatch = useDispatch();

	const sendRequest = async (requestData, callback) => {
		try {
			dispatch(loaderActions.showLoader());
			let res = await fetch(requestData.url, {
				method: requestData.method ? requestData.method : 'GET',
				// headers: requestData.headers ? requestData.headers : {},
				headers: {
					'Content-Type': 'application/json',
					...requestData.headers,
				},
				body: requestData.body ? requestData.body : null,
			});
			if (!res.ok) {
				throw new Error('Request failed');
			}
			const data = await res.json();

			dispatch(loaderActions.hideLoader());
			// THIS FUNCTION IS FOR GETTING RESPONSE RECIVED FROM THE REQUEST
			callback(data);
		} catch (err) {
			dispatch(loaderActions.hideLoader());
			dispatch(notificationActions.showNotification('Something went wrong.'));
		}
	};
	return {
		sendRequest,
	};
};

export default useHttp;
