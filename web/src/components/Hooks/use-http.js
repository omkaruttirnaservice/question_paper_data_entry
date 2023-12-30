import { useDispatch } from 'react-redux';
import { notificationActions } from '../../Store/notification-slice';
const useHttp = () => {
    const dispatch = useDispatch();

    const sendRequest = async (requestData, callback) => {
        try {
            let res = await fetch(requestData.url, {
                method: requestData.method ? requestData.method : 'GET',
                headers: requestData.headers ? requestData.headers : {},
                body: requestData.body ? requestData.body : null,
            });
            if (!res.ok) {
                throw new Error('Request failed');
            }
            const data = await res.json();

            // THIS FUNCTION IS FOR GETTING RESPONSE RECIVED FROM THE REQUEST
            callback(data);
        } catch (err) {
            dispatch(notificationActions.showNotification('Something went wrong.'));
        }
    };
    return {
        sendRequest,
    };
};

export default useHttp;
