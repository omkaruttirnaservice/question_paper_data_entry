import React, { useState, useEffect } from 'react';
import './notification.css'; // Import your CSS file for styling

const Notification = ({ type, message, onClose }) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			onClose();
		}, 2000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div
			className={`notification-modal !bg-purple-300 !py-1 !px-2 ${
				isVisible ? 'visible' : 'hidden'
			} ${type}`}>
			<div className="notification-content">{message}</div>
		</div>
	);
};

export default Notification;
