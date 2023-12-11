import react from 'react';
import DOM from 'react-dom';
import { Alert } from 'react-bootstrap';
import './alert_om.css';

function Alert_om_html(props) {
    return (
        <Alert varient={props.type} className="w-25 alert-om">
            <p className=" mb-0">{props.children}</p>
        </Alert>
    );
}

function Alert_om(props) {
    return DOM.createPortal(
        <Alert_om_html varient={props.varient} children={props.children} />,
        document.getElementById('alert')
    );
}

export default Alert_om;
