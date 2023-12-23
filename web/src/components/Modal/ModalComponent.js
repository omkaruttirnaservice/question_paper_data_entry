import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { modalActions } from '../../Store/modal-slice';
function ModalComponent(props) {
    console.log(props);
    // const title = useSelector((state) => state.modal.title);
    // const modalBody = useSelector((state) => state.modal.modalBody);
    // const dispatch = useDispatch();
    const handleClose = () => {
        // dispatch(modalActions.closeModal());
    };
    return (
        <>
            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.modalBody}</Modal.Body>
            </Modal>
        </>
    );
}

export default ModalComponent;
