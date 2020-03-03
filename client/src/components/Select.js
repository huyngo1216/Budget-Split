import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '@material-ui/core/Select';

function Select(props) {
    return (
        <td className='select'>
            <FormControl variant="outlined">
                <SelectComponent
                    name={props.name}
                    native
                    onChange={props.onSplitEvent}>
                    {
                        props.values.map((val) => <option value={val}>{val}</option>)
                    }
                </SelectComponent>
            </FormControl>
        </td>
    )
}

export default Select;