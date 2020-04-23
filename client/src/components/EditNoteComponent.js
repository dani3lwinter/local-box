import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = (theme) => ({
    typographyTitle: {
      marginTop:'16px'
    },
    title:{
        marginBottom: '8px',
        marginTop: '-8px'
    },
    underline: {
        "&&&:before": {
          borderBottom: "none"
        },
        "&&:after": {
          borderBottom: "none"
        }
      },
    formControl: {
        minWidth: 140,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    saveBottom: {
        marginLeft: theme.spacing(1),
    },
    space: {
        width: '100%',
    },

  });
function DelteDialog(props){
    return(
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Delete this Note?"}</DialogTitle>
            {/* <DialogContent></DialogContent> */}
            <DialogActions>
            <Button onClick={props.handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={props.handleDelete} color="primary" autoFocus>
                Delete
            </Button>
            </DialogActions>
        </Dialog>
      );
    
}
class EditNote extends Component{
    constructor(props){
        super(props);

        this.state = {
            deleteDialogOpen: false,
            selfDestruct: null,
            title: '',
            content:'',
        }
    }
    onChangeSelfDestruct = event => {
        this.setState({selfDestruct: event.target.value});
    };
    onChangeTitle = event => {
        this.setState({title: event.target.value});
    };
    onChangeContent = event => {
        this.setState({content: event.target.value});
    };
    onClickSave = event => {
        const newNote = {
            title: this.state.title,
            content: this.state.content,
            selfDestruct: this.state.selfDestruct,
        }
        const paramId =  this.props.match.params.noteId;
        if(paramId) newNote._id=paramId
        this.props.postNote(newNote);
        this.props.history.goBack();
    };

    onClickTrash = event => {
        this.setState({deleteDialogOpen:true});
    };
    
    handleCloseSeleteDialog = () => {
        this.setState({deleteDialogOpen:false});
    };

    handleDelete = () => {
        if(this.props.match.params.noteId)
            this.props.deleteNote(this.props.match.params.noteId)
        this.props.history.goBack();
        //this.setState({deleteDialogOpen:false});
    };

    componentDidMount(){
        const paramId =  this.props.match.params.noteId;
        if(paramId){
            let note = this.props.notes.items.filter(note => note._id===paramId)[0];
            this.setState({
                selfDestruct: note.selfDestruct,
                title: note.title,
                content:note.content
            });
        }
    }
    
    render() {
        const { classes } = this.props;

        return(
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom className={classes.typographyTitle}>Edit</Typography>
                <Card variant="outlined">
                    <CardContent>
                        <TextField fullWidth id="title" label="Title" className={classes.title} 
                            onChange={this.onChangeTitle} value={this.state.title} />
                        <TextField  fullWidth
                            id="content"
                            label="Note"
                            placeholder="Type something..."
                            multiline
                            rows="15"
                            InputProps={{ className: classes.underline }} 
                            onChange={this.onChangeContent} value={this.state.content}
                        />
                        
                    </CardContent>
                    <CardActions>
                    <Button variant="contained" color="primary" className={classes.saveBottom}
                        onClick={this.onClickSave}>Save</Button>
                    <div className={classes.space}/>
                    <FormControl margin='dense' variant="outlined" className={classes.formControl}>
                        {/* <InputLabel id="destruct-label">Self Destruct</InputLabel> */}
                        <Select
                            labelId="destruct-label"
                            id="destructt"
                            value={this.state.selfDestruct}
                            onChange={this.onChangeSelfDestruct}
                            //label="Self Destruct"
                        >
                            <MenuItem value={null}>Never</MenuItem>
                            <MenuItem value='1'>1 Hour</MenuItem>
                            <MenuItem value='8'>8 Hours</MenuItem>
                            <MenuItem value='24'>24 Hours</MenuItem>
                            <MenuItem value='72'>3 Days</MenuItem>
                        </Select>
                    </FormControl>
                        
                        <IconButton aria-label="Delete" className={classes.iconToRight}
                            onClick={this.onClickTrash}>
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                </Card>
                <DelteDialog
                   open={this.state.deleteDialogOpen}
                   handleClose={this.handleCloseSeleteDialog}
                   handleDelete={this.handleDelete} />
            </Container>
        );
    }
}
export default withStyles(styles)(withRouter(EditNote));