import loggedReducer from "./loggedReducer";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import { combineReducers } from "redux";

/**
 * Represents a single reducer that contains all the reducers.
 */
const allReducers = combineReducers({
  loggedIn: loggedReducer,
  user: userReducer,
  files: fileReducer
});

export default allReducers;
