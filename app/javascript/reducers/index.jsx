import loggedReducer from "./loggedReducer";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import submittedReducer from "./submittedReducer";
import previewSpecReducer from "./previewSpecReducer";
import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import fileProcessingReducer from "./fileProcessingReducer";
import mappingFormReducer from "./mappingFormReducer";

/**
 * Represents a single reducer that contains all the reducers.
 */
const allReducers = combineReducers({
  loggedIn: loggedReducer,
  user: userReducer,
  files: fileReducer,
  submitted: submittedReducer,
  previewSpecs: previewSpecReducer,
  processingFile: fileProcessingReducer,
  mappingFormData: mappingFormReducer,
  toastr: toastrReducer,
});

export default allReducers;
