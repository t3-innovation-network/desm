import React from "react";
import { useSelector } from "react-redux";

/**
 * Reads the file content
 */
const FileContent = () => {
  const previewSpecs = useSelector((state) => state.previewSpecs);

  return (
    <React.Fragment>
      {previewSpecs.map((content, i) => {
        return (
          <div className="card mt-2 mb-2 file-card scrollbar" key={i}>
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
