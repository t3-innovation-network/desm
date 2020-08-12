import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { unsetFiles } from "../../actions/files";
import FileContent from "./FileContent";

const MappingPreview = () => {
  /// Get the files from the redux store
  const files = useSelector((state) => state.files);
  const dispatch = useDispatch();

  /**
   * Resets the files on redux global state, this way
   * The files collection is blanked and the use can re-import files
   */
  const handleOnReimport = () => {
    dispatch(unsetFiles());
  }

  return (
    <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
      <React.Fragment>
        { files.length > 0 && (
          <React.Fragment>
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-6 align-self-center">
                    <strong>Preview your upload</strong>
                  </div>
                  <div className="col-6 text-right">
                    <button className="btn btn-dark" onClick={handleOnReimport}>Re-import</button>
                    <button className="btn bg-col-primary col-background ml-2">Looks Good</button>
                  </div>
                </div>
              </div>
            </div>
            <FileContent />
          </React.Fragment>
        )}
      </React.Fragment>
    </div>
  )
}

export default MappingPreview;