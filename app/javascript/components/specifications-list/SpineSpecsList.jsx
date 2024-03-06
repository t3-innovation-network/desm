import { useEffect, useState } from 'react';
import deleteSpecification from '../../services/deleteSpecification';
import fetchSpineSpecifications from '../../services/fetchSpineSpecifications';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../shared/ConfirmDialog';
import AlertNotice from '../shared/AlertNotice';
import Loader from '../shared/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { showSuccess } from '../../helpers/Messages';

/**
 * @description A list of spine specifications from the user or all the users of the organization
 *
 * Props:
 * @prop {String} filter The filter or the list of specifications. It can be either "all or "user",
 * this last meaning only those spine specifications belonging to the current user.
 */
const SpineSpecsList = (props) => {
  /**
   * Elements from props
   */
  const { filter } = props;
  /**
   * Controls displaying the removal confirmation dialog
   */
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  /**
   * Representation of an error on this page process
   */
  const [errors, setErrors] = useState([]);
  /**
   * Representation of an error on this page process while removing a spine
   */
  const [errorsWhileRemoving, setErrorsWhileRemoving] = useState([]);
  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);
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
   * @param {Array} errorsList
   * @param {Function} updateErrors
   */
  function anyError(response, errorsList, updateErrors) {
    if (response.error) {
      updateErrors([...errorsList, response.error]);
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

    if (!anyError(response, errorsWhileRemoving, setErrorsWhileRemoving)) {
      showSuccess('Spine removed');

      /// Update the UI
      setSpines(spines.filter((spine) => spine.id !== spineIdToRemove));
      setConfirmingRemove(false);
    }
  };

  /**
   * Retrieve all the spine specification for this user or organization.
   */
  const handleFetchSpineSpecs = async () => {
    let response = await fetchSpineSpecifications(filter);

    if (!anyError(response, errors, setErrors)) {
      setSpines(response.specifications);
    }
  };

  /**
   * Use effect with an empty array as second parameter, will trigger the 'handleFetchSpineSpecs'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    handleFetchSpineSpecs().then(() => {
      if (!errors.length) {
        setLoading(false);
      }
    });
  }, []);

  return (
    <>
      {errors.length ? <AlertNotice message={errors} onClose={() => setErrors([])} /> : null}

      <ConfirmDialog
        onRequestClose={() => {
          setConfirmingRemove(false);
          setErrorsWhileRemoving([]);
        }}
        onConfirm={() => handleRemoveSpine()}
        visible={confirmingRemove}
      >
        {errorsWhileRemoving.length ? (
          <AlertNotice message={errorsWhileRemoving} onClose={() => setErrorsWhileRemoving([])} />
        ) : null}
        <h2 className="text-center">You are removing the spine</h2>
        <h5 className="mt-3 text-center">Please confirm this action.</h5>
      </ConfirmDialog>

      {loading ? (
        <tr>
          <td>
            <Loader />
          </td>
        </tr>
      ) : (
        spines.map((spine) => {
          return (
            <tr key={spine.id}>
              <td>
                {spine.name + ' '} <strong className="col-primary">- Spine</strong>
              </td>
              <td />
              <td />
              <td />
              <td />
              <td>
                <Link
                  to={'/specifications/' + spine.id}
                  className="btn btn-sm btn-dark ml-2"
                  title="Edit the spine. You can edit each property here."
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Link>
                <button
                  onClick={() => handleConfirmRemove(spine.id)}
                  className="btn btn-sm btn-dark ml-2"
                  title="Remove the spine"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          );
        })
      )}
    </>
  );
};

export default SpineSpecsList;
