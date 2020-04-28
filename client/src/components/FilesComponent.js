import React, { Component, Fragment } from 'react';
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import UploadDialog from './Dialogs/UploadDialog';
import DeleteDialog from './Dialogs/DeleteDialog';
import DownloadDialog from './Dialogs/DownloadDialog';
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
  },
  destructText: {
    color: theme.palette.error.light,
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

  componentDidMount() {
    // fetch files record from the server
    this.props.fetchFiles()
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
   * Component that renders the files grid
   */
  FilesGrid = (props) => {

    if(props.isLoading){
        return <LinearProgress />
    }
    const { classes } = this.props;
    const dateFormatOptions = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric',
      hour12: false,
    };
    function timeToLive(destroyAt){

      // time untill destruct in miniutes;
      var diff = (Date.parse(destroyAt) - Date.now()) / 60000
      var hours = diff/60, mins = Math.round(diff%60);
      if(hours <= 1){
        return mins + 'min';
      }
      else if(hours >= 11.5 || mins === 0 ){ // the time is more then 11 hours
        return Math.round(hours) + ' hours';
      }
      else{
        return Math.floor(hours) + 'h ' + mins + 'min'
      }
    }

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
              
              <Typography variant="caption" className={classes.destructText} >
                {file.destroyAt ? 'Delete in '+timeToLive(file.destroyAt) :''}
              </Typography>
            
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
        <this.FilesGrid
          isLoading={this.props.files.isLoading}
          items={this.props.files.items}
          classes={classes} />
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