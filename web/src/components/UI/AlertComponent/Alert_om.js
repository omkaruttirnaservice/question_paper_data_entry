import DOM from 'react-dom';
import './alert_om.css';

function AlertOmHtml(props) {
	return (
		<div className="w-25 alert-om py-2 px-3 bg-blue-300">
			<p className=" mb-0">{props.children}</p>
		</div>
	);
}

function Alert_om(props) {
	return DOM.createPortal(
		<AlertOmHtml varient={props.varient} children={props.children} />,
		document.getElementById('alert')
	);
}

export default Alert_om;
