import React from 'react';
import { baseUrl } from '../../baseUrl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

//import { makeStyles } from '@material-ui/core/styles';
/*const useStyles = makeStyles(theme => ({

}));*/
/*

*/
/**
   * Component that renders a dialog 
   */

function DownloadDialog(props) {
    //const classes = useStyles();
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}>
            <DialogTitle id="download-dialog-title">
                Download Encrypted File
            </DialogTitle>
            <form method="post"
                action={baseUrl + 'api/files/decrypt/' + props.filename}>
                <DialogContent>
                    <input hidden
                        type='text'
                        name='id'
                        value={props.fileId}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                    />
                    <DialogContentText>
                        If you enter the wrong password, the downloaded file will be corrupted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={props.handleClose}
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={props.handleClose}
                        color="primary">
                        Download
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default DownloadDialog;