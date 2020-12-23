import React from "react";

/**
 * Prints a card with basic information about the selected file.
 *
 * @param {File} selectedFile
 */
const FileInfo = (props) => {
  /**
   * Elements from props
   */
  const { selectedFile } = props;

  return (
    <div className="card mt-3">
      <div className="card-header">
        <i className="fa fa-file"></i>
        <span className="pl-2 subtitle">File Details</span>
      </div>
      <div className="card-body">
        <p>
          <strong>File Name:</strong> {selectedFile.name}
        </p>
        <p>
          <strong>File Type:</strong> {selectedFile.type}
        </p>
        <p>
          <strong>Last Modified:</strong>{" "}
          {" " + new Date(selectedFile.lastModified).toDateString()}
        </p>
      </div>
    </div>
  );
};

export default FileInfo;
