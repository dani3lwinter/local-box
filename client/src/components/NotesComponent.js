import React from 'react';
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {Link as RouterLink, useRouteMatch} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      paddingBottom: (56 + theme.spacing(2))*2,
    },
    typographyTitle: {
      textAlign: 'left',
      padding: theme.spacing(2, 2, 0),
    },
    fab: {
      position: 'fixed',
      bottom: 56 + theme.spacing(2),
      right: theme.spacing(2),
    },
  }));

const NotesList = ({notes}) => {
  let match = useRouteMatch();

  const dateFormatOptions = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', 
    hour12: false,
  };
  const notesItems = notes.items.filter(note => !note.isMainNote);

  return(
    <List>
      { notesItems.map(note => (
        <ListItem button divider key={note._id}
          component={RouterLink} to={`${match.path}/${note._id}`}>
          <ListItemText
          primary={note.title}
          secondary={
            new Intl.DateTimeFormat('default', dateFormatOptions)
            .format(new Date(Date.parse(note.updatedAt)))
          }
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit">
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        )) } 
    </List>
  );
}
export default function Notes({notes}) {
    const classes = useStyles();
    return(
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom className={classes.typographyTitle}>Notes</Typography>
        {notes.isLoading ? <LinearProgress />: <NotesList notes={notes} />}
        <Fab color="primary" aria-label="add" className={classes.fab}
            component={RouterLink} to='/editNote'>
          <AddIcon />
        </Fab>
      </div>
    );
}