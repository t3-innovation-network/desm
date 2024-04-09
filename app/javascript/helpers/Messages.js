import { toastr } from 'react-redux-toastr';
import { TOASTR_OPTIONS } from './Constants';

export const showSuccess = (message) => {
  toastr.success(message, TOASTR_OPTIONS.default);
};

export const showError = (message) => {
  toastr.error(message, TOASTR_OPTIONS.error);
};

export const showFlashError = (message) => {
  toastr.error(message, TOASTR_OPTIONS.default);
};

export const showInfo = (message) => {
  toastr.info(message, TOASTR_OPTIONS.default);
};

export const showWarning = (message) => {
  toastr.warning(message, TOASTR_OPTIONS.error);
};
