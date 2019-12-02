import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));

function Select(props) {
    const classes = useStyles();
    const inputLabel = React.useRef(null);

    return (
        // <td>
        //     <select id='divisor-selector' name={props.name} onChange={props.onSplitEvent}>
        //         {
        //             [2,3,4,5,6,1].map((val) => <option value={val}>{val}</option>)
        //         }
        //     </select>
        // </td>
        <td>
            <FormControl variant="outlined">
                <SelectComponent
                    name={props.name}
                    native
                    onChange={props.onSplitEvent}
                >
                    {
                        [2,3,4,5,6,1].map((val) => <option value={val}>{val}</option>)
                    }
                </SelectComponent>
            </FormControl>
        </td>
    )
}

export default Select;