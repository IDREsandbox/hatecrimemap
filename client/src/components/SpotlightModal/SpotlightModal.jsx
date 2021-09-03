/*  eslint import/no-unresolved: 0, global-require: 0  */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Paper } from '@material-ui/core'

import { ABOUT_DIALOGS } from '../../res/values/string';

import Carousel from './Carousel'

const styles = {
    aboutButton: {
        color: 'white',
    },
    images: {
        display: 'table',
        'border-collapse': 'collapse',
        width: '100%',
    },
    inline: {
        display: 'table-cell',
        'vertical-align': 'middle',
        '& img': {
            display: 'block',
            width: '100%',
            height: 'auto',
        },
    },
    mainModal: {
        width: '100%',
    }
};


function Item(props) {
    return (
        <Paper>
            <h2>{props.item.name}</h2>
            <p>{props.item.description}</p>

            <Button className="CheckButton">
                Check it out!
            </Button>
        </Paper>
    )
}



function SpotlightModal(props) {
    const { classes } = props;

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    var items = [
        {
            name: "Random Name #1",
            description: "Probably the most random thing you have ever seen!"
        },
        {
            name: "Random Name #2",
            description: "Hello World!"
        }
    ]

    return (
        <div>
            <Button className={classes.aboutButton} onClick={handleClickOpen}>
                About
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                className={classes.mainModal}
            >
                <DialogContent>
                    <Carousel >
                    </Carousel>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

};

/*
Thoughts
    So we're trying to highlight a few of the stories on the site. Is it worthwile to create a modal specifically for highlighting states or should it just be included
        in the first time overlay?

    Idea: I think I should include the same inner workings of the spotlightModal in the first time overlay with just general stories
    Upon "locking" onto a state, have a button appear on sidebar (so much wasted space) to
    Ok -> have a slideshow component as part of the inner workings sof the spotlightModal, then add 

*/

SpotlightModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpotlightModal);
