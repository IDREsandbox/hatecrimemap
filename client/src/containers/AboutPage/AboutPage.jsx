import * as React from 'react';
import { motion } from 'framer-motion';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/styles';
import { ABOUT_DIALOGS } from 'res/values/string';
import { PageVariants } from 'res/values/variants';

const styles = (theme) => ({
    root: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 0,
        width: '500px',
        textAlign: 'center',
    },
    headline: {
        padding: theme.spacing(3),
    },
    textField: {
        margin: theme.spacing(3),
        width: '300px',
    },
    button: {
        margin: theme.spacing(3),
        marginTop: '50px',
        width: '300px',
    },
    copy: {
        color: 'white',
        fontFamily: 'Helvetica Neue, sans-serif',
        fontWeight: 'bold',
        fontSize: 32,
    },
    link: {
        color: 'white',
        display: 'block',
        marginTop: 10,
        fontSize: 15
    },
    container: {
        [theme.breakpoints.down(780)]: {// template for media queries using materialUI
            paddingTop: "3em",
        },
        marginBottom: '2em'
    },
    mainTitle: {
        textAlign: "center",
        fontFamily: 'Bebas Neue',
        fontWeight: 'bold',
        fontSize: 50,
        color: 'white',
    },
    paragraph: {
        [theme.breakpoints.down(780)]: {
            paddingTop: "3em",
        },
        fontSize: 24,
        color: '#ffffff'
    },
    secondTitle: {
        fontWeight: 'bold',
        color: 'white',
        marginTop: '1em',
        marginBottom: '1.5em',
        textAlign: 'center'
    },
    image: {
        maxWidth: '100%',
        borderRadius: '1em'
    },
    largeIcon: {
        width: 60,
        height: 60,
        cursor: 'pointer',
        color: 'white',
        "&:hover": {
            color: 'rgba(255,255,255,0.7)'
        }
    },
    customButton: {
        fontFamily: 'Bebas Neue',
        fontSize: 20,
        color: 'white',
        border: '1px solid white'
    },
    mainTitle: {
        [theme.breakpoints.down(780)]: {
            fontSize: 25,
        },
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        marginTop: '1em',
        textAlign: 'center'
    },
    mylink: {
        textAlign: 'center',
        color: 'white'
    },
    textCenter: {
        marginTop: 'auto',
        textAlign: 'center',
    }
});

function AboutPage(props) {
    const { classes } = props;

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={PageVariants}
            transition={{ duration: 0.5 }}
            style={{ overflowX: 'hidden' }}
        >
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={10} s={4} m={12}>
                    <Typography className={classes.mainTitle} variant="h4" >
                        About the Project
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="baseline">
                <Grid item xs={10} s={4} m={4}>
                    <Typography className={classes.secondTitle} variant="h4" gutterBottom>
                        This project aims to publicize the occurrence of stastically underreported hate-based attacks to speak out for those who are suffering.
                    </Typography>
                    <Typography className={classes.paragraph} paragraph>
                        {ABOUT_DIALOGS.HCM.PARAGRAPH1}
                    </Typography>
                    <Typography className={classes.paragraph} paragraph gutterBottom>
                        {ABOUT_DIALOGS.HCM.PARAGRAPH2}
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-end">
                <Typography className={`${classes.paragraph} ${classes.textCenter}`} paragraph gutterBottom>
                    Any questions? Email us at
                    {' '} <a className={classes.mylink} href={`mailto:${ABOUT_DIALOGS.HCM.EMAIL}?Subject=Hate%20Crime%20Map%20Inquiry`}> {ABOUT_DIALOGS.HCM.EMAIL}</a>
                </Typography>
            </Grid>
        </motion.div>
    );
}

export default withStyles(styles)(AboutPage);