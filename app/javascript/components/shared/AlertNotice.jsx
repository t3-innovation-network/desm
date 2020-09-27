import React from 'react';

const AlertNotice = (props) => {
  return (
    <div className={"alert alert-dismissible " + (props.cssClass ? props.cssClass : "alert-danger")}>
      <h4><strong>{props.title ? props.title : "Attention!"}</strong></h4>
      <p>{props.message}</p>
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  )
}

export default AlertNotice;