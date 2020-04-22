import React,{Component} from 'react';
import BottomNav from './BottomNavComponent'
import Home from './HomeComponent'
import Notes from './NotesComponent'
import EditNote from './EditNoteComponent'
import Files from './FilesComponent'
import CssBaseline from '@material-ui/core/CssBaseline';
import withWidth from "@material-ui/core/withWidth";
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import { connect } from "react-redux";
import {postNote, deleteNote, fetchNotes} from '../redux/ActionCreators/notesActions'
import {setThemeDark, setThemeLight} from '../redux/ActionCreators/uiActions'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    postNote: (note) => dispatch(postNote(note)),
    deleteNote: (noteID) => dispatch(deleteNote(noteID)),
    fetchNotes: () => dispatch(fetchNotes()),
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
  render(){
    var theme = this.props.ui.theme === 'dark' ? darkTheme : lightTheme
    // ISSUE: does not re render when theme changes
    return(
        <ThemeProvider theme={theme}>
            <Router>
                <CssBaseline />
                {/* {this.props.width === 'xs' ? <BottomNav /> : <SideDrawer /> } */}
                
                <Switch>
                    
                    <Route path="/home">
                        <this.HomeWithProps/>
                    </Route>
                    <Route path='/notes/:noteId'>
                        <EditNote notes={this.props.notes}
                            postNote={this.props.postNote}
                            deleteNote={this.props.deleteNote}/>
                    </Route>
                    <Route exact path="/notes">
                        <Notes notes={this.props.notes}/>
                    </Route>
                    
                    <Route path="/editNote">
                        <EditNote notes={this.props.notes}
                            postNote={this.props.postNote}
                            deleteNote={this.props.deleteNote}/>
                    </Route>
                    <Route path="/files">
                        <Files />
                    </Route> 
                    <Route path="/">
                        <this.HomeWithProps/>
                    </Route>
                </Switch>
                <BottomNav />
            </Router>     
        </ThemeProvider>
    );


  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withWidth()(Main));
