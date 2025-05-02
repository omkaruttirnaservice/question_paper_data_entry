import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loaderActions } from '../../Store/loader-slice.jsx';
const useHttp = () => {
	const dispatch = useDispatch();

	const sendRequest = async (requestData, callback) => {
		console.log(requestData, '==requestData==');
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
			console.log(err);
			dispatch(loaderActions.hideLoader());
			if ((err.message = 'Failed to fetch')) {
				console.log('Unable to connect to backend');
				toast('Unable to connect to backend');
			} else {
				toast('Something went wrong.');
			}
		}
	};
	return {
		sendRequest,
	};
};

export default useHttp;
