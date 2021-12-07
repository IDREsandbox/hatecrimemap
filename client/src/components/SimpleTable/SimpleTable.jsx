import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { uuid } from 'uuidv4';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  Checkbox,
} from '@material-ui/core';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
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

const SimpleTable = (props) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const {
    classes,
    columnHeaders,
    tableData,
    idsChecked,
    onCheckIncident,
    onCheckAll,
  } = props;


  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };
  
  // changes handleRowChange to 
  const handleRowChange = (e) => {
    let newRowsPerPage = e.target.value
    let currentStartingNumber = (rowsPerPage * page) + 1  
    let startingPage = Math.floor(currentStartingNumber / newRowsPerPage)
    setRowsPerPage(e.target.value);
    setPage(startingPage)
    /* NOTE
    The above function doesn't actually call fetchData itself - have a useEffect only triggered by page change to call fetchData
    This is due to useState not updating fast enough before next line is called (state change stuff)
    This fix fixes change with the event verification portal going out of range
    */
  };

  useEffect(() => {
    props.fetchData(rowsPerPage, page);
  }, [page]);

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
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowChange}
              count={props.counts}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  );

};

SimpleTable.propTypes = {
  columnHeaders: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
