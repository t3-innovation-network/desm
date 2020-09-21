import React from "react";

const ErrorMessage = (error) => {
  if (
    error.response !== undefined &&
    error.response.data !== undefined &&
    error.response.data.message !== undefined
  ) {
    return "We had an error: " + error.response.data.message;
  }

  if (error.message !== undefined) {
    return "We had an error: " + error.message;
  }

  return "";
};

export default ErrorMessage;
