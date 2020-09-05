import * as ActionTypes from '../actionTypes';
import { baseUrl } from '../../baseUrl';

// Action Creators:

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const loadingFiles = loadingState => ({
  type: ActionTypes.LOADING_STATE_FILES,
  payload: loadingState
})

export const errorFiles = error => ({
  type: ActionTypes.ERROR_FILES,
  payload: error
})

export const fetchFiles = () => dispatch => {
    dispatch(loadingFiles(true))

  return sleep(1000)
  .then(() => {
    return [{"encrypted":false,
      "_id":"101",
      "originalname":"README.md",
      "path":"uploads\\README.md",
      "size":1,
      "mimetype":"text/plain",
      "createdAt":"2020-09-05T11:32:49.832Z",
      "updatedAt":"2020-09-05T11:32:49.832Z",
    },
    {"encrypted":true,
      "_id":"102",
      "originalname":"encrypted.txt",
      "path":"uploads\\encrypted.txt",
      "size":0,
      "mimetype":"text/plain",
      "destroyAt":new Date(Date.now() + (8*60*60*1000)),
      "createdAt":"2020-09-05T11:32:49.832Z",
      "updatedAt":"2020-09-05T11:32:49.832Z",
    },
    {"encrypted":false,
      "_id":"103",
      "originalname":"logo.jpg",
      "path":"uploads\\logo.jpg",
      "size":416506,
      "mimetype": "image/jpeg",
      "createdAt":"2020-09-05T11:32:49.832Z",
      "updatedAt":"2020-09-05T11:32:49.832Z",
    }]
  })
  .then(json => dispatch(loadFiles(json)))
  .catch(error =>  { 
    error.type = 'connection';
    dispatch(errorFiles(error));
  });
        
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
    return sleep(500)
    .then(() => dispatch(deleteFileFromStore(fileID)))
    .catch(error =>  { 
      error.type = 'connection';
      error.message = 'Unable to delete file\nError: '+error.message;
      dispatch(errorFiles(error));
    });
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
  
  sleep(1000)
  .then(() => {
    return [{"encrypted":uploadForm.encryptChecked,
      "_id": "abc"+Math.floor(Math.random() * 10000),
      "originalname":uploadForm.files[0].name,
      "path":"uploads\\"+uploadForm.files[0].name,
      "size":uploadForm.files[0].size,
      "mimetype":uploadForm.files[0].type,
      "destroyAt":new Date(Date.now() + (uploadForm.selfDestruct*60*60*1000)),
      "createdAt":new Date(Date.now()),
      "updatedAt":new Date(Date.now()),
    }]
  })
  .then(response => dispatch(addFile(response)))
  .catch(error =>  { 
      error.type = 'connection';
      error.message = 'Your file could not be posted\nError: '+error.message;
      dispatch(errorFiles(error));
  });
   
};

