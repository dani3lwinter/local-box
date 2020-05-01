import * as ActionTypes from '../actionTypes';

export default function(state = {items:[],isLoading: true, error:null}, action) {
    switch (action.type) {

      case ActionTypes.ERROR_NOTES: {
        return {
            ...state,
            error: action.payload,
            isLoading: false
        };
      }

      case ActionTypes.ADD_NOTE: {
        return {
            ...state,
            items: state.items.concat(action.payload),
            isLoading: false
        };
      }

      case ActionTypes.EDIT_NOTE: {
        return {
            ...state,
            items: state.items.map(note => note._id===action.payload._id ? action.payload : note ),
            isLoading: false
        };
      }

      case ActionTypes.DELETE_NOTE: {
        return {
            ...state,
            items: state.items.filter(note => note._id !== action.payload),
            isLoading: false
        };
      }

      case ActionTypes.LOADING_STATE_NOTES: {
        return {
            ...state,
            isLoading: action.payload
        };
      }

      case ActionTypes.LOAD_NOTES: {
        return {
            ...state,
            items: action.payload,
            isLoading: false
        };
      }

      default:
        return state;
    }
  }