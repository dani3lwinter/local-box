import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const styles = (theme) => ({
    input: {
        //display: 'none',
    },
    selfDestruct: {
        marginTop: theme.spacing(2)
    },
    TopDialogContent:{
        "&&:first-child":{
            paddingTop: theme.spacing(1),
            paddingBottom:  theme.spacing(2)
        }   
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
});



class UploadDialog extends Component{
    constructor(props){
        super(props);

        this.state = {
            formValues: {
                files: [],
                encryptChecked: false,
                password: '',
                selfDestruct: '8'
            },
            formErrors: {
                files: "",
                password: "",
            },
            formValidity: {
                files: false,
                password: true,
            }
        };
    }

    handleChange = ({ target }) => {
        console.log(target)
        const { formValues } = this.state;
        if(target.name === 'encryptChecked')
            formValues[target.name] = target.checked;
        else if(target.name === 'files')
            formValues[target.name] = target.files;
        else
            formValues[target.name] = target.value;
        console.log(formValues[target.name])
        this.setState({ formValues });
        this.handleValidation(target);

        //this.setState({ encryptChecked: event.target.checked });
    };

    handleValidation = target => {
        const { name, value } = target;
        const { formErrors,  formValidity, formValues} = this.state;  
        if(name === 'files'){
            formValidity[name] = formValues[name] !== 0 
            formErrors[name] = formValidity[name] ? "" : 'Choose at least one file';
        }
        else if(name === 'password' || name === 'encryptChecked'){
            formValidity['password'] = (value.length >= 4) || !formValues.encryptChecked         
            formErrors['password'] = formValidity['password'] ? "" : 'Password should be at least 4 characters';
        }
    };

    handleClose = () => {
        this.setState({
            formValues: {
                files: [],
                encryptChecked: false,
                password: '',
                selfDestruct: '8'
            },
            formErrors: {
                files: "",
                password: "",
            },
            formValidity: {
                files: false,
                password: true,
            }
        });
        this.props.handleClose();
    }

    // when upload button clicked, dispath POST files to redux
    handleSubmit = event => {
        event.preventDefault();
        const { formValues, formValidity } = this.state;
        if (Object.values(formValidity).every(Boolean)) {
          this.props.postFiles(formValues)
          this.props.handleClose();
        }
      };

    render(){
        const { classes } = this.props;
        const { formValues, formErrors,formValidity, isSubmitting } = this.state;
        return (
            <Dialog open={this.props.open} onClose={this.handleClose} >
                <DialogTitle id="upload-dialog-title">
                    Upload Files
                    <IconButton className={classes.closeButton}
                        onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>   
                </DialogTitle>
                <form onSubmit={this.props.handleSubmit}>
                <DialogContent className={classes.TopDialogContent}>
                    <input
                        id="upload-files-button"
                        name="files"
                        multiple
                        type="file"
                        onChange={this.handleChange}
                        hidden
                        className={classes.input}/>
                    <label htmlFor="upload-files-button" >
                        <Button fullWidth variant="outlined" color="primary" size="large" component="span"
                            className={classes.uploadFilesButton}>
                            {
                                formValues.files.length === 1 ? formValues.files[0].name
                                : formValues.files.length > 1 ? formValues.files.length+' Files Selected'
                                : 'Select Files'
                            }
                        </Button>
                    </label>
                    
                </DialogContent>
                <Divider />
                <DialogContent>   
                    <FormControlLabel 
                        label="Encrypt" 
                        
                        control={
                            <Checkbox name="encryptChecked"
                                checked={formValues.encryptChecked}
                                onChange={this.handleChange}
                                color="primary" />
                            }
                        />
                    
                    <TextField  margin='dense' fullWidth variant="filled"
                        disabled={!formValues.encryptChecked}
                        value={formValues.password}
                        onChange={this.handleChange}
                        error={!formValidity.password}
                        name="password"
                        id="password"
                        label="Password"
                        type="password"
                        helperText={ !formValidity.password ? formErrors.password :
                            "If you lose the password, you won't be able to accsess the file"}          
                    />
                    <FormControl   margin='dense' variant="filled" fullWidth className={classes.selfDestruct}>
                        <InputLabel id="destruct-label-2">Self Destruct</InputLabel>
                        <Select
                            labelId="destruct-label-2"
                            id="selfDestruct"
                            name="selfDestruct"
                            value={formValues.selfDestruct}
                            onChange={this.handleChange}
                            label="Self Destruct" >
                            <MenuItem value='-1'>Never</MenuItem>
                            <MenuItem value='1'>1 Hour</MenuItem>
                            <MenuItem value='8'>8 Hours</MenuItem>
                            <MenuItem value='24'>24 Hours</MenuItem>
                            <MenuItem value='72'>3 Days</MenuItem>
                        </Select>
                    </FormControl>    
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={this.handleSubmit} color="primary">
                        Upload
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
        );
    }
}

export default withStyles(styles)(UploadDialog)