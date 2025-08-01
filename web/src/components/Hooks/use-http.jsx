import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loaderActions } from '../../Store/loader-slice.jsx';
import { useNavigate } from 'react-router-dom';
const useHttp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                credentials: 'include',
            });
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('Not found');
                } else {
                    const data = await res.json();
                    throw new Error(data?.usrMsg || 'Request failed');
                }
            }
            const data = await res.json();

            dispatch(loaderActions.hideLoader());
            // THIS FUNCTION IS FOR GETTING RESPONSE RECIVED FROM THE REQUEST
            callback(data);
        } catch (err) {
            console.log(err, '----');
            dispatch(loaderActions.hideLoader());
            toast(err?.message || 'Unable to connect to backend');
            if (err.message == 'Invalid token') {
                navigate('/login', { replace: true });
            }

            // if ((err.message = 'Failed to fetch')) {
            //     console.log('Unable to connect to backend');
            //     toast('Unable to connect to backend');
            // } else if (true) {
            // } else {
            //     toast('Something went wrong.');
            // }
        }
    };
    return {
        sendRequest,
    };
};

export default useHttp;
