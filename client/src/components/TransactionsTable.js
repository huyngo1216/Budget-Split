import React from 'react';
import Row from './Row';
import Table from 'react-bootstrap/Table';

function TransactionsTable(props) {
    return (
      <div className='table'>
        <Table striped>
          <thead>
            <Row key='column-titles'
              data={props.columnNames}
              isHeadRow={true}
              excludedFields={[]}
              visible={true} />
          </thead>
          <tbody>
            {props.items.map(item => (
                  <Row key={item.id}
                    id={item.id}
                    data={item}
                    isHeadRow={false}
                    rowChangeEvent={props.rowChangeEvent}
                    onSplitEvent={(e) => props.onSplitEvent(item.id, e)}
                    excludedFields={['divisor', 'hidden', 'pending', 'id']}
                    visible={true}/>
              )
            )}
          </tbody>
        </Table>
      </div>
    )
  }

  export default TransactionsTable;