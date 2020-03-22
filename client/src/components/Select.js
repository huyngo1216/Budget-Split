import React from 'react';
import Form from 'react-bootstrap/Form';

function Select(props) {
    return (
        <td className='select'>
            <Form.Group>
                <Form.Control as='select' custom
                    id={props.name}
                    onChange={props.onSplitEvent}>
                    {
                        props.values.map((val) => <option value={val}>{val}</option>)
                    }
                </Form.Control>
            </Form.Group>
        </td>
    )
}

export default Select;