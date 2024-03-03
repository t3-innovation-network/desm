import {} from 'react';
import TopNav from '../shared/TopNav';
import { Link } from 'react-router-dom';
import fetchMappings from '../../services/fetchMappings';
import Loader from '../shared/Loader';
import TopNavOptions from '../shared/TopNavOptions';
import SpineSpecsList from './SpineSpecsList';
import _ from 'lodash';
import ConfirmDialog from '../shared/ConfirmDialog';
import deleteMapping from '../../services/deleteMapping';
import fetchMappingToExport from '../../services/fetchMappingToExport';
import { downloadFile } from '../../helpers/Export';
import updateMapping from '../../services/updateMapping';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUndo,
  faPencilAlt,
  faEye,
  faDownload,
  faLayerGroup,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../contexts/AppContext';
import { showSuccess } from '../../helpers/Messages';

export default class SpecsList extends Component {
  static contextType = AppContext;

  state = {
    /**
     * Controls displaying the removal confirmation dialog
     */
    confirmingRemove: false,
    /**
     * Representation of an error on this page process
     */
    errors: [],
    /**
     * Representation of an error on this page process while removing a mapping
     */
    errorsWhileRemoving: [],
    /**
     * Represents the filter value to configure the query to get the specifications
     */
    filter: 'user',
    /**
     * Whether the page is loading results or not
     */
    loading: true,
    /**
     * The list of mappings to display
     */
    mappings: [],
    /**
     * The identifier of the mapping to be removed. Saved in state, because the id is in an iterator,
     * and the clicked handles confirmation, and the confirmation is outside the iterator.
     */
    mappingIdToRemove: null,
    /**
     * The options object to use in the select component
     */
    filterOptions: [
      {
        key: 'user',
        value: 'Only My Mappings',
      },
      {
        key: 'all',
        value: 'All Mappings',
      },
    ],
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   * @param {Array} errorsList
   */
  anyError(response, errorsList = this.state.errors) {
    if (response.error) {
      errorsList.push(response.error);
      this.setState({
        errorsList: [...new Set(errorsList)],
      });
    }
    /// It will return a truthy value (depending no the existence
    /// of the errors on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Use effect with an empty array as second parameter, will trigger the 'goForTheMapping'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  componentDidMount() {
    const { errors } = this.state;

    this.goForTheMappings().then(() => {
      if (!errors.length) {
        this.setState({
          loading: false,
        });
      }
    });
  }

  /**
   * Actions to take when the user confirms to remove a mapping
   */
  handleConfirmRemove = (mappingId) => {
    this.setState({
      confirmingRemove: true,
      mappingIdToRemove: mappingId,
    });
  };

  /**
   * Manages to request the mapping in JSON-LD version to export as
   * a JSON file
   *
   * @param {Integer} mappingId
   */
  handleExportMapping = async (mapping) => {
    let response = await fetchMappingToExport(mapping.id);

    if (!this.anyError(response)) {
      downloadFile(response.exportedMapping, `${mapping.name}.json`);
    }
  };

  /**
   * Send a request to delete the selected mapping.
   */
  handleRemoveMapping = async () => {
    const { errorsWhileRemoving, mappings, mappingIdToRemove } = this.state;
    let response = await deleteMapping(mappingIdToRemove);

    if (!this.anyError(response, errorsWhileRemoving)) {
      showSuccess('Mapping removed');

      this.setState({
        confirmingRemove: false,
        mappings: mappings.filter((m) => m.id != mappingIdToRemove),
      });
    }
  };

  /**
   * Change the filter for the listed mappings
   */
  handleFilterChange = async (value) => {
    this.setState({
      filter: value,
    });
    await this.goForTheMappings(value);
  };

  /**
   * Mark a 'mapped' mapping back to 'in-progress'
   *
   * @param {int} mappingId
   */
  handleMarkToInProgress = async (mappingId) => {
    const { mappings } = this.state;

    this.setState({ loading: true });

    /// Change the mapping status
    let response = await updateMapping({
      id: mappingId,
      status: 'in_progress',
    });

    if (!this.anyError(response)) {
      /// Change 'in-memory' status
      let mapping = mappings.find((m) => m.id === mappingId);
      mapping.status = 'in_progress';
      mapping['in_progress?'] = true;
      mapping['mapped?'] = false;

      this.setState(
        {
          mappings: [...mappings],
        },
        () => {
          this.setState({ loading: false });
        }
      );

      /// Notify the user
      showSuccess('Status changed!');
    }

    this.setState({ loading: false });
  };

  /**
   * Mark a 'mapped' mapping back to 'uploaded'
   *
   * @param {int} mappingId
   */
  handleMarkToUploaded = async (mappingId) => {
    const { mappings } = this.state;

    this.setState({ loading: true });

    /// Change the mapping status
    let response = await updateMapping({
      id: mappingId,
      status: 'uploaded',
    });

    if (!this.anyError(response)) {
      /// Change 'in-memory' status
      let mapping = mappings.find((m) => m.id === mappingId);
      mapping.status = 'uploaded';
      mapping['mapped?'] = false;
      mapping['in_progress?'] = false;
      mapping['uploaded?'] = true;

      this.setState(
        {
          mappings: [...mappings],
        },
        () => {
          this.setState({ loading: false });
        }
      );

      /// Notify the user
      showSuccess('Status changed!');
    }

    this.setState({ loading: false });
  };

  /**
   * Get the mappings from the service
   */
  goForTheMappings = async (value) => {
    const { errors, filter } = this.state;

    let filterValue = value || filter;
    let response = await fetchMappings(filterValue);

    if (!this.anyError(response, errors)) {
      this.setState({
        mappings: response.mappings,
      });
    }
  };

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  renderMapping = (mapping) => {
    const fromSameOrg = mapping.organization.id === this.context.organization.id;

    return (
      <tr key={mapping.id}>
        <td>
          {mapping.title} ({mapping.specification.name})
        </td>
        <td>{mapping.specification.version}</td>
        <td>{mapping.mapped_terms + '/' + mapping.selected_terms.length}</td>
        <td>{_.startCase(_.toLower(mapping.status))}</td>
        <td>{mapping.specification.user.fullname}</td>
        <td>
          {mapping['mapped?'] ? (
            <>
              {fromSameOrg && (
                <>
                  <button
                    className="btn btn-sm btn-dark ml-2"
                    onClick={() => this.handleMarkToInProgress(mapping.id)}
                    title="Mark this mapping back to 'in progress'"
                  >
                    <FontAwesomeIcon icon={faUndo} />
                  </button>

                  <Link
                    to={'/mappings/' + mapping.id + '/align'}
                    className="btn btn-sm btn-dark ml-2"
                    title="Edit this mapping"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </Link>
                </>
              )}

              <Link
                to={`/mappings-list?abstractClass=${mapping.domain}`}
                className="btn btn-sm btn-dark ml-2"
                title="View this mapping"
              >
                <FontAwesomeIcon icon={faEye} />
              </Link>

              <button
                className="btn btn-sm btn-dark ml-2"
                onClick={() => this.handleExportMapping(mapping)}
                title="Export this mapping"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </>
          ) : (
            <>
              {mapping['in_progress?']
                ? fromSameOrg && (
                    <button
                      className="btn btn-sm btn-dark ml-2"
                      onClick={() => this.handleMarkToUploaded(mapping.id)}
                      title="Mark this mapping back to 'uploaded'"
                    >
                      <FontAwesomeIcon icon={faUndo} />
                    </button>
                  )
                : ''}
              {fromSameOrg && (
                <Link
                  to={
                    mapping['uploaded?']
                      ? /// This mapping has mapped terms, but it has not finished selecting the terms from the specification
                        '/mappings/' + mapping.id
                      : /// It's on the 3d step (align and fine tune), already selected the terms from the specification, and
                        /// now it's mapping terms into the spine terms
                        '/mappings/' + mapping.id + '/align'
                  }
                  className="btn btn-sm ml-2 bg-col-primary col-background"
                  title="Resume, continue mapping"
                >
                  <FontAwesomeIcon icon={faLayerGroup} />
                </Link>
              )}
            </>
          )}

          {fromSameOrg && (
            <button
              onClick={() => this.handleConfirmRemove(mapping.id)}
              className="btn btn-sm btn-dark ml-2"
              title="Remove this mapping"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </td>
      </tr>
    );
  };

  render() {
    const { confirmingRemove, filter, filterOptions, loading, mappings } = this.state;

    return (
      <div className="container-fluid">
        <TopNav centerContent={this.navCenterOptions} />
        <div className="row">
          <div className="col p-lg-5 pt-5">
            <h1>My Specifications</h1>
            <p>
              Current configuration profile:{' '}
              <mark>{this.context.currentConfigurationProfile.name}</mark>
            </p>
            {loading ? (
              <Loader />
            ) : (
              <>
                <ConfirmDialog
                  onRequestClose={() => this.setState({ confirmingRemove: false })}
                  onConfirm={() => this.handleRemoveMapping()}
                  visible={confirmingRemove}
                >
                  <h2 className="text-center">You are removing a specification</h2>
                  <h5 className="mt-3 text-center">Please confirm this action.</h5>
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
                            onChange={(e) => this.handleFilterChange(e.target.value)}
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
                      {mappings.length > 0 ? mappings.map(this.renderMapping) : <tr />}
                    </tbody>
                  </table>

                  <hr className="rounded-divider" />

                  {mappings.length === 0 && (
                    <div className="card text-center">
                      <div className="card-header bg-col-on-primary-highlight">
                        <p>All the specifications you and your team map will be visible here</p>
                      </div>
                      <div className="card-body bg-col-on-primary-highlight">
                        <Link to="/new-mapping" className="btn bg-col-primary col-background">
                          Map a specification
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
