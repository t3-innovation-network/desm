import React, { Fragment, useEffect, useState } from "react";
import deleteSpecification from "../../services/deleteSpecification";
import fetchSpineSpecifications from "../../services/fetchSpineSpecifications";
import { Link } from "react-router-dom";
import { toastr as toast } from "react-redux-toastr";
import ConfirmDialog from "../shared/ConfirmDialog";

/**
 * @description A list of spine specifications from the user or all the users of the organization
 *
 * Props:
 * @param {String} filter The filter or the list of specifications. It can be either "all or "user",
 * this last meaning only those spine specifications belonging to the current user.
 */
const SpineSpecsList = (props) => {
  /**
   * Elements from props
   */
  const { filter } = props;

  /**
   * Representation of an error on this page process
   */
  const [errors, setErrors] = useState([]);

  /**
   * Controls displaying the removal confirmation dialog
   */
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  /**
   * The identifier of the spine to be removed. Saved in state, because the id is in an iterator,
   * and the clicked handles confirmation, and the confirmation is outside the iterator.
   */
  const [spineIdToRemove, setSpineIdToRemove] = useState(null);

  /**
   * The collection of spine specifications
   */
  const [spines, setSpines] = useState([]);

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  function anyError(response) {
    if (response.error) {
      let tempErrors = errors;
      tempErrors.push(response.error);
      setErrors([]);
      setErrors(tempErrors);
    }
    /// It will return a truthy value (depending no the existence
    /// of the errors on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Prepare the data to remove the spine. Ask the user to confirm removal.
   *
   * @param {Integer} spineId
   */
  const handleConfirmRemove = (spineId) => {
    setConfirmingRemove(true);
    setSpineIdToRemove(spineId);
  };

  /**
   * Send a request to delete the selected spine.
   */
  const handleRemoveSpine = async () => {
    let response = await deleteSpecification(spineIdToRemove);

    if (!anyError(response)) {
      toast.success("Spine removed");

      /// Update the UI
      setSpines(spines.filter((spine) => spine.id != spineIdToRemove));
      setConfirmingRemove(false);
    }
  };

  /**
   * Retrieve all the spine specification for this user or organization.
   */
  const handleFetchSpineSpecs = async () => {
    let response = await fetchSpineSpecifications(filter);

    if (!anyError(response)) {
      setSpines(response.specifications);
    }
  };

  useEffect(() => {
    handleFetchSpineSpecs();
  }, []);

  return (
    <Fragment>
      {errors.length ? <AlertNotice message={errors} /> : null}

      <ConfirmDialog
        onRequestClose={() => setConfirmingRemove(false)}
        onConfirm={() => handleRemoveSpine()}
        visible={confirmingRemove}
      >
        <h2 className="text-center">You are removing the spine</h2>
        <h5 className="mt-3 text-center">Please confirm this action.</h5>
      </ConfirmDialog>

      {spines.map((spine) => {
        return (
          <tr key={spine.id}>
            <td>
              {spine.name + " "}{" "}
              <strong className="col-primary">- Spine</strong>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <Link
                to={"/specifications/" + spine.id}
                className="btn btn-sm btn-dark ml-2"
              >
                Edit
              </Link>
              <button
                onClick={() => handleConfirmRemove(spine.id)}
                className="btn btn-sm btn-dark ml-2"
              >
                Remove
              </button>
            </td>
          </tr>
        );
      })}
    </Fragment>
  );
};

export default SpineSpecsList;
