import * as React from 'react';
import { motion } from 'framer-motion';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Girid'
import { withStyles } from '@material-ui/styles';
import { ABOUT_DIALOGS } from 'res/values/string';

const aboutpageVariants = {
    initial: {
        opacity: 0
    },
    in: {
        opacity: 1
    },
    out: {
        opacity: 0
    },
}

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
    page: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        flexGrow: 1,
    },
    page1: {
        backgroundColor: 'rgba(33, 120, 191)',
    },
    page2: {
        backgroundColor: 'rgba(33, 120, 191)',
    },
    page3: {
        backgroundColor: 'rgba(33, 120, 191)'
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
        fontSize: 18,
        color: '#ffffff'
    },
    secondTitle: {
        fontWeight: 'bold',
        color: 'white',
        marginTop: '1em',
        textAlign: 'left'
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
        marginTop: '0.5em',
        textAlign: 'center'
    },
    mylink: {
        color: 'white'
    }
});



function AboutPage(props) {
    const { classes } = props;

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={aboutpageVariants}
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
                        This project aims to publicize the occurrence of stastically underreported hate-based attacks to speak out for those who are suffering.
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="baseline">
                <Grid item xs={10} m={4}>
                    <Typography className={classes.secondTitle} variant="h4" gutterBottom>
                        About the Project
                    </Typography>
                    <Typography className={classes.paragraph} paragraph>
                        {ABOUT_DIALOGS.HCM.PARAGRAPH1}
                    </Typography>
                    <Typography className={classes.paragraph} paragraph gutterBottom>
                        {ABOUT_DIALOGS.HCM.PARAGRAPH2}
                    </Typography>
                    <Typography className={classes.paragraph} paragraph gutterBottom>
                        {ABOUT_DIALOGS.HCM.PARAGRAPH3}
                    </Typography>
                    <Typography className={classes.paragraph} paragraph gutterBottom>
                        {ABOUT_DIALOGS.HCM.PARAGRAPH4}
                    </Typography>
                    <Typography className={classes.paragraph} paragraph gutterBottom>
                        Any questions? Email us at
                        {' '} <a  className={classes.mylink}href={`mailto:${ABOUT_DIALOGS.HCM.EMAIL}?Subject=Hate%20Crime%20Map%20Inquiry`}> {ABOUT_DIALOGS.HCM.EMAIL}</a>
                    </Typography>
                </Grid>
                <Grid item xs={10} s={4} m={4}>
                    <Typography className={classes.secondTitle} variant="h4" gutterBottom>
                        Acknowledgments
                    </Typography>
                    <Typography className={classes.paragraph} paragraph>
                        {ABOUT_DIALOGS.HCM.ACKNOWLEDGEMENTS1}
                    </Typography>
                    <Typography className={classes.paragraph} paragraph>
                        {ABOUT_DIALOGS.HCM.ACKNOWLEDGEMENTS2}
                    </Typography>
                </Grid>
            </Grid>
        </motion.div>
    );
}

export default withStyles(styles)(AboutPage);