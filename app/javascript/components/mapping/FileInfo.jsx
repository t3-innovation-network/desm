import React from "react";

const FileInfo = (props) => {
  return (
    <div className="card mt-3">
      <div className="card-header">
        <i className="fa fa-file"></i>
        <span className="pl-2 subtitle">File Details</span>
      </div>
      <div className="card-body">
        <p>
          <strong>File Name:</strong> {props.selectedFile.name}
        </p>
        <p>
          <strong>File Type:</strong> {props.selectedFile.type}
        </p>
        <p>
          <strong>Last Modified:</strong>{" "}
          {" " + props.selectedFile.lastModifiedDate.toDateString()}
        </p>
      </div>
    </div>
  );
};

export default FileInfo;
