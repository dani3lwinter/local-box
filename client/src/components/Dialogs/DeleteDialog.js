import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//import { makeStyles } from '@material-ui/core/styles';
/*const useStyles = makeStyles(theme => ({

}));*/

function DeleteDialog(props) {
	//const classes = useStyles();

	/**
	 * Handler fot DELETE button on the DeleteDialog
	 */
	const handleDelete = () => {
		// When the user agree to delete a file,
		// an action deleteFile is dispatched and the dialog closes
		props.handleDelete(props.fileId)
		props.handleClose();
	};

	return (
		<Dialog
			open={props.open}
			onClose={props.handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="dialog-title">
				{"Delete this file?"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="dialog-description">
						Are you sure you want to delete the file "{props.filename}"?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.handleClose} color="primary">
					Cancel
        		</Button>
				<Button onClick={handleDelete} color="primary" autoFocus>
					Delete
       			</Button>
			</DialogActions>
		</Dialog>
	);
}

export default DeleteDialog;