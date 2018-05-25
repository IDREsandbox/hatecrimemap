import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const TableWrapper = ({ tableHeader, columnHeaders, bodyData, footer, onClick }) => {
  console.log(bodyData[0]);
  const tableRows = bodyData.map((row) => {
    const link = row.validsourceurl === 'true'
      ? <button><a href={row.sourceurl} target="_blank">Source Link</a></button>
      : 'No link';
    return (
      <TableRow key={row.featureid} selectable={false}>
        <TableRowColumn>{row.id + 1}</TableRowColumn>
        <TableRowColumn>{row.locationname}</TableRowColumn>
        <TableRowColumn>05/12/2018</TableRowColumn>
        <TableRowColumn>{row.groupharassedcleaned}</TableRowColumn>
        <TableRowColumn tooltip="test">{link}</TableRowColumn>
        <TableRowColumn><button onClick={() => onClick(row.id)}>Edit</button></TableRowColumn>
      </TableRow>
    );
  });

  return (
    <Table height="calc(100vh - 250px" fixedHeader>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn colSpan={columnHeaders.length} style={{ textAlign: 'center' }}>
            {tableHeader}
          </TableHeaderColumn>
        </TableRow>
        <TableRow>
          {columnHeaders.map(header => <TableHeaderColumn key={header}>{header}</TableHeaderColumn>)}
        </TableRow>
      </TableHeader>
      <TableBody stripedRows displayRowCheckbox={false}>
        {tableRows}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableRowColumn style={{ textAlign: 'center' }}>
            {footer}
          </TableRowColumn>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

TableWrapper.defaultProps = {
  onClick: null,
};

TableWrapper.propTypes = {
  tableHeader: PropTypes.string.isRequired,
  columnHeaders: PropTypes.arrayOf(PropTypes.string).isRequired,
  bodyData: PropTypes.arrayOf(PropTypes.object).isRequired,
  footer: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default TableWrapper;
