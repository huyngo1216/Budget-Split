import React from 'react';
import Row from './Row';

function Table(props) {
    return (
        <div id='table'>
            <ul id='table-row'>
            <Row key='column-titles'
                data={props.columnNames} />
            </ul>
            {props.items.map(item => (
                <ul id='table-row'>
                <Row key={item.name}
                    id={item.name}
                    data={item}
                    rowChangeEvent={props.rowChangeEvent} />
                </ul>
            )
            )}
        </div>
    )
  }

  export default Table;