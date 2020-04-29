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

import { Link as RouterLink, withRouter } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';

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
    width: theme.spacing(7),
  },
  //close drawer buttn
  toggleButton:{
    position: 'absolute',
    top:0,
    right: 0,
  },

}));

export default function SideDrawer(props) {
  const classes = useStyles(props);
  const theme = useTheme();

  const [openFiles, setOpenFiles] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(true);

  const handleAddFile = () => {
    setOpenFiles(!openFiles);
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

        <img src={logo} alt='Logo' width='100%' />
        <IconButton onClick={handleDrawerToggle} className={classes.toggleButton}>
          {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
        </IconButton>

        <Divider />
        <List>
            <ListItem button key='add' component={RouterLink} to='/newNote' >
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary='Add Note' />
            </ListItem>

            <ListItem button key='home' component={RouterLink} to='/'>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary='Home' />
            </ListItem>
  

            <ListItem button key='notes' component={RouterLink} to='/notes' >
              <ListItemIcon><NotesIcon /></ListItemIcon>
              <ListItemText primary='Notes' />
            </ListItem>

            <ListItem button key='files' component={RouterLink} to='/files' >
              <ListItemIcon><PermMediaIcon /></ListItemIcon>
              <ListItemText primary='Files' />
              <IconButton component={RouterLink}  to='/files/upload' >
                <AddIcon />
              </IconButton>
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem button key='setting'>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary='Setting' />
            </ListItem>
        </List>
      </Drawer>
        
    </div>
  );
}


