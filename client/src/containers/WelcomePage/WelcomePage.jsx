import React, { useEffect } from 'react'
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    mainTitle: {
        fontFamily: 'Bebas Neue',
        fontSize: 80,
        // TODO: Fix the below font resizing for mobile
        [theme.breakpoints.down("xs")]: {
            fontSize: 40,
        }
    }
});

function WelcomePage(props) {
    const { classes } = props;

    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            history.push('/home')
        }, 4000)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="IntroPageContainer"
        >
            <div className='IntroPage'>
                <Typography className={classes.mainTitle} variant='h3'>
                    Mapping Hate in the United States
                </Typography>
            </div>
        </motion.div>
    )
}

export default withStyles(styles)(WelcomePage);