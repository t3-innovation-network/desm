import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { unsetFiles } from "../../actions/files";
import FileContent from "./FileContent";
import { doUnsubmit } from "../../actions/mappingform";

const MappingPreview = () => {
  const submitted = useSelector((state) => state.submitted);
  const dispatch = useDispatch();

  /**
   * Resets the files on redux global state, this way
   * The files collection is blanked and the use can re-import files
   */
  const handleOnReimport = () => {
    dispatch(unsetFiles());
    dispatch(doUnsubmit());
  };

  return (
    <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
      <React.Fragment>
        {submitted && (
          <React.Fragment>
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-6 align-self-center">
                    <strong>Preview your upload</strong>
                  </div>
                  <div className="col-6 text-right">
                    <button className="btn btn-dark" onClick={handleOnReimport}>
                      Re-import
                    </button>
                    <button className="btn bg-col-primary col-background ml-2">
                      Looks Good
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <FileContent />
          </React.Fragment>
        )}
      </React.Fragment>
    </div>
  );
};

export default MappingPreview;
