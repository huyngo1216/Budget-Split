import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Select from './Select';

class Row extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        visible: props.visible,
      }

      this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
      this.props.rowChangeEvent(this.props.id);
      this.setState({
        visible: !this.state.visible,
      });
    }

    render() {
      return (
        <tr className={`table-row ${this.state.visible ? '' : 'row-hidden'}`}>
          {
            Object.keys(this.props.data)
            .filter(key => this.props.excludedFields.includes(key) === false)
            .map(key => {
              return (
                    <TableCell onClick={this.handleChange} align="center">
                      {this.props.data[key]}
                    </TableCell>
                  )
                }
                )
              }
          {
            this.props.isHeadRow === false
            && <Select
                  name={this.props.data.name}
                  onSplitEvent={this.props.onSplitEvent}
                  values={[2,3,4,5,6,1]}
                />
          }
        </tr>
      )
    }
  }

  export default Row;