import React from 'react';

const ErrorNotice = (props) => {
  return (
    <div className="alert alert-danger mt-5">
      <strong>Error!</strong> {props.message}
    </div>
  )
}

export default ErrorNotice;