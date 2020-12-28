import React, { useState, useEffect, Fragment } from "react";
import TopNav from "../shared/TopNav";
import { Link } from "react-router-dom";
import fetchMappings from "../../services/fetchMappings";
import Loader from "../shared/Loader";
import TopNavOptions from "../shared/TopNavOptions";
import SpineSpecsList from "./SpineSpecsList";
import _ from "lodash";
import ConfirmDialog from "../shared/ConfirmDialog";
import { toastr as toast } from "react-redux-toastr";
import deleteMapping from "../../services/deleteMapping";
import fetchMappingToExport from "../../services/fetchMappingToExport";
import { downloadFile } from "../../helpers/Export";

const SpecsList = () => {
  /**
   * Controls displaying the removal confirmation dialog
   */
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  /**
   * Representation of an error on this page process
   */
  const [errors, setErrors] = useState([]);
  /**
   * Representation of an error on this page process while removing a mapping
   */
  const [errorsWhileRemoving, setErrorsWhileRemoving] = useState([]);
  /**
   * Represents the filter value to configure the query to get the specifications
   */
  const [filter, setFilter] = useState("user");
  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);
  /**
   * The list of mappings to display
   */
  const [mappings, setMappings] = useState([]);
  /**
   * The identifier of the mapping to be removed. Saved in state, because the id is in an iterator,
   * and the clicked handles confirmation, and the confirmation is outside the iterator.
   */
  const [mappingIdToRemove, setMappingIdToRemove] = useState(null);
  /**
   * The options object to use in the select component
   */
  const filterOptions = [
    {
      key: "user",
      value: "Only My Mappings",
    },
    {
      key: "all",
      value: "All Mappings",
    },
  ];

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   * @param {Array} errorsList
   * @param {Function} updateErrors
   */
  function anyError(response, errorsList, updateErrors) {
    if (response.error) {
      errorsList.push(response.error);
      updateErrors([...new Set(errorsList)]);
    }
    /// It will return a truthy value (depending no the existence
    /// of the errors on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Actions to take when the user confirms to remove a mapping
   */
  const handleConfirmRemove = (mappingId) => {
    setConfirmingRemove(true);
    setMappingIdToRemove(mappingId);
  };

  /**
   * Manages to request the mapping in JSON-LD version to export as
   * a JSON file
   *
   * @param {Integer} mappingId
   */
  const handleExportMapping = async (mappingId) => {
    let response = await fetchMappingToExport(mappingId);

    if (!anyError(response)) {
      downloadFile(response.exportedMapping);
    }
  };

  /**
   * Send a request to delete the selected mapping.
   */
  const handleRemoveMapping = async () => {
    let response = await deleteMapping(mappingIdToRemove);

    if (!anyError(response, errorsWhileRemoving, setErrorsWhileRemoving)) {
      toast.success("Mapping removed");

      setMappings(
        mappings.filter((mapping) => mapping.id != mappingIdToRemove)
      );
      setConfirmingRemove(false);
    }
  };

  /**
   * Change the filter for the listed mappings
   */
  const handleFilterChange = (value) => {
    setFilter(value);
    goForTheMappings(value);
  };

  /**
   * Get the mappings from the service
   */
  const goForTheMappings = async (value) => {
    let filterValue = value || filter;
    let response = await fetchMappings(filterValue);

    if (!anyError(response, errors, setErrors)) {
      setMappings(response.mappings);
    }
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'goForTheMapping'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    goForTheMappings().then(() => {
      if (!errors.length) {
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="wrapper">
      <TopNav centerContent={navCenterOptions} />
      <div className="container-fluid container-wrapper">
        <div className="row">
          <div className="col p-lg-5 pt-5">
            <h4>My Specifications</h4>
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <ConfirmDialog
                  onRequestClose={() => setConfirmingRemove(false)}
                  onConfirm={() => handleRemoveMapping()}
                  visible={confirmingRemove}
                >
                  <h2 className="text-center">
                    You are removing a specification
                  </h2>
                  <h5 className="mt-3 text-center">
                    Please confirm this action.
                  </h5>
                </ConfirmDialog>

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Specification Name</th>
                        <th scope="col">Version</th>
                        <th scope="col">Mapped</th>
                        <th scope="col">Status</th>
                        <th scope="col">Author</th>
                        <th scope="col">
                          <select
                            className="form-control"
                            value={filter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                          >
                            {filterOptions.map(function (option) {
                              return (
                                <option key={option.key} value={option.key}>
                                  {option.value}
                                </option>
                              );
                            })}
                          </select>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <SpineSpecsList filter={filter} />
                      {mappings.length > 0 ? (
                        mappings.map((mapping) => {
                          return (
                            <tr key={mapping.id}>
                              <td>{mapping.title}</td>
                              <td>{mapping.specification.version}</td>
                              <td>
                                {mapping.mapped_terms +
                                  "/" +
                                  mapping.selected_terms.length}
                              </td>
                              <td>{_.startCase(_.toLower(mapping.status))}</td>
                              <td>{mapping.specification.user.fullname}</td>
                              <td>
                                {mapping["mapped?"] ? (
                                  <Link
                                    to={"/mappings/" + mapping.id + "/align"}
                                    className="btn btn-sm btn-dark ml-2"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Edit this mapping"
                                  >
                                    <i className="fas fa-pencil-alt"></i>
                                  </Link>
                                ) : (
                                  <Link
                                    to={
                                      mapping["uploaded?"]
                                        ? /// This mapping has mapped terms, but it has not finished selecting the terms from the specification
                                          "/mappings/" + mapping.id
                                        : /// It's on the 3d step (algin and fine tune), already selected the terms from the specification, and
                                          /// now it's mapping terms into the spine terms
                                          "/mappings/" + mapping.id + "/align"
                                    }
                                    className="btn btn-sm ml-2 bg-col-primary col-background"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Resume, continue mapping"
                                  >
                                    <i className="fas fa-layer-group"></i>
                                  </Link>
                                )}

                                {mapping["mapped?"] ? (
                                  <Link
                                    to={
                                      "/mappings-list?abstractClass=" +
                                      mapping.domain
                                    }
                                    className="btn btn-sm btn-dark ml-2"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="View this mapping"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </Link>
                                ) : (
                                  ""
                                )}

                                <button
                                  onClick={() =>
                                    handleConfirmRemove(mapping.id)
                                  }
                                  className="btn btn-sm btn-dark ml-2"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Remove this mapping"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                                {mapping["mapped?"] ? (
                                  <button
                                    className="btn btn-sm btn-dark ml-2"
                                    onClick={() =>
                                      handleExportMapping(mapping.id)
                                    }
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Export this mapping"
                                  >
                                    <i className="fas fa-download"></i>
                                  </button>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr></tr>
                      )}
                    </tbody>
                  </table>

                  <hr className="rounded-divider" />

                  {mappings.length == 0 && (
                    <div className="card text-center">
                      <div className="card-header bg-col-on-primary-highlight">
                        <p>
                          All the specifications you and your team map will be
                          visible here
                        </p>
                      </div>
                      <div className="card-body bg-col-on-primary-highlight">
                        <Link
                          to="/new-mapping"
                          className="btn bg-col-primary col-background"
                        >
                          Map a specification
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecsList;
