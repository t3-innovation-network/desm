import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { unsetFiles, unsetSpecToPreview } from "../../actions/files";
import FileContent from "./FileContent";
import { doUnsubmit } from "../../actions/mappingform";
import Loader from "./../shared/Loader";
import createSpec from "../../services/createSpec";
import { toastr as toast} from "react-redux-toastr";
import createMapping from "../../services/createMapping";

const MappingPreview = (props) => {
  const submitted = useSelector((state) => state.submitted);
  const processingFile = useSelector((state) => state.processingFile);
  const previewSpecs = useSelector((state) => state.previewSpecs);
  const mappingFormData = useSelector((state) => state.mappingFormData);
  const dispatch = useDispatch();

  /**
   * Resets the files on redux global state, this way
   * The files collection is blanked and the use can re-import files
   */
  const handleOnReimport = () => {
    // Remove files from store
    dispatch(unsetFiles());
    // Remove previews
    dispatch(unsetSpecToPreview());
    // Change the form status to unsubmitted
    dispatch(doUnsubmit());
    // Reset the file uploader
    $('#file-uploader').val('');
  };

  /**
   * Call the api to create a specification with the data in the store
   */
  const createSpecification = () => {
    /// Send the specifications to the backend
    mappingFormData.specifications = previewSpecs;

    createSpec(mappingFormData).then((response) => {
      dispatch(unsetSpecToPreview());
      dispatch(unsetFiles());
      dispatch(doUnsubmit());

      // if it's the spine, show a message to the user and return to home
      if (response["spine?"]) {
        toast.success("You created a spine for this domain: "  + response.domain.uri);
        props.redirect("/");
      }else{
        // If it's not the spine, the user is uploading a specification to map,
        // so let's create the mapping and (with the id returned) load the
        // mapping page
        createMapping(response.id).then((response) => {
          props.redirect("/mappings/" + response.data.id);
        })
      }
    }).catch((e) => {
      toast.error(e.response.data.error)
    });
  }

  return (
    <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
      <React.Fragment>
        { processingFile ? 
          <Loader /> : 
          submitted && (
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
                    <button
                      className="btn bg-col-primary col-background ml-2"
                      disabled={!previewSpecs.length}
                      onClick={createSpecification}
                    >
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
