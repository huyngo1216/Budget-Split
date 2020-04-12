import React from 'react';
import Modal from 'react-bootstrap/Modal';

function GenericModal(props) {
    return (
        <Modal
            size='lg'
            show={true}
            onHide={props.onHide}>
            <Modal.Header keyboard>
                <h2 className='center-header'>Description of Charges</h2>
            </Modal.Header>
            <Modal.Body>
                <textarea rows={props.lines.length} className='textarea-full-width'>
                    {props.lines.reduce((acc, curr) => {
                        return acc + `${curr}\n`
                    }, '')}
                </textarea>
            </Modal.Body>
        </Modal>
    )
}

export default GenericModal;