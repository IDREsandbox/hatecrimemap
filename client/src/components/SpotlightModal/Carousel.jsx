import React, { useState } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, DotGroup } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        position: "relative",
        overflow: "hidden"
    },
    indicators: {
        width: "100%",
        marginTop: "10px",
        textAlign: "center"
    },
    indicator: {
        cursor: "pointer",
        transition: "200ms",
        padding: 0,
        color: "#afafaf",
        '&:hover': {
            color: "#1f1f1f"
        },
        '&:active': {
            color: "#1f1f1f"
        }
    },
    indicatorIcon: {
        fontSize: "15px",
    },
    active: {
        color: "#494949"
    },
    buttonWrapper: {
        margin: '1em',
        height: "40px",
        width: '100px',
        backgroundColor: "transparent",
        '&:hover': {
            '& $button': {
                backgroundColor: "black",
                filter: "brightness(120%)",
                opacity: "0.4"
            }
        }
    },
    fullHeightHoverWrapper: {
        height: "100%", // This is 100% - indicator height - indicator margin
        top: "0"
    },
    buttonVisible: {
        opacity: "1"
    },
    buttonHidden: {
        opacity: "0",
    },
    button: {
        margin: "0 10px",
        position: "relative",
        backgroundColor: "#494949",
        top: "calc(50% - 20px) !important",
        color: "white",
        fontSize: "30px",
        transition: "200ms",
        cursor: "pointer",
        '&:hover': {
            opacity: "0.6 !important"
        },
    },
    next: {
        right: 0
    },
    prev: {
        left: 0
    },
    card: {
        margin: '1em',
        width: '50%',
    },
    container: {
        height: '100%',
        width: '100%',
        margin: '2em 1em',
    },
    leftArrow: {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50 %)',
    },
    rightArrow: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50 %)',
    },
    p: {
        width: '200px',
    }
});




const Carousel = props => {

    const { items } = props;

    const classes = useStyles();

    const renderChildren = (props) => {

    }

    console.log(classes);

    return (
        <div className={classes.container}>
            <CarouselProvider
                visibleSlides={3}
                totalSlides={6}
                step={1}
                naturalSlideWidth={400}
                naturalSlideHeight={500}
                className={classes.card}
            >
                <h1 className={classes.headline}>
                    Featured Stories
                </h1>
                <p>
                    This uses a customized spinner.
                </p>
                <Slider className={classes.slider}>
                    <Slide index={0}>
                        <p className={classes.p}>
                            Hello
                        </p>          </Slide>
                    <Slide index={1}>
                        <p>
                            Hello
                        </p>          </Slide>
                    <Slide index={2}>
                        <p>
                            Hello
                        </p>          </Slide>
                    <Slide index={3}>
                        <p>
                            Hello
                        </p>          </Slide>
                    <Slide index={4}>
                        <p>
                            Hello
                        </p>          </Slide>
                    <Slide index={5}>
                        <p>
                            Hello
                        </p>
                    </Slide>
                </Slider>
                <ButtonBack className={`${classes.leftArrow} ${classes.buttonWrapper}`} >Back</ButtonBack>
                <ButtonNext className={`${classes.rightArrow} ` + `${classes.buttonWrapper}`}>Next</ButtonNext>
            </CarouselProvider>
        </div>
    );
}

export default Carousel;