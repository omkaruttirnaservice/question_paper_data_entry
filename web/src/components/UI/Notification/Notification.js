import React, { useState, useEffect } from 'react';
import './notification.css'; // Import your CSS file for styling

const Notification = ({ type, message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 6000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification-modal ${isVisible ? 'visible' : 'hidden'} ${type}`}>
            <div className='notification-content'>{message}</div>
        </div>
    );
};

export default Notification;
