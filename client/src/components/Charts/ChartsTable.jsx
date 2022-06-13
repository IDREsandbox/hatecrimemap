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
    lightRoot: {
        "& .MuiTableCell-head": {
            color: "black",
            backgroundColor: "#white"
        },
    },
    tableItem: {
        color: '#ffffff',
    },
    linkDecor: {
        textDecoration: 'none'
    },
    colorPrimary: {
        backgroundColor: 'black',
    },
    barColorPrimary: {
        backgroundColor: 'white',
    },
    darkMode: {
        backgroundColor: "#262626",
        color: "white",
    },
    lightMode: {
        color: "black",
        backgroundColor: "white"
    },
});

export default function ChartsTable(props) {
    const { toggleOpen, dialogOpen, popup_data, lockType, group, covid } = props;

    const classes = useStyles();

    return (
        <Dialog
            open={dialogOpen}
            onClose={() => toggleOpen(false)}
            maxWidth="xl"
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle className={covid ? classes.lightMode : classes.darkMode} id="responsive-dialog-title">{group} Hate Incidents</DialogTitle>
            <DialogContent
                className={covid ? classes.lightMode : classes.darkMode}
            >
                {!popup_data ?

                    <LinearProgress {...classes} classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }} />
                    : (
                        <Table stickyHeader aria-label="simple table" width="100%">
                            <TableHead className={covid ? classes.lightRoot : classes.root}>
                                <TableRow>
                                    <TableCell width="10%">Date (M/D/Y)</TableCell>
                                    {!covid &&
                                        <React.Fragment>
                                            <TableCell width="10%">{lockType === LOCK_TYPE.COUNTY ? 'County' : 'State'}</TableCell>
                                            <TableCell width="15%">Primary Reason</TableCell>
                                            <TableCell width="20%">Source</TableCell>
                                        </React.Fragment>
                                    }
                                    {covid &&
                                        <React.Fragment>
                                            <TableCell width="12%">City, State</TableCell>
                                            <TableCell width="12%">Ethnicity</TableCell>
                                            <TableCell width="12%">Gender</TableCell>
                                            <TableCell width="12%">Type</TableCell>
                                        </React.Fragment>
                                    }
                                    <TableCell width="42%">Description</TableCell>
                                </TableRow>
                            </TableHead>
                            {!covid &&
                                <TableBody>
                                    {popup_data.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className={classes.tableItem} width="10%">{row.date}</TableCell>
                                            {/* Change the following below to include {___} County, {state}? would need some complex stuff */}
                                            <TableCell className={classes.tableItem} width="10%">{lockType === LOCK_TYPE.COUNTY ? countyDisplayName(row.county, row.state) : row.state}</TableCell>
                                            <TableCell className={classes.tableItem} width="15%">{row.group}</TableCell>
                                            <TableCell className={`${classes.tableItem} ${classes.linkDecor}`} width="20%">{row.link ? <a href={row.link} className={classes.tableItem} target="_blank" rel="noreferrer noopener">{row.link}</a> : 'N/A'}</TableCell>
                                            <TableCell className={classes.tableItem} width="45%">{row.description || '--'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            }
                            {covid &&
                                <TableBody>
                                    {popup_data.map((row) => (
                                        <TableRow key={row.ID}>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{`${row.city}, ${row.state}`}</TableCell>
                                            <TableCell>{row.ethnicity}</TableCell>
                                            <TableCell>{row.gender}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            }
                        </Table>
                    )}
            </DialogContent>
            <DialogActions className={covid ? classes.lightMode : classes.darkMode} id="closeDataTable">
                <ColoredButton lightMode={covid} noIcon onClick={() => toggleOpen(false)}>
                    Close
                </ColoredButton>
            </DialogActions>
        </Dialog>
    );
}