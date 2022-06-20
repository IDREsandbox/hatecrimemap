import React from 'react'
import { motion } from 'framer-motion';
import './LandingPage.css'
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkedAlt, faInfoCircle, faBullhorn, faInfo } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme) => ({
    LandingTitle: {
        color: 'white',
        fontSize: 32,
        height: '100%'
    },
    gridDisplay: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr ',
        alignItems: 'center',
        justifyItems: 'center',
        height: '100%',
    },
    LandingSection: {
        [theme.breakpoints.down("xs")]: {
            height: "calc(100% / 3)"
        }
    }
}));


const styles = {
    LandingTitle: {
        color: 'white',
        fontSize: 32,
        height: '100%'
    },
    gridDisplay: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr ',
        alignItems: 'center',
        justifyItems: 'center',
        height: '100%'
    }
}

const LandingPage = (props) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={classes.LandingTitle}
        >
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                style={{
                    height: "100%"
                }}
            >
                <Grid
                    container
                    md={4}
                    xs={12}
                    onClick={() => {
                        document.body.style = 'background: rgba(0,0,0)'
                        history.push('/about')
                    }}
                    direction="column"
                    justifyContent='space-evenly'
                    alignItems='center'
                    className='outer LandingPageSection'
                >
                    <Grid
                        container
                        direction="column"
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Link className='Landing-Link' to="/about">
                            About
                        </Link>
                        <p className='Landing-Description'>
                            More about the project
                        </p>
                    </Grid>
                    <FontAwesomeIcon
                        icon={faInfo}
                        className='My-Icon'
                        size="3x"
                    />
                </Grid>
                <Grid
                    container
                    md={4}
                    xs={12}
                    onClick={() => {
                        document.body.style = 'background: rgba(0,0,0)';
                        history.push('/map')
                    }}
                    direction="column"
                    justifyContent='space-evenly'
                    alignItems='center'
                    className='LandingPageSection'
                >
                    <Grid
                        container
                        direction="column"
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Link className='Landing-Link' to="/map">
                            Explore
                        </Link>
                        <p className='Landing-Description'>
                            Interactive maps depicting hate crime incidents throughout the United States
                        </p>
                    </Grid>
                    <FontAwesomeIcon
                        icon={faMapMarkedAlt}
                        className='My-Icon'
                        size="3x"
                    />
                </Grid>
                <Grid
                    container
                    md={4}
                    xs={12}
                    onClick={() => {
                        document.body.style = 'background: rgba(255,255,255)'
                        history.push('/report')
                    }}
                    direction="column"
                    justifyContent='space-evenly'
                    alignItems='center'
                    className='outer LandingPageSection'
                >
                    <Grid
                        container
                        direction="column"
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Link className='Landing-Link' to="/report">
                            Speak Out
                        </Link>
                        <p className='Landing-Description'>
                            Anonymously report a hate crime incident
                        </p>
                    </Grid>
                    <FontAwesomeIcon
                        icon={faBullhorn}
                        className='My-Icon'
                        size="3x"
                    />
                </Grid>
            </Grid>

            {/* <div style={{ ...styles.gridDisplay }}>

            </div> */}
        </motion.div>
    )
}
export default LandingPage;
// instead of using js complex could simply add classes?