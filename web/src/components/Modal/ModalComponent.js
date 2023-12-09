import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DOM from 'react-dom';
function ModalUI(props) {
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function ModalComponent(handleShow) {
    return (
        <>
            {DOM.createPortal(
                <ModalUI handleShow={handleShow} />,
                document.getElementById('modal')
            )}
        </>
    );
}

export default ModalComponent;
