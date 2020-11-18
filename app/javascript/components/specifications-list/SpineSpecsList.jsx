import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchSpineSpecifications from "../../services/fetchSpineSpecifications";

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
   * Error message to present on the UI
   */
  const [error, setError] = useState("");
  /**
   * The collection of spine specifications
   */
  const [spines, setSpines] = useState([]);

  /**
   * Retrieve all the spine specification for this user or organization
   */
  const handleFetchSpineSpecs = async () => {
    let response = await fetchSpineSpecifications(filter);

    if (response.error) {
      setError(response.error);
      return;
    }

    setSpines(response.specifications);
  };

  useEffect(() => {
    handleFetchSpineSpecs();
  }, []);

  return (
    <Fragment>
      {!_.isEmpty(error) && <AlertNotice message={error} />}
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
            </td>
          </tr>
        );
      })}
    </Fragment>
  );
};

export default SpineSpecsList;
