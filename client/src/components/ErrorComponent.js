import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
 img: {
    maxWidth:'300px',
    width: '100%'
 },
 errorText: {
    textAlign: 'left',
    padding: '8px'
 },
 freepik: {
    color: 'grey',
    textDecoration: 'none',
    '&&:hover': {
        textDecoration: 'underline',
    }
 }
});

function ErrorComp(props) {
    const classes = useStyles();
    
    const errorTitle = props.error.type === 'connection' ? "Can't reach server..." : "Something went wrong...";
    const errorImg = props.error.type === 'connection' ? "/server-error.png" : "/error.png";

	return (
        <div>
            <Typography variant="subtitle1" className={classes.typographyTitle}>{errorTitle}</Typography>
            <br />
            <img src={errorImg} alt="Error" className={classes.img}></img>
            <br />
            <Link href="http://www.freepik.com" variant='caption' >Designed by Freepik</Link>
            <br />
            <br />
            <Typography>
                {props.error.message.split("\n").map((i, key) => {
                    return <p key={key}>{i}</p>;
                })}
            </Typography>
        </div>
	);
}

export default ErrorComp;