import react from 'react';
import Alert_om from '../UI/AlertComponent/Alert_om';
import { useDispatch, useSelector } from 'react-redux';
import { notificationActions } from '../../Store/notification-slice';
function Notification() {
    const dispatch = useDispatch();

    const notiMsg = useSelector((state) => state.message);
    setTimeout(() => {
        dispatch(notificationActions.hideNotification());
    }, 2000);

    return (
        <>
            <Alert_om type="success">{notiMsg}</Alert_om>
        </>
    );
}

export default Notification;
