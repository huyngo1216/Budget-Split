import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Row from './Row';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '500px',
    overflowX: 'auto',
    overflowY: 'scroll'
  },
  table: {
    minWidth: 650,
  },
});

function TransactionsTable(props) {
    const classes = useStyles();
    return (
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <Row key='column-titles'
              data={props.columnNames}
              isHeadRow={true}
              excludedFields={[]}
              visible={true} />
          </TableHead>
          <TableBody>
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
          </TableBody>
        </Table>
      </Paper>
    )
  }

  export default TransactionsTable;