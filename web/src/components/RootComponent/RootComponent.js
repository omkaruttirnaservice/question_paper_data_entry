import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import MenuBar from '../MenuBar/MenuBar';
import Notification from '../Notification/Notification';
import './RootComponent.css';

function RootComponent() {
	const showNoti = useSelector((state) => state.notification.show);
	return (
		<>
			<div className="">
				<div className=" menubar ">
					<MenuBar />
				</div>
				<div className="">
					{showNoti && <Notification />}
					<Outlet />
				</div>
			</div>
		</>
	);
}

export default RootComponent;
