import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ErrorNotice from "../shared/ErrorNotice";

/**
 * Reads the file content
 */
const FileContent = () => {
  const files = useSelector((state) => state.files);
  const [contents, setContents] = useState([]);
  const [errors, setErrors] = useState("");

  /**
   * Read file by file, triggering the onLoad callback
   */
  const checkFiles = () => {
    files.map((file) => {
      const reader = new FileReader();

      /**
       * Build the file cards with the content, using state
       */
      reader.onload = () => {
        /// Instantiate a copy of the file contents
        let tempContents = contents;

        /// Add this file content to the temp array of file contents
        tempContents.push(reader.result);

        /// Update the file contents in this component state
        setContents([...tempContents]);
      };

      /**
       * Update callback for errors
       */
      reader.onerror = function (e) {
        setErrors("File could not be read! Code: " + e.target.error.code);
      };

      reader.readAsText(file);
    });
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'checkFiles'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    checkFiles();
  }, []);

  return (
    <React.Fragment>
      {errors && <ErrorNotice message={errors} />}

      {contents.map((content, i) => {
        return (
          <div className="card mt-2 file-card" key={i}>
            <div className="card-body">
              <pre>
                <code>{content}</code>
              </pre>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default FileContent;
