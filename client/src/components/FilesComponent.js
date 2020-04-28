import React, { Component, Fragment } from 'react';
import FilesGrid from './FilesGridComponent'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import UploadDialog from './Dialogs/UploadDialog';
import DeleteDialog from './Dialogs/DeleteDialog';
import DownloadDialog from './Dialogs/DownloadDialog';
import { connect } from "react-redux";
import { postFiles, deleteFile, fetchFiles } from '../redux/ActionCreators/filesActions'
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const styles = (theme) => ({
  typographyTitle: {
    textAlign: 'left',
    padding: theme.spacing(2, 2, 0),
  },
  root: {
    paddingBottom: 56 + theme.spacing(2),
  },
  uploadFilesButton: {
    marginBottom: theme.spacing(2)
  },
});

const mapDispatchToProps = dispatch => ({
  fetchFiles: () => dispatch(fetchFiles()),
  postFiles: (uploadFormValues) => dispatch(postFiles(uploadFormValues)),
  deleteFile: (fileID) => dispatch(deleteFile(fileID)),
});

const mapStateToProps = state => ({
  files: state.files
});


/**
 * Class component for the 'Files' page,
 * where the user can upload, download and
 * delete files from the server
 */
class Files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      downloadDialog: {
        open: false,
        handleClose: this.closeDialog('downloadDialog'),
        fileId:   '',
        filename: '',
      },

      deleteDialog: {
        open: false,
        handleClose: this.closeDialog('deleteDialog'),
        handleDelete: this.props.deleteFile,
        fileId:   '',
        filename: '',
      },

      uploadDialog: {
        open: false,
        handleClose: this.closeDialog('uploadDialog'),
        postFiles: this.props.postFiles
      },

    }
  }

  componentDidMount() {
    // fetch files record from the server
    this.props.fetchFiles()
  }

  /**
   * A function that gets a dialog name and returns
   * a funciton that closes that dialog
   */
  closeDialog = (dialogName) => () => {
    this.setState(state => {
      return {
        [dialogName]: {
          ...state[dialogName],
          open: false,
        }
      }
    });
  }

  /**
   * Handler to open UploadDialog component
   * (When UPLOAD FILES is clicked)
   */
  openUploadDialog = () => {
    this.setState(state => {
      return {
        uploadDialog: {
          ...state.uploadDialog,
          open: true,
        }
      }
    });
  }

  /**
   * Handler to open DeleteDialog component
   * (When the trash can icon is clicked)
   */
  openDeleteDialog = (filename, fileId) => () => {
    this.setState(state => {
      return {
        deleteDialog: {
          ...state.deleteDialog,
          open:     true,
          fileId:   fileId,
          filename: filename,
        }
      }
    });
  };

  /**
   * Handler to open DownloadDialog component
   * (When the lock icon of an encrypted file is clicked)
   */
  openDownloadDialog = (filename, fileId) => () =>{
    this.setState(state => {
      return {
        downloadDialog: {
          ...state.downloadDialog,
          open:     true,
          fileId:   fileId,
          filename: filename,
        }
      }
    });
  }


  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.root} maxWidth='sm'>
        <Typography variant="h4" gutterBottom className={classes.typographyTitle}>Files</Typography>
        <Button variant="contained" size="large" color="primary" onClick={this.openUploadDialog}
          startIcon={<CloudUploadIcon />} className={classes.uploadFilesButton}>
          Upload Files
        </Button>
        <FilesGrid
          isLoading={this.props.files.isLoading}
          items={this.props.files.items}
          openDeleteDialog={this.openDeleteDialog}
          openDownloadDialog={this.openDownloadDialog}
          />
        <DownloadDialog {...this.state.downloadDialog}/>
        <DeleteDialog   {...this.state.deleteDialog}  />
        <UploadDialog   {...this.state.uploadDialog}  />
      </Container>
    );
  }
}

// use rredux actions and store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Files));