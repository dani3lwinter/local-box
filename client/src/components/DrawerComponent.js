import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import NotesIcon from '@material-ui/icons/Notes';
import SettingsIcon from '@material-ui/icons/Settings';
import Hidden from '@material-ui/core/Hidden';
import logo from '../img/logo.jpg'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';


const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },

  //drawer
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    background: '#6a868c',
    ...theme.mixins.toolbar,
  },
  //close drawer buttn
  toggleButton:{
    position: 'absolute',
    top:0,
    right: 0,
  },


  nested: {
    paddingLeft: theme.spacing(4),
  },

}));

export default function SideDrawer(props) {
  const classes = useStyles(props);
  const theme = useTheme();

  const [openNotes, setOpenNotes] = React.useState(false);
  const [openFiles, setOpenFiles] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(true);

  const handleClickNotes = () => {
    setOpenNotes(!openNotes);
    setOpenFiles(false);
  };

  const handleClickFiles = () => {
    setOpenFiles(!openFiles);
    setOpenNotes(false);
  };

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };
  
  return (
    <div className={classes.root}>
      
      <Drawer
        onClose={handleDrawerToggle}
        variant='permanent'
        className={clsx(`${classes.drawer}`, {
          [`${classes.drawerOpen}`]: openDrawer,
          [classes.drawerClose]: !openDrawer,
        })}
        classes={{
          paper: clsx({
            [`${classes.drawerOpen}`]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          }),
        }}
      >
        
        <div className={classes.toolbar}>
        <Hidden only={['sm','md','lg','xl']}>
          <ListItem button key='logo' >
          <ListItemAvatar><Avatar src={logo} alt="Logo" /></ListItemAvatar>
            <IconButton onClick={handleDrawerToggle} className={classes.toggleButton}>
              <CloseIcon />
            </IconButton>
          </ListItem>
        </Hidden>
        <Hidden only={'xs'}>
              <img src={logo} alt='Logo' width='100%' />
              <IconButton onClick={handleDrawerToggle} className={classes.toggleButton}>
                {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
              </IconButton>
        </Hidden>
        </div>
        
        <Divider />
        <List>
            <ListItem button key='add'>
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary='Add Note' />
            </ListItem>
  
            <ListItem button key='notes' onClick={handleClickNotes}>
              <ListItemIcon><NotesIcon /></ListItemIcon>
              <ListItemText primary='Notes' />
              {openNotes ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openNotes} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="note.txt" secondary="27/03/2020  15:20"/>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="links" secondary="26/03/2020  18:00"/>
                </ListItem>
              </List>
            </Collapse>

            <ListItem button key='files' onClick={handleClickFiles}>
              <ListItemIcon><PermMediaIcon /></ListItemIcon>
              <ListItemText primary='Files' />
              {openFiles ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openFiles} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="plane.jpg" secondary="27/03/2020  12:20"/>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="logo.png" secondary="26/03/2020  18:30"/>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemText primary="logo.txt" secondary="20/03/2020  18:00"/>
                </ListItem>
              </List>
            </Collapse>

        </List>
        <Divider />
        <List>
            <ListItem button key='setting'>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary='Setting' />
            </ListItem>
        </List>
      </Drawer>
      
      <main className={classes.content}>
        
      </main>
    </div>
  );
}


