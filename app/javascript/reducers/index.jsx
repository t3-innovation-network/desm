import loggedReducer from "./loggedReducer";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import mergedFileReducer from "./mergedFileReducer";
import submittedReducer from "./submittedReducer";
import previewSpecReducer from "./previewSpecReducer";
import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import fileProcessingReducer from "./fileProcessingReducer";
import mappingFormReducer from "./mappingFormReducer";
import vocabulariesReducer from "./vocabulariesReducer";
import filteredFileReducer from "./filteredFileReducer";

/**
 * Represents a single reducer that contains all the reducers.
 */
const allReducers = combineReducers({
  files: fileReducer,
  filteredFile: filteredFileReducer,
  loggedIn: loggedReducer,
  mappingFormData: mappingFormReducer,
  mergedFileId: mergedFileReducer,
  previewSpecs: previewSpecReducer,
  processingFile: fileProcessingReducer,
  submitted: submittedReducer,
  toastr: toastrReducer,
  user: userReducer,
  vocabularies: vocabulariesReducer,
});

export default allReducers;
