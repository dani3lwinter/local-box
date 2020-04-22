import * as ActionTypes from '../actionTypes';
import { baseUrl } from '../../baseUrl';

// Action Creators:

export const loadingFiles = loadingState => ({
  type: ActionTypes.LOADING_STATE_FILES,
  payload: loadingState
})

export const fetchFiles = () => dispatch => {
    dispatch(loadingFiles(true))

  return fetch(baseUrl + 'api/files/', {
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
  .then(json => dispatch(loadFiles(json)))
  .catch(error =>  { console.log('get files', error.message); alert('Unable to get files\nError: '+error.message); });
        
}

export const loadFiles = files => ({
    type: ActionTypes.LOAD_FILES,
    payload: files
  })

export const addFile = (file) => ({
        type: ActionTypes.ADD_FILE,
        payload: file
    })

export const deleteFileFromStore = (fileID) => ({
    type: ActionTypes.DELETE_FILE,
    payload: fileID
  })

export const deleteFile = (fileID) => (dispatch) => {
    dispatch(loadingFiles(true))
    return fetch(baseUrl + 'api/files/download/'+fileID, {
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
    .then(response => dispatch(deleteFileFromStore(response._id)))
    .catch(error =>  { console.log('delete file', error.message); alert('Unable to delete file\nError: '+error.message); });
}

export const postFiles = (uploadForm) => (dispatch) => {
  dispatch(loadingFiles(true))
  const data = new FormData();
  for (const file of  uploadForm.files) {
    data.append('files', file);
  }
  data.append('encrypt', uploadForm.encryptChecked);
  data.append('password', uploadForm.password);
  data.append('selfDestruct', uploadForm.selfDestruct);
  
  fetch(baseUrl + "api/files/upload", {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
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
  .then(response => dispatch(addFile(response)))
  .catch(error =>  { 
      console.log('post file', error.message);
      alert('Your file could not be posted\nError: '+error.message);
  });
   
};

