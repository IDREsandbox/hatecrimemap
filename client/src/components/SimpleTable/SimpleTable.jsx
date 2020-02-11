import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
} from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  cell: {
    width: '20px',
  },
});

class SimpleTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 10,
      page: 0,
      total: -1
    }
  }

  componentWillMount() {
    axios.get('/api/verify/unreviewedcount')
      .then((res) => {
        if(res.data.counts) {
          this.setState({total: parseInt(res.data.counts)});
        }
      })
      .catch((err) => alert(err))
  }

  handlePageChange = (e, page) => {
    console.log(page);
    this.setState({page: page});
    this.props.fetchData(this.state.rowsPerPage, page);
  }

  handleRowChange = (e) => {
    this.setState({rowsPerPage: e.target.value}, () => {
      this.props.fetchData(e.target.value, this.state.page);
    })
  }

  render() {
    const { classes, columnHeaders, tableData } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell} key="id">ID</TableCell>
              {columnHeaders.map(header => <TableCell className={classes.cell} key={header}>{header}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, i) => (
              <TableRow className={classes.row} key={row[0]}>
                {row.map(cell => <TableCell className={classes.cell} key={uuidv4()}>{cell}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handlePageChange}
                onChangeRowsPerPage={this.handleRowChange}
                count={this.state.total}>
              </TablePagination>
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
     )
  }
}


SimpleTable.propTypes = {
  columnHeaders: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
