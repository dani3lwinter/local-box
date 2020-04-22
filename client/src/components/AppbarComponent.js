import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto',
    },
  }));

const myTheme = createMuiTheme({
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#f0f0f0',
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        // light: will be calculated from palette.primary.main,
        main: '#6A868C',
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
    },
  });

export default function BottomAppBar(props)  {
    const classes = useStyles();

    return(
      <ThemeProvider theme={myTheme}>
      <AppBar theme={myTheme} position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={props.handleDrawerToggle}>
                <MenuIcon />
            </IconButton>
            <Fab color="secondary" aria-label="add" className={classes.fabButton}>
                <AddIcon />
            </Fab>
            <div className={classes.grow} />
            <IconButton color="inherit">
                <SearchIcon />
            </IconButton>
            <IconButton edge="end" color="inherit">
                <MoreIcon />
            </IconButton>
        </Toolbar>
      </AppBar>
      </ThemeProvider>
      
    );
  }