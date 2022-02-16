import React from "react";

import { makeStyles } from "@material-ui/core";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { countyDisplayName } from '../../utils/data-utils';
import { Button, LinearProgress } from '@material-ui/core';
import ColoredButton from 'components/Reusables/ColoredButton';

const LOCK_TYPE = {
    COUNTY: 'county',
    STATE: 'state',
};

const useStyles = makeStyles({
    root: {
        "& .MuiTableCell-head": {
            color: "white",
            backgroundColor: "#262626"
        },
    },
    title: {
        backgroundColor: "#262626",
        color: "#ffffff"
    },
    closebuttons: {
        backgroundColor: "#262626",
        color: "white",
    },
    tableItem: {
        color: '#ffffff',
    },
    linkDecor: {
        textDecoration: 'none'
    },
    progressBar: {
        color: "green"
    },
    colorPrimary: {
        backgroundColor: 'black',
    },
    barColorPrimary: {
        backgroundColor: 'white',
    }
});

export default function ChartsTable(props) {
    const { toggleOpen, dialogOpen, popup_data, lockType } = props;

    const classes = useStyles();

    return (
        <Dialog
            open={dialogOpen}
            onClose={() => toggleOpen(false)}
            maxWidth="xl"
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle className={classes.title} id="responsive-dialog-title">Hate Crimes</DialogTitle>
            <DialogContent
            >
                {!popup_data ?

                    <LinearProgress {...classes} classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}} />
                    : (
                        <Table stickyHeader aria-label="simple table" width="100%">
                            <TableHead className={classes.root}>
                                <TableRow className={classes.tableRow}>
                                    <TableCell width="10%">Date (M/D/Y)</TableCell>
                                    <TableCell width="10%">{lockType === LOCK_TYPE.COUNTY ? 'County' : 'State'}</TableCell>
                                    <TableCell width="15%">Primary Reason</TableCell>
                                    <TableCell width="20%">Source</TableCell>
                                    <TableCell width="45%">Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {popup_data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className={classes.tableItem} width="10%">{row.date}</TableCell>
                                        {/* Change the following below to include {___} County, {state}? would need some complex shit  */}
                                        <TableCell className={classes.tableItem} width="10%">{lockType === LOCK_TYPE.COUNTY ? countyDisplayName(row.county, row.state) : row.state}</TableCell>
                                        <TableCell className={classes.tableItem} width="15%">{row.group}</TableCell>
                                        <TableCell className={`${classes.tableItem} ${classes.linkDecor}`} width="20%">{row.link ? <a href={row.link} className={classes.tableItem} target="_blank" rel="noreferrer noopener">{row.link}</a> : 'N/A'}</TableCell>
                                        <TableCell className={classes.tableItem} width="45%">{row.description || '--'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
            </DialogContent>
            <DialogActions className={classes.closebuttons} id="closeDataTable">
                <ColoredButton noIcon buttonClick={() => toggleOpen(false)}>
                    Close
                </ColoredButton>
            </DialogActions>
        </Dialog>
    );
}