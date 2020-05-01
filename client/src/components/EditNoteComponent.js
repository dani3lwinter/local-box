import React, { Component } from 'react';
import { connect } from "react-redux";
import { postNote, deleteNote } from '../redux/ActionCreators/notesActions'

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
  
const mapDispatchToProps = dispatch => ({
    postNote: (note) => dispatch(postNote(note)),
    deleteNote: (noteID) => dispatch(deleteNote(noteID)),
});

const mapStateToProps = state => ({
    notes: state.notes
});

  
function DeleteDialog(props){
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
            id: null,
            deleteDialogOpen: false,
            selfDestruct: '8',
            title: '',
            content:'',
            touched: false
        }
    }

    /** Handler for self destruct field in the note */
    onChangeSelfDestruct = event => {
        this.setState({
            selfDestruct: event.target.value,
            touched: true
        });
    };

    /** Handler for titile of the noe */
    onChangeTitle = event => {
        this.setState({
            title: event.target.value,
            touched: true
        });
    };

    /** Handler for the content field of the note */
    onChangeContent = event => {
        this.setState({
            content: event.target.value,
            touched: true
        });
    };

    /** Handler when the users saves a note */
    onClickSave = event => {
        // create the new note object
        const newNote = {
            _id: this.state.id,
            title: this.state.title,
            content: this.state.content,
            selfDestruct: this.state.selfDestruct,
        }

        // dispatch post note to redux and go back to the notes list
        this.props.postNote(newNote);
        //this.props.history.goBack();
    };

    /** Handler when the user click the trash\delete */
    onClickTrash = event => {
        this.setState({ deleteDialogOpen:true });
    };
    
    handleCloseDeleteDialog = () => {
        this.setState({deleteDialogOpen:false});
    };

    handleDelete = () => {
        if(this.props.match.params.noteId)
            this.props.deleteNote(this.props.match.params.noteId)
        //this.props.history.goBack();
        //this.setState({deleteDialogOpen:false});
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        // if the notes list is still loading, dont change the state
        if(nextProps.notes.isLoading)
            return null;

        // get note id from url
        const paramId = nextProps.match.params.noteId;

        // if the url havnt changed
        if( paramId === prevState.id){
            // dont change the state
            return null
        }

        // if no id in the url, create empty note
        if(!paramId){
            return prevState.touched ? null : 
            {
                id: null,
                selfDestruct: '8',
                title: '',
                content:'',
                touched: false
            };
        }

        // find the note to edit from the url param
        var note = nextProps.notes.items.filter(n => n._id===paramId)[0];
        if( !note ){     // if no note found
            alert('Note '+paramId+' Not Found');
            return null;
        }
        else{
            // load the note to state
            return {
                id:             note._id,
                selfDestruct:   note.selfDestruct,
                title:          note.title,
                content:        note.content,
                touched:        false
            };
        } 
		
	}
    
    render() {
        const { classes } = this.props;

        return(
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom className={classes.typographyTitle}>
                    {this.props.match.path === "/newNote" ? 'New Note' : 'Edit'}
                </Typography>
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
                        <InputLabel id="destruct-label">Self Destruct</InputLabel>
                        <Select
                            labelId="destruct-label"
                            id="destructt"
                            value={this.state.selfDestruct}
                            onChange={this.onChangeSelfDestruct}
                            label="Self Destruct"
                        >
                            <MenuItem value='-1'>Never</MenuItem>
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
                <DeleteDialog
                   open={this.state.deleteDialogOpen}
                   handleClose={this.handleCloseDeleteDialog}
                   handleDelete={this.handleDelete} />
            </Container>
        );
    }
}
// use redux actions and store
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withRouter(EditNote)));