import * as ActionTypes from '../actionTypes';
import { baseUrl } from '../../baseUrl';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Action Creators:

export const editNote = (note) => ({
    type: ActionTypes.EDIT_NOTE,
    payload: note
})

export const loadingNotes = loadingState => ({
  type: ActionTypes.LOADING_STATE_NOTES,
  payload: loadingState
})

export const errorNotes = error => ({
  type: ActionTypes.ERROR_NOTES,
  payload: error
})

export const fetchNotes = (id) => dispatch => {
    dispatch(loadingNotes(true))
    var url = id ? baseUrl + 'api/notes/' + id : baseUrl + 'api/notes/';
    return sleep(1000)
    .then(() => {
      return [{
        "selfDestruct": null,
        "isMainNote": true,
        "_id": "5ea0ac00036b3e587cab774b",
        "content": "",
        "createdAt": "2020-04-22T20:41:36.258Z",
        "updatedAt": "2020-09-05T10:58:54.281Z",
      },
      {
        "selfDestruct": 72,
        "isMainNote": false,
        "_id": "5f53b32431b5cb81a4dd1d0c",
        "title": "README",
        "content": "Local-Box\nStore files and notes on a local website, and access them within other devices on the same network.\n\nRequirements\n   Node.js\n   mongoDB\n\nUsage\n   1. Start mongoDB instance on the defualt port 27017\n   2. Open command line on 'server' folder and type npm start\n   3. Access the website via http://localhost:3000/",
        "createdAt": "2020-09-05T15:47:48.939Z",
        "updatedAt": "2020-09-05T15:47:48.939Z",
      },
      {
        "selfDestruct": 24,
        "isMainNote": false,
        "_id": "5f53b33131b5cb81a4dd1d0d",
        "title": "Note #2",
        "content": "You can paste here text and open it later on your phone!",
        "createdAt": "2020-09-05T15:48:01.649Z",
        "updatedAt": "2020-09-05T15:48:01.649Z",
      },
      {
        "selfDestruct": 24,
        "isMainNote": false,
        "_id": "5f53b33131b5cb81a4dd1123",
        "title": "Note #3",
        "content": "",
        "createdAt": "2020-09-05T15:48:01.649Z",
        "updatedAt": "2020-09-05T15:48:01.649Z",
      },
      {
        "selfDestruct": 24,
        "isMainNote": false,
        "_id": "5f53b33131b5cb81a4d4567",
        "title": "Note #4",
        "content": "",
        "createdAt": "2020-09-05T15:48:01.649Z",
        "updatedAt": "2020-09-05T15:48:01.649Z",
      }]
    })
    .then(json => dispatch(loadNotes(json)))
    .catch(error =>  {
      error.type = 'connection';
      dispatch(errorNotes(error));
    });
}



export const loadNotes = notes => ({
    type: ActionTypes.LOAD_NOTES,
    payload: notes
  })

export const addNote = (note) => ({
        type: ActionTypes.ADD_NOTE,
        payload: note
    })

export const deleteNoteFromStore = (noteID) => ({
    type: ActionTypes.DELETE_NOTE,
    payload: noteID
  })

export const deleteNote = (noteID) => (dispatch) => {
    dispatch(loadingNotes(true))
    return sleep(500)
    .then(() => dispatch(deleteNoteFromStore(noteID)))
    .catch(error =>  { 
      error.type = 'connection';
      error.message = 'Unable to delete note.\nError: '+error.message;
      dispatch(errorNotes(error));
    });
}

export const postNote = (note) => (dispatch) => {
    dispatch(loadingNotes(true))
    const resource = note._id ? 'api/notes/'+note._id : 'api/notes';
    
    return sleep(500)
    .then(() => {
      return {
        ...note,
        "_id": note._id ? note._id : "abc"+Math.floor(Math.random() * 10000),
        "createdAt":new Date(Date.now()),
        "updatedAt":new Date(Date.now()),
      }
    })
    .then(response => note._id ? dispatch(editNote(response)) : dispatch(addNote(response)))
    .catch(error =>  {
      error.type = 'connection';
      error.message = 'Your note could not be posted.\nError: '+error.message;
      dispatch(errorNotes(error));
    });
};


/*
const shouldFetchPosts = (state, subreddit) => {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = subreddit => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchPosts(subreddit))
  }
}*/
