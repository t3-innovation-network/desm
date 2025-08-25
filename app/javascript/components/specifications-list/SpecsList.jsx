import { useEffect, useContext } from 'react';
import { useLocalStore } from 'easy-peasy';
import TopNav from '../shared/TopNav';
import { Link, Redirect } from 'react-router-dom';
import Loader from '../shared/Loader';
import TopNavOptions from '../shared/TopNavOptions';
import SpineSpecsList from './SpineSpecsList';
import ConfirmDialog from '../shared/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUndo,
  faPencilAlt,
  faFilePen,
  faEye,
  faDownload,
  faLayerGroup,
  faTrash,
  faFileCsv,
  faFileArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../contexts/AppContext';
import { pageRoutes } from '../../services/pageRoutes';
import { FILTER_OPTIONS, specsListStore } from './stores/specsListStore';
import { i18n } from '../../utils/i18n';

const SpecsList = (_props) => {
  const { currentConfigurationProfile, organization } = useContext(AppContext);
  const [state, actions] = useLocalStore(() => specsListStore());
  const { mappings, filter, loading } = state;

  useEffect(() => {
    if (!currentConfigurationProfile) return;
    actions.fetchDataFromAPI();
  }, [filter, currentConfigurationProfile]);

  // Redirect if no configuration profile selected
  if (!currentConfigurationProfile) {
    return <Redirect to={pageRoutes.configurationProfileSelect()} />;
  }

  // Mark a 'mapped' mapping back to 'in-progress'
  const handleMarkToInProgress = (mappingId) =>
    actions.handleUpdateMappingStatus({ mappingId, status: 'in_progress' });
  // Mark a 'mapped' mapping back to 'uploaded'
  const handleMarkToUploaded = (mappingId) =>
    actions.handleUpdateMappingStatus({ mappingId, status: 'uploaded' });
  // Mark a 'uploaded' mapping back to 'ready to upload'
  const handleMarkToReady = (mappingId) =>
    actions.handleUpdateMappingStatus({ mappingId, status: 'ready_to_upload' });

  // Configure the options to see at the center of the top navigation bar
  const navCenterOptions = () => <TopNavOptions viewMappings={true} mapSpecification={true} />;
  const renderUndo = (mapping, fn) => (
    <button
      className="btn btn-sm btn-dark ms-2"
      onClick={() => fn(mapping.id)}
      title={i18n.t(`ui.specifications.mapping.undo.${mapping.status}`)}
      disabled={state.isDisabled}
    >
      <FontAwesomeIcon icon={faUndo} />
    </button>
  );

  const renderMapping = (mapping) => {
    const fromSameOrg = mapping.organization.id === organization?.id;
    let specificationName = mapping.specification.name;
    if (mapping.specification.version) {
      specificationName += ` (${mapping.specification.version})`;
    }

    return (
      <tr key={mapping.id}>
        <td>{mapping.domain}</td>
        <td>{specificationName}</td>
        <td>{mapping.mapped_terms + '/' + mapping.selected_terms.length}</td>
        <td>{i18n.t(`ui.mapping.status.${mapping.status}`)}</td>
        <td>
          {mapping.specification.user.fullname} ({mapping.organization.name})
        </td>
        <td>
          {mapping['mapped?'] ? (
            <>
              {fromSameOrg && (
                <>
                  {renderUndo(mapping, handleMarkToInProgress)}
                  <Link
                    to={pageRoutes.mappingInProgress(mapping.id)}
                    className="btn btn-sm btn-dark ms-2"
                    title="Edit this mapping"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </Link>
                </>
              )}

              <Link
                to={pageRoutes.mappingsList(currentConfigurationProfile?.id, mapping.domain)}
                className="btn btn-sm btn-dark ms-2"
                title="View this mapping"
              >
                <FontAwesomeIcon icon={faEye} />
              </Link>

              <button
                className="btn btn-sm btn-dark ms-2"
                disabled={state.isDisabled}
                onClick={() => actions.downloadExportedMappings({ format: 'jsonld', mapping })}
                title="Export as JSON-LD"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>

              <button
                className="btn btn-sm btn-dark ms-2"
                disabled={state.isDisabled}
                onClick={() => actions.downloadExportedMappings({ format: 'ttl', mapping })}
                title="Export as Turtle"
              >
                <FontAwesomeIcon icon={faFileArrowDown} />
              </button>

              <button
                className="btn btn-sm btn-dark ms-2"
                disabled={state.isDisabled}
                onClick={() => actions.downloadExportedMappings({ format: 'csv', mapping })}
                title="Export as CSV"
              >
                <FontAwesomeIcon icon={faFileCsv} />
              </button>
            </>
          ) : (
            <>
              {mapping['in_progress?'] || mapping['uploaded?']
                ? fromSameOrg &&
                  renderUndo(
                    mapping,
                    mapping['in_progress?'] ? handleMarkToUploaded : handleMarkToReady
                  )
                : ''}
              {fromSameOrg && (
                <Link
                  to={pageRoutes.mappingByStatus(mapping.id, mapping.status)}
                  className="btn btn-sm ms-2 bg-col-primary col-background"
                  title="Resume, continue mapping"
                >
                  <FontAwesomeIcon icon={faLayerGroup} />
                </Link>
              )}
            </>
          )}
          {fromSameOrg && (
            <Link
              to={pageRoutes.mappingPropertiesList(mapping.id)}
              className="btn btn-sm btn-dark ms-2"
              title="Edit mapping's properties. You can edit each property here."
            >
              <FontAwesomeIcon icon={faFilePen} />
            </Link>
          )}
          {fromSameOrg && (
            <button
              onClick={() => actions.confirmRemove(mapping.id)}
              className="btn btn-sm btn-dark ms-2"
              title="Remove this mapping"
              disabled={state.isDisabled}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </td>
      </tr>
    );
  };

  const renderTable = () => {
    if (loading) {
      return <Loader />;
    }

    return (
      <>
        <ConfirmDialog
          onRequestClose={actions.cancelRemove}
          onConfirm={actions.handleRemoveMapping}
          visible={state.confirmingRemove}
        >
          <h2 className="text-center">You are removing a specification</h2>
          <h5 className="mt-3 text-center">Please confirm this action.</h5>
        </ConfirmDialog>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Abstract Class</th>
                <th scope="col">Specification (Version)</th>
                <th scope="col">Mapped</th>
                <th scope="col">Status</th>
                <th scope="col">Author (Affiliation)</th>
                <th scope="col">
                  <select
                    className="form-select"
                    value={filter}
                    onChange={(e) => actions.setFilter(e.target.value)}
                  >
                    {FILTER_OPTIONS.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              <SpineSpecsList filter={filter} spines={state.spines} />
              {mappings.length > 0 ? mappings.map(renderMapping) : <tr />}
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
    );
  };

  return (
    <>
      <TopNav centerContent={navCenterOptions} />
      <div className="container-fluid desm-content" role="main">
        <div className="row">
          <div className="col p-lg-5 pt-5">
            <h1>Mappings for {currentConfigurationProfile?.name}</h1>
            {renderTable()}
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecsList;
