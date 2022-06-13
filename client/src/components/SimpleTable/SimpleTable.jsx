import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
    backgroundColor: "#262626"
  },
  table: {
    minWidth: 700,
    backgroundColor: "#262626",
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgb(0,0,0)'
    },
  },
  cell: {
    width: '20px',
  },
});

/**
 * A paginated table that operates on the following configurable props:
 *   columnHeaders - array of column headers
 *   tableData - data in the form of an array of arrays, with each array element being a row (should be length == columnHeaders)
 *   onCheckIncident - function(int, any action) to call when a row checkbox is pressed
 *   onCheckAll - function(int[]) to call when the header checkbox is pressed
 *   idsChecked - array of ids (corresponding to the first element of every row array) to track checkbox status
 *   fetchData - function(int #rows, int page#) to update table data whenever pagination values are updated
 *   counts - max number of rows, for pagination purposes
 *
 * */
class SimpleTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 10,
      page: 0,
      total: this.props.counts,
    };
  }

  handlePageChange = (e, page) => {
    this.setState({ page });
    this.props.fetchData(this.state.rowsPerPage, page);
  };

  handleRowChange = (e) => {
    this.setState({ rowsPerPage: e.target.value }, () => {
      this.props.fetchData(e.target.value, this.state.page);
    });
  };

  render() {
    const {
      classes,
      columnHeaders,
      tableData,
      idsChecked,
      onCheckIncident,
      onCheckAll,
    } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell} key="select">
                <Checkbox
                  checked={tableData.every((row) => idsChecked.includes(row[0]))}
                  onChange={() => onCheckAll(tableData.map((row) => row[0]))}
                />
              </TableCell>
              <TableCell className={classes.cell} key="id">
                ID
              </TableCell>
              {/* Generate rest of table HEADERS */}
              {columnHeaders.map((header) => (
                <TableCell className={classes.cell} key={header}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Row FOR EACH incident fetched */}
            {tableData.map((row, i) => ( // eslint-disable-line no-unused-vars
              <TableRow className={classes.row} key={row[0]}>
                <TableCell className={classes.cell} key={`select${row[0]}`}>
                  <Checkbox
                    key={`select${row[0]}`}
                    checked={idsChecked.includes(row[0])}
                    onChange={(e) => onCheckIncident(e, row[0])}
                  />
                </TableCell>
                {/* Generate rest of column's for individual row */}
                {row.map((cell) => (
                  <TableCell className={classes.cell} key={uuid()}>
                    {cell}
                  </TableCell>
                ))}
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
                count={this.state.total}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    );
  }
}

SimpleTable.propTypes = {
  columnHeaders: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
