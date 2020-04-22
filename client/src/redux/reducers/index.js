import { combineReducers } from "redux";
import * as ActionTypes from '../actionTypes';
import notes from "./notes";
import files from "./files.js";


function ui(state = {theme:'light'}, action) {
    switch (action.type) {

      case ActionTypes.SET_THEME_DARK: {
        return {...state, theme: 'dark'};
      }
      case ActionTypes.SET_THEME_LIGHT: {
        return {...state, theme: 'light'};
      }
      default:
        return state;
    }
  }

export default combineReducers({ notes, files, ui });
