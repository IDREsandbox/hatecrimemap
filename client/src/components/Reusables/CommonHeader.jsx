import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from '@material-ui/core';
import ColoredButton from 'components/Reusables/ColoredButton';

const styles = (theme) => ({
    root: {},
    covidFlex: {
        flex: 1,
        color: '#fef900',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        color: 'white',
    },
    reportIncidentButton: {
        color: 'white',
    },
    gotoOriginal: {
        color: 'white',
    },
    gotoCovid: {
        color: 'white',
    },
    link: {
        textDecoration: 'none',
    },
    titleLink: {
        color: 'inherit',
    },
    homeTitle: {
        color: 'white',
    },
    rightBox: {
        justifyContent: 'right',
        flexDirection: 'row',
    },
    mainTitle: {
        textAlign: "center",
        fontFamily: 'Bebas Neue',
        fontWeight: 'bold',
        fontSize: 50,
        color: 'white',
        [theme.breakpoints.down("xs")]: {
            fontSize: 30,
        }
    },
    lightMode: {
        color: 'black'
    }
});

/** PROPS
 * noShadow - disables shadow
 * transparent - makes background transparent, disabled by defautl
 * backgroundColor - optional, overrules and sets a background color for header
 * light - makes all header content light mode
 */
const CommonHeader = (props) => {
    const { classes } = props;

    const location = useLocation();

    let headerStyle = {}

    if (props.backgroundColor) {
        headerStyle = { ...headerStyle, backgroundColor: props.backgroundColor, }
    }
    else if (props.transparent) {
        headerStyle = { ...headerStyle, background: 'transparent', }
    } else if (props.blurBackground) {
        headerStyle = { ...headerStyle,  background: 'transparent', backdropFilter: "blur(20px)", }
    }

    headerStyle = {...headerStyle, backgroundColor: '#000000'}

    return (
        <Box >
            <AppBar elevation={props.noShadow ? 0 : 7} position={props.absolute ? "absolute" : "static"} style={headerStyle} >
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        className={!props.light ? classes.mainTitle : `${classes.mainTitle} ${classes.lightMode}`}
                    >
                        Mapping Hate in the United States
                    </Typography>
                    <Box className={classes.flex} flexGrow={1} sx={{ flex: 1 }} />
                    {(location.pathname === '/map' || location.pathname === '/covid') &&
                        <Link to="/report" className={classes.link}>
                            <ColoredButton noIcon lightMode={!props.light ? false : true}>
                                Report an Incident 
                                <AddIcon m={3} />
                            </ColoredButton>
                        </Link>
                    }
                    {location.pathname === '/map' &&
                        <Link to="/covid" className={classes.link}>
                            <ColoredButton noIcon lightMode={!props.light ? false : true}>
                                See Covid Incidents
                            </ColoredButton>
                        </Link>
                    }
                    {location.pathname === '/covid' &&
                        <Link to="/map" className={classes.link}>
                            <ColoredButton noIcon lightMode={!props.light ? false : true}>
                                See All Other Incidents
                            </ColoredButton>
                        </Link>
                    }
                    {location.pathname !== '/home' && location.pathname !== '/' &&
                        <Link to='/home' className={classes.link}>
                            <ColoredButton backButton lightMode={!props.light ? false : true}>
                                Return Home
                            </ColoredButton>
                        </Link>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default withStyles(styles)(CommonHeader)