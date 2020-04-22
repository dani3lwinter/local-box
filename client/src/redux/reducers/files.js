import * as ActionTypes from '../actionTypes';

export default function(state = {items:[],isLoading: true, error:null}, action) {
    switch (action.type) {

      case ActionTypes.ADD_FILE: {
        return {
            ...state,
            items: state.items.concat(action.payload),
            isLoading: false
        };
      }

      case ActionTypes.DELETE_FILE: {
        return {
            ...state,
            items: state.items.filter(file => file._id!==action.payload),
            isLoading: false
        };
      }

      case ActionTypes.LOADING_STATE_FILES: {
        return {
            ...state,
            isLoading: action.payload
        };
      }

      case ActionTypes.LOAD_FILES: {
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