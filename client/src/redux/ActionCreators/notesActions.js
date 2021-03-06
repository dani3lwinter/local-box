import * as ActionTypes from '../actionTypes';
import { baseUrl } from '../../baseUrl';
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
    return fetch(url, {
        method:'GET',
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
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
    return fetch(baseUrl + 'api/notes/'+noteID, {
        method:'DELETE',
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
    .then(response => dispatch(deleteNoteFromStore(noteID)))
    .catch(error =>  { 
      error.type = 'connection';
      error.message = 'Unable to delete note.\nError: '+error.message;
      dispatch(errorNotes(error));
    });
}

export const postNote = (note) => (dispatch) => {
    dispatch(loadingNotes(true))
    const resource = note._id ? 'api/notes/'+note._id : 'api/notes';
    
    return fetch(baseUrl + resource, {
        method: note._id ? "PUT" : 'POST',
        body: JSON.stringify(note),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin"
    })
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      })
    .then(response => response.json())
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
