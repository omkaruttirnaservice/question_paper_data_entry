import React from 'react';
import DOM from 'react-dom';

import './loader.css';

const LoaderHTML = (props) => {
    return <div className='loader'></div>;
};

const Loader = () => {
    return <>{DOM.createPortal(<LoaderHTML />, document.getElementById('loader'))}</>;
};

export default Loader;
