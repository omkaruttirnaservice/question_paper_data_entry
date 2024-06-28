import DOM from 'react-dom';
import './alert_om.css';

function Alert_om_html(props) {
	return (
		<div className="w-25 alert-om">
			<p className=" mb-0">{props.children}</p>
		</div>
	);
}

function Alert_om(props) {
	return DOM.createPortal(
		<Alert_om_html varient={props.varient} children={props.children} />,
		document.getElementById('alert')
	);
}

export default Alert_om;
