import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import uuidv4 from 'uuid/v4';

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
});

const SimpleTable = ({ columnHeaders, tableData, classes }) => (
  <Paper className={classes.root}>
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell key="row">Row</TableCell>
          {columnHeaders.map(header => <TableCell key={header}>{header}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData.map((row, i) => (
          <TableRow className={classes.row} key={uuidv4()}>
            <TableCell key="rowNum">{i + 1}</TableCell>
            {row.map(cell => <TableCell key={uuidv4()}>{cell}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

SimpleTable.propTypes = {
  columnHeaders: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
