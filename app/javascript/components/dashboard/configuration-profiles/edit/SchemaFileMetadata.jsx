import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pickBy } from 'lodash';
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from '../../../../actions/configurationProfiles';
import updateCP from '../../../../services/updateCP';
import fetchCPSkosLabels from '../../../../services/fetchCpSkosLabels';
import { validURL } from '../../../../helpers/URL';

const SchemaFileMetadata = ({ schemaFileIdx }) => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const schemaFiles =
    currentCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas || [];
  const file = schemaFiles[schemaFileIdx] || {};

  const [abstractClass, setAbstractClass] = useState(file.associatedAbstractClass || '');
  const [fileName, setFileName] = useState(file.name || '');
  const [fileVersion, setFileVersion] = useState(file.version || '');
  const [description, setDescription] = useState(file.description || '');
  const [origin, setOrigin] = useState(file.origin || '');
  const [abstractClassesLabels, setAbstractClassesLabels] = useState([]);
  const dispatch = useDispatch();

  const saveChanges = async () => {
    dispatch(setSavingCP(true));

    const files = schemaFiles;

    files[schemaFileIdx] = pickBy({
      name: fileName,
      associatedAbstractClass: abstractClass,
      description: description,
      origin: origin,
      version: fileVersion,
      associatedConceptSchemes: schemaFiles[schemaFileIdx].associatedConceptSchemes,
    });

    const localCP = currentCP;

    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas = files;

    const { configurationProfile, error } = await updateCP(currentCP.id, localCP);

    if (error) {
      dispatch(setEditCPErrors(error));
      dispatch(setSavingCP(false));
      return;
    }

    dispatch(setCurrentConfigurationProfile(configurationProfile));
    dispatch(setSavingCP(false));
  };

  const handleUrlBlur = (url, errorMessage = 'Must be a valid URL', blurHandler) => {
    if (url === '') {
      dispatch(setEditCPErrors(null));
      blurHandler();
      return;
    }

    if (!validURL(url)) {
      dispatch(setEditCPErrors(errorMessage));
      return;
    }
    dispatch(setEditCPErrors(null));
    blurHandler();
  };

  const handleFetchAbstractClassesLabels = () => {
    fetchCPSkosLabels(currentCP.id, 'json_abstract_classes').then((response) => {
      if (response.error) {
        let message = response.error;
        dispatch(setEditCPErrors(message));
        return;
      }

      setAbstractClassesLabels(response.conceptNames);
    });
  };

  useEffect(() => {
    setAbstractClass(file.associatedAbstractClass || '');
    setFileName(file.name || '');
    setFileVersion(file.version || '');
    setDescription(file.description || '');
    setOrigin(file.origin || '');
    handleFetchAbstractClassesLabels();
  }, [schemaFileIdx]);

  useEffect(() => {
    if (abstractClass) saveChanges();
  }, [abstractClass]);

  return (
    <>
      <div className="mt-5">
        <label className="form-label" htmlFor="filename">
          File Name
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            id="filename"
            placeholder="The name of the schema file"
            value={fileName || ''}
            onChange={(event) => {
              setFileName(event.target.value);
            }}
            onBlur={saveChanges}
            autoFocus
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="form-label" htmlFor="version">
          Version
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            id="version"
            placeholder="The version of the schema file"
            value={fileVersion || ''}
            onChange={(event) => {
              setFileVersion(event.target.value);
            }}
            onBlur={saveChanges}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <div className="input-group input-group">
          <textarea
            className="form-control input-lg"
            id="description"
            placeholder="A detailed description of the schema file. E.g. what it represents, which concepts should be expected it to contain."
            value={description || ''}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            style={{ height: '10rem' }}
            onBlur={saveChanges}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="form-label" htmlFor="origin">
          Origin (URL)
          <span className="ms-1 text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="url"
            className="form-control input-lg"
            id="origin"
            value={origin || ''}
            onChange={(event) => {
              setOrigin(event.target.value);
            }}
            onBlur={() => handleUrlBlur(origin, 'The origin must be a valid URL', saveChanges)}
            pattern="https://.*"
            size="30"
            placeholder="https://example.com"
            required
          />
        </div>
        <small className="col-on-primary-light fst-italic">
          Please be sure the content is in one of the following formats: CSV, JSON, JSONLD, RDF or
          XML
        </small>
      </div>

      {abstractClassesLabels.length > 0 ? (
        <div className="mt-5">
          <label className="form-label" htmlFor="abstractClass">
            Associated Abstract Class
          </label>
          <div className="input-group input-group">
            <select
              className="form-select cursor-pointer"
              id="abstractClass"
              value={abstractClass}
              onChange={(e) => setAbstractClass(e.target.value)}
            >
              <option value="" />
              {abstractClassesLabels.map(function (option) {
                return (
                  <option
                    key={option['uri']}
                    value={option['uri']}
                    defaultChecked={option['uri'] === abstractClass}
                  >
                    {option['label']}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      ) : (
        <p>
          This configuration profile has no abstract classes yet selected. Please go to Step 2 and
          select one so each schema file can be related to an abstract class.
        </p>
      )}
    </>
  );
};

export default SchemaFileMetadata;
