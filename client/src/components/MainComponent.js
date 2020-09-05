import React,{Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import ErrorBoundary from './ErrorBoundary'
import BottomNav from './BottomNavComponent'
import Home from './HomeComponent'
import Notes from './NotesComponent'
import EditNote from './EditNoteComponent'
import Files from './FilesComponent'
import SideDrawer from './DrawerComponent'
import CssBaseline from '@material-ui/core/CssBaseline';
import withWidth from "@material-ui/core/withWidth";
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import { connect } from "react-redux";
import {postNote, fetchNotes} from '../redux/ActionCreators/notesActions'
import {setThemeDark, setThemeLight} from '../redux/ActionCreators/uiActions'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const styles =  (theme) => ({
    root: {
        display: 'flex',
      },
      content: {
        flexGrow: 1,
        //padding: theme.spacing(3),
      },
     
});

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    fetchNotes: () => dispatch(fetchNotes()),
    postNote: (note) => dispatch(postNote(note)),
    setThemeDark: () => dispatch(setThemeDark()),
    setThemeLight: () => dispatch(setThemeLight()),
});

const darkTheme = createMuiTheme({
    palette: {
        type: "dark",
        primary: { main: '#00838F' },
        secondary: { main: '#445963' }
    },
  });
const lightTheme = createMuiTheme({
    palette: {
        type: "light",
        primary: { main: '#00838F' },
        secondary: { main: '#445963' }
    },
});

class Main extends Component{
  constructor(props){
    super(props);

    this.state = {
        drawerOpen: this.props.width === 'xs' ? false : true,
      }
  }

  componentDidMount() {
    console.log('fetchNotes() in componentDidMount of Main')
    this.props.fetchNotes()
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.props.setThemeDark()
    }
  }


  handleThemeToggle = () => {
     // alert('theme = ~' + this.props.ui.theme+'~')
    if(this.props.ui.theme === 'light')
        this.props.setThemeDark()
    else
        this.props.setThemeLight()
  }

  HomeWithProps = () => {
      return(
        <Home handleThemeToggle={this.handleThemeToggle}
            notes={this.props.notes}
            postNote={this.props.postNote}/>
      );
  }

  NotesPage = (props) => {
      if(this.props.width === 'xs'){
          return props.path === 'notes' ? <Notes notes={this.props.notes}/> : <EditNote/> 
      }
      else{
          return(
            <Grid container>
                <Grid item xs={4}>
                    <Notes notes={this.props.notes}/>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs={7}>          
                    { props.path === 'notes' ? null : <EditNote/> }
                </Grid>
            </Grid>
          );
      }
  }

  
  render(){
    var theme = this.props.ui.theme === 'dark' ? darkTheme : lightTheme;
    const { classes } = this.props;
    // ISSUE: does not re render when theme changes
    return(
        <ThemeProvider theme={theme}>
            <Router basename="/local-box">
                <CssBaseline />
                <div className={classes.root}>
                    {this.props.width === 'xs' ? <BottomNav /> : <SideDrawer /> }
                    <div className={classes.content}>
                    <ErrorBoundary>
                    <Switch>
                        <Route path="/home">
                            <this.HomeWithProps/>
                        </Route>

                        <Route path='/notes/:noteId'>
                            <this.NotesPage path={'editNote'} />
                        </Route>

                        <Route exact path="/notes">
                            <this.NotesPage path={'notes'} />
                        </Route>
                        
                        <Route path="/newNote">
                            <this.NotesPage path={'newNote'} />
                        </Route>

                        <Route path="/files/upload">
                            <Files upload={true}/>
                        </Route>

                        <Route path="/files">
                            <Files />
                        </Route>  

                        <Route path="/">
                            <this.HomeWithProps/>
                        </Route>
                    </Switch>
                    </ErrorBoundary>
                    </div>
                </div>
            </Router>     
        </ThemeProvider>
    );


  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withWidth()(withStyles(styles)(Main)));
