import React, { Component, Fragment } from 'react';
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import UploadDialog from './UploadDialogComponent'
import { connect } from "react-redux";
import { postFiles, deleteFile, fetchFiles } from '../redux/ActionCreators/filesActions'
import { baseUrl } from '../baseUrl';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import LockIcon from '@material-ui/icons/Lock';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const FILE_KNOWN_EXT = ['ACC', 'AE', 'AI', 'AN', 'AVI', 'BMP', 'CSV', 'DAT', 'DGN', 'DOC', 'DOCH', 'DOCM', 'DOCX', 'DOTH', 'DW', 'DWFX', 'DWG', 'DXF', 'DXL', 'EML', 'EPS', 'F4A', 'F4V', 'FILE', 'FLV', 'FS', 'GIF', 'HTML', 'IND', 'JPEG', 'JPG', 'JPP', 'Log', 'LR', 'M4V', 'MBOX', 'MDB', 'MIDI', 'MKV', 'MOV', 'MP3', 'MP4', 'MPEG', 'MPG', 'MPP', 'MPT', 'MPW', 'MPX', 'MSG', 'ODS', 'OGA', 'OGG', 'OGV', 'ONE', 'OST', 'PDF', 'PHP', 'PNG', 'POT', 'POTH', 'POTM', 'POTX', 'PPS', 'PPSX', 'PPT', 'PPTH', 'PPTM', 'PPTX', 'PREM', 'PS', 'PSD', 'PST', 'PUB', 'PUBH', 'PUBM', 'PWZ', 'RAR', 'READ', 'RP', 'RTF', 'SQL', 'SVG', 'SWF', 'TIF', 'TIFF', 'TXT', 'URL', 'VCF', 'VDX', 'VOB', 'VSD', 'VSS', 'VST', 'VSX', 'VTX', 'WAV', 'WDP', 'WEBM', 'WMA', 'WMV', 'XD', 'XLS', 'XLSM', 'XLSX', 'XML', 'ZIP'];

const styles = (theme) => ({
  typographyTitle: {
    textAlign: 'left',
    padding: theme.spacing(2, 2, 0),
  },
  root: {
    paddingBottom: 56 + theme.spacing(2),
  },
  deleteIcon: {
    marginLeft: 'auto',
  },
  lockIcon: {
    color: theme.palette.success.main
  },
  button: {
    margin: theme.spacing(1),
  },
  cardContent: {
    paddingBottom: 0
  },
  cardMedia: {
    marginBottom: theme.spacing(1),
    objectFit: "contain"
  },
  cardActions: {
    paddingTop: 0
  },
  typography: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  uploadFilesButton: {
    marginBottom: theme.spacing(2)
  },
  invisibleFrame: {
    display: 'none'
  }
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
 * Component that renders a dialog 
 */
function DeleteDialog(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="dialog-title"> {"Delete this file?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          Are you sure you want to delete the file "{props.filename}"?
            </DialogContentText>
      </DialogContent>
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

/**
 * Class component for the 'Files' page,
 * where the user can upload, download and
 * delete files from the server
 */
class Files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      downloadDialogOpen: false,
      fileIdToDownload:   '',
      filenameToDownload: '',

      deleteDialogOpen:   false,
      filenameToDelete:   '',
      fileIdToDelete:     '',

      uploadDialogOpen: false,
    }
  }

  componentDidMount() {
    // fetch files record from the server
    this.props.fetchFiles()
  }


  /**
   * Handler to open UploadDialog component
   * (When UPLOAD FILES is clicked)
   */
  openUploadDialog = () => {
    this.setState({ uploadDialogOpen: true });
  }

  /**
   * Handler to close UploadDialog component
   */
  closeUploadDialog = () => {
    this.setState({ uploadDialogOpen: false });
  }

  /**
   * Handler to open DeleteDialog component
   * (When the trash can icon is clicked)
   */
  openDeleteDialog = (filename, id) => (event) => {
    this.setState({
      deleteDialogOpen: true,
      filenameToDelete: filename,
      fileIdToDelete: id
    });
  };

  /**
   * Handler to close DeleteDialog component
   */
  closeDeleteDialog = () => {
    this.setState({
      deleteDialogOpen: false,
      filenameToDelete: '',
      fileIdToDelete: null,
    });
  };

  /**
   * Handler fot DELETE button on the DeleteDialog
   */
  handleDelete = () => {
    // When the user agree to delete a file,
    // an action deleteFile is dispatched and the dialog closes
    this.props.deleteFile(this.state.fileIdToDelete)
    this.closeDeleteDialog()
  };

  /**
   * Handler to open DownloadDialog component
   * (When the lock icon of an encrypted file is clicked)
   */
  openDownloadDialog = (filename, fileId) => () =>{
    this.setState({ 
      fileIdToDownload:   fileId,
      filenameToDownload: filename,
      downloadDialogOpen: true
    });
  }

  /**
   * Handler to open DownloadDialog component
   * (When the lock icon of an encrypted file is clicked)
   */
  closeDownloadDialog = () => {
    this.setState({  downloadDialogOpen: false });
  }

  /**
   * Gets a file name and returns a path for an image
   * thumbnail of the file based on its extension name.
   */
  filenameToExtImg(filename) {
    const ext = filename.split('.').pop().toUpperCase();
    if (FILE_KNOWN_EXT.find(e => e === ext))
      return '/img/file-extensions/' + ext + '.png';
    else
      return '/img/file-extensions/FILE.png'
  }

  /**
   * Converts file size in bytes to pretty string
   * @param {Number} bytes     The file size (in bytes)
   * @param {Number} decimals  Decimal places to be included in the string (defaul is 2) 
   */
  fileSizeToString(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Component that renders a dialog 
   */
  DownloadDialog = (props) => {
    return (
      <Dialog open={this.state.downloadDialogOpen}
              onClose={this.closeDownloadDialog}>
        <DialogTitle id="download-dialog-title">Download Encrypted File</DialogTitle>
        <form method="post"
              action={ baseUrl + 'api/files/decrypt/' + this.state.filenameToDownload }>
          <DialogContent>
            <input type='text' name='id' value={this.state.fileIdToDownload} hidden/>
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
            <Button onClick={this.closeDownloadDialog} color="primary">
              Cancel
          </Button>
            <Button type="submit" onClick={this.closeDownloadDialog} color="primary">
              Download
          </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  /**
   * Component that renders the files grid
   */
  FilesGrid = (props) => {
    const { classes } = this.props;
    const dateFormatOptions = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric',
      hour12: false,
    };
    return (
      <Grid container spacing={3}>
        {props.items.map(file => {
          return (
            <Grid item xs={6} sm={4} key={file._id}>
              <Card>
                <Tooltip title={file.originalname} arrow>
                  <CardActionArea >
                    <CardContent className={classes.cardContent}>
                      <CardMedia component="img" alt="File"
                        title="File" height="55"
                        image={this.filenameToExtImg(file.originalname)}
                        className={classes.cardMedia}
                      />
                      <Typography className={classes.typography} gutterBottom variant="subtitle1" >
                        {file.originalname}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {new Intl.DateTimeFormat('default', dateFormatOptions)
                          .format(new Date(Date.parse(file.updatedAt)))}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Tooltip>
                <Divider />
                <CardActions disableSpacing>
                  {file.encrypted
                    ? <IconButton size="small" className={classes.lockIcon}
                      onClick={this.openDownloadDialog(file.originalname, file._id)}>
                      <LockIcon />
                    </IconButton>
                    : <IconButton component='a' size="small" href={baseUrl + file.path}>
                      <GetAppIcon />
                    </IconButton>}

                  <Typography variant="body2" color="textSecondary" component="p">
                    {this.fileSizeToString(file.size)}
                  </Typography>

                  <IconButton size="small" className={classes.deleteIcon}
                    onClick={this.openDeleteDialog(file.originalname, file._id)}>
                    <DeleteIcon />
                  </IconButton>

                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
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
        {this.props.files.isLoading ? <LinearProgress /> : <this.FilesGrid
          items={this.props.files.items}
          classes={classes} />}
        <this.DownloadDialog />
        <DeleteDialog filename={this.state.filenameToDelete}
          open={this.state.deleteDialogOpen}
          handleClose={this.closeDeleteDialog}
          handleDelete={this.handleDelete} />
        <UploadDialog
          open={this.state.uploadDialogOpen}
          handleClose={this.closeUploadDialog}
          handleSubmit={this.onChangeUpload}
          postFiles={this.props.postFiles} />
      </Container>
    );
  }

}

// use rredux actions and store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Files));