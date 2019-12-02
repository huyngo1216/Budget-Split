import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import { TableRow } from '@material-ui/core';
import Select from './Select';

function Row(props) {

    function handleChange() {
      props.rowChangeEvent(props.id);
    }

    return (
      <tr class='table-row'>
        {
          Object.keys(props.data)
          .filter(key => props.excludedFields.includes(key) === false)
          .map(key => {
            return (
                  <TableCell onClick={handleChange} align="center">
                    {props.data[key]}
                  </TableCell>
                )
              }
              )
            }
        {
          props.isHeadRow === false && <Select name={props.data.name} onSplitEvent={props.onSplitEvent} />
        }
      </tr>
    )
  }

  export default Row;