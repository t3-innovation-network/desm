import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import updateCP from '../../../../services/updateCP';
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from '../../../../actions/configurationProfiles';
import { validURL } from '../../../../helpers/URL';
import fetchSkosFile from '../../../../services/fetchSkosFile';
import Loader from '../../../shared/Loader';
import { useEffect } from 'react';
import fetchCPSkosLabels from '../../../../services/fetchCpSkosLabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { downloadFile } from '../../../../helpers/Export';
import fetchMappingExportProfile from '../../../../services/fetchMappingExportProfile';
import _ from 'lodash';
import { showError } from '../../../../helpers/Messages';
import useDidMountEffect from '../../../../helpers/useDidMountEffect';

const AbstractClasses = () => {
  const configurationProfile = useSelector((state) => state.currentCP);
  const dispatch = useDispatch();

  const [name, setName] = useState(configurationProfile.structure.abstractClasses?.name || '');
  const [version, setVersion] = useState(
    configurationProfile.structure.abstractClasses?.version || ''
  );
  const [description, setDescription] = useState(
    configurationProfile.structure.abstractClasses?.description || ''
  );
  const [origin, setOrigin] = useState(
    configurationProfile.structure.abstractClasses?.origin || ''
  );
  const [jsonAbstractClasses, setJsonAbstractClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [urlEditable, setUrlEditable] = useState(
    !configurationProfile.structure.abstractClasses?.origin
  );
  const [abstractClassesLabels, setAbstractClassesLabels] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const buildCpData = () => ({
    ...configurationProfile,
    jsonAbstractClasses,
    structure: {
      ...configurationProfile.structure,
      abstractClasses: {
        description,
        name,
        origin,
        version,
      },
    },
  });

  const handleFetchUrl = () => {
    if (!validURL(origin)) {
      dispatch(setEditCPErrors('The abstract classes origin must be a valid URL'));
      return;
    }
    dispatch(setEditCPErrors(null));
    handleFetchSkosFile();
  };

  const handleFetchSkosFile = async () => {
    setLoading(true);

    const { error, skosFile, valid } = await fetchSkosFile(origin);

    if (error || !valid) {
      dispatch(setEditCPErrors(error || 'Invalid Skos File'));
      setLoading(false);
      return;
    }

    // setJsonAbstractClasses(skosFile);
    setUrlEditable(false);
    setLoading(false);
    saveChanges({ ...buildCpData(), jsonAbstractClasses: skosFile });
  };

  const handleFetchAbstractClassesLabels = () => {
    fetchCPSkosLabels(configurationProfile.id, 'json_abstract_classes').then((response) => {
      if (response.error) {
        let message = response.error;
        dispatch(setEditCPErrors(message));
        return;
      }

      setAbstractClassesLabels(response.conceptNames);
    });
  };

  const saveChanges = async (data = null) => {
    dispatch(setSavingCP(true));

    const response = await updateCP(configurationProfile.id, data || buildCpData());

    if (response.error) {
      dispatch(setEditCPErrors(response.error));
      dispatch(setSavingCP(null));
      // need to revert to previous values
      setRefresh(!refresh);
      return;
    }

    dispatch(setCurrentConfigurationProfile(response.configurationProfile));
    dispatch(setSavingCP(false));
  };

  useDidMountEffect(() => {
    const { abstractClasses } = configurationProfile.structure;

    if (!abstractClasses) return;

    const { description, name, origin, version } = abstractClasses;
    setDescription(description || '');
    setName(name || '');
    setOrigin(origin || '');
    setUrlEditable(!origin);
    setVersion(version || '');
  }, [configurationProfile.structure.abstractClasses, refresh]);

  useEffect(() => {
    const { jsonAbstractClasses } = configurationProfile;
    setJsonAbstractClasses(jsonAbstractClasses);

    if (Object.keys(jsonAbstractClasses || {}).length) {
      handleFetchAbstractClassesLabels();
    }
  }, [configurationProfile.jsonAbstractClasses]);

  return (
    <div className="col">
      <div className="mt-5">
        <label htmlFor="name">
          File Name
          <span className="ml-1 text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            id="name"
            type="text"
            className="form-control input-lg"
            placeholder="The name of the skos file."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => saveChanges()}
            autoFocus
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="version">Version</label>
        <div className="input-group input-group">
          <input
            id="version"
            type="text"
            className="form-control input-lg"
            placeholder="The version of the skos file"
            maxLength={5}
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            onBlur={() => saveChanges()}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="description">Description</label>
        <div className="input-group input-group">
          <textarea
            id="description"
            className="form-control input-lg"
            placeholder="A description what the skos file represents."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            onBlur={() => saveChanges()}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="origin">
          Origin (URL)
          <span className="ml-1 text-danger">*</span>
        </label>
        {urlEditable ? (
          <div className="input-group input-group">
            <input
              id="origin"
              type="url"
              className="form-control input-lg"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              pattern="https://.*"
              size="30"
              placeholder="https://example.com"
              required
            />
            <button
              className="btn btn-dark ml-2"
              onClick={handleFetchUrl}
              disabled={!origin}
              title="Fetch the concepts"
            >
              {loading ? <Loader noPadding smallSpinner /> : 'Fetch'}
            </button>
          </div>
        ) : (
          <div className="input-group input-group">
            <label>{origin}</label>
            <button
              className="btn btn-dark ml-auto"
              onClick={() => setUrlEditable(true)}
              title="Edit the origin Url"
            >
              Edit
            </button>
          </div>
        )}
        <small className="col-on-primary-light font-italic">
          Please be sure the content is in one of the following formats: CSV, JSON, JSONLD, RDF or
          XML
        </small>
      </div>

      {configurationProfile.state === 'active' && abstractClassesLabels.length > 0 ? (
        <AbstractClassesTable
          abstractClassesLabels={abstractClassesLabels}
          cpId={configurationProfile.id}
        />
      ) : (
        <ul>
          {abstractClassesLabels.map((acl) => {
            return <li key={acl['uri']}>{acl['label']}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

const AbstractClassesTable = ({ abstractClassesLabels, cpId }) => {
  const anyError = (response) => {
    if (response.error) {
      showError(response.error);
    }

    return !_.isUndefined(response.error);
  };

  /**
   * Manages to request the mapping export profile in JSON-LD version to export as
   * a JSON file
   *
   * @param {String} uri
   */
  const handleGetMappingExportProfile = async (uri) => {
    let response = await fetchMappingExportProfile(cpId, uri);

    if (!anyError(response)) {
      downloadFile(response.mappingExportProfile);
    }
  };

  return (
    <div className="table-responsive text-nowrap">
      <table className="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {abstractClassesLabels.map((concept) => {
            return (
              <tr key={concept['uri']}>
                <td>{concept['label']}</td>
                <td>
                  <button
                    className="btn btn-sm btn-dark ml-2"
                    onClick={() => handleGetMappingExportProfile(concept['label'])}
                    title="Export corresponding mapping export profile for this abstract class"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AbstractClasses;
