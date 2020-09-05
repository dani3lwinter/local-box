import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { baseUrl } from '../baseUrl';

import Typography from '@material-ui/core/Typography'
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
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
    deleteIcon: {
        marginLeft: 'auto',
      },
      lockIcon: {
        color: theme.palette.success.main
      },
      cardContent: {
        paddingBottom: 0
      },
      cardMedia: {
        marginBottom: theme.spacing(1),
        objectFit: "contain"
      },
      typography: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      destructText: {
        color: theme.palette.error.light,
      }
}));

// files extensions that are supported 
const FILE_KNOWN_EXT = ['ACC', 'AE', 'AI', 'AN', 'AVI', 'BMP', 'CSV', 'DAT', 'DGN', 'DOC', 'DOCH', 'DOCM', 'DOCX', 'DOTH', 'DW', 'DWFX', 'DWG', 'DXF', 'DXL', 'EML', 'EPS', 'F4A', 'F4V', 'FILE', 'FLV', 'FS', 'GIF', 'HTML', 'IND', 'JPEG', 'JPG', 'JPP', 'Log', 'LR', 'M4V', 'MBOX', 'MDB', 'MIDI', 'MKV', 'MOV', 'MP3', 'MP4', 'MPEG', 'MPG', 'MPP', 'MPT', 'MPW', 'MPX', 'MSG', 'ODS', 'OGA', 'OGG', 'OGV', 'ONE', 'OST', 'PDF', 'PHP', 'PNG', 'POT', 'POTH', 'POTM', 'POTX', 'PPS', 'PPSX', 'PPT', 'PPTH', 'PPTM', 'PPTX', 'PREM', 'PS', 'PSD', 'PST', 'PUB', 'PUBH', 'PUBM', 'PWZ', 'RAR', 'READ', 'RP', 'RTF', 'SQL', 'SVG', 'SWF', 'TIF', 'TIFF', 'TXT', 'URL', 'VCF', 'VDX', 'VOB', 'VSD', 'VSS', 'VST', 'VSX', 'VTX', 'WAV', 'WDP', 'WEBM', 'WMA', 'WMV', 'XD', 'XLS', 'XLSM', 'XLSX', 'XML', 'ZIP'];

/**
 * Gets a file name and returns a path for an image
 * thumbnail of the file based on its extension name.
 * If the extension is not suppurted, returns default thumbnail: '/FILE.png'
 */
function filenameToExtImg(filename) {
    const ext = filename.split('.').pop().toUpperCase();
    if (FILE_KNOWN_EXT.find(e => e === ext))
        return '/local-box/img/file-extensions/' + ext + '.png';
    else
        return '/local-box/img/file-extensions/FILE.png'
}

/**
 * Calculate how much time left from now until destroyAt date
 * returns human readable string
 */
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

/**
 * Converts file size in bytes to pretty string
 * @param {Number} bytes     The file size (in bytes)
 * @param {Number} decimals  Decimal places to be included in the string (defaul is 2) 
 */
function fileSizeToString(bytes, decimals = 2) {
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
function FilesGrid(props) {
	const classes = useStyles();

	if(props.isLoading){
        return <LinearProgress />
    }

    const dateFormater = new Intl.DateTimeFormat('default', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric',
      hour12: false,
    });

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
                        image={filenameToExtImg(file.originalname)}
                        className={classes.cardMedia}
                      />
                      <Typography className={classes.typography} gutterBottom variant="subtitle1" >
                        {file.originalname}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {dateFormater.format(new Date(Date.parse(file.updatedAt)))}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Tooltip>
                <Divider />

                <CardActions disableSpacing>
                  {file.encrypted
                    ? <IconButton size="small" className={classes.lockIcon}
                      onClick={props.openDownloadDialog(file.originalname, file._id)}>
                      <LockIcon />
                    </IconButton>
                    : <IconButton component='a' size="small" href={baseUrl + file.path}>
                      <GetAppIcon />
                    </IconButton>}

                  <Typography variant="body2" color="textSecondary" component="p">
                    {fileSizeToString(file.size)}
                  </Typography>

                  <IconButton size="small" className={classes.deleteIcon}
                    onClick={props.openDeleteDialog(file.originalname, file._id)}>
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

export default FilesGrid;