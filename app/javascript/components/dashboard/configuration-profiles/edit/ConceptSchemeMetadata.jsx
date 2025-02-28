import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pickBy } from 'lodash';
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from '../../../../actions/configurationProfiles';
import { validURL } from '../../../../helpers/URL';
import updateCP from '../../../../services/updateCP';

const ConceptSchemeMetadata = ({ schemaFileIdx, conceptSchemeIdx }) => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);

  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [origin, setOrigin] = useState('');
  const dispatch = useDispatch();

  const saveChanges = async () => {
    dispatch(setSavingCP(true));

    const localCP = currentCP;

    localCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas[
      schemaFileIdx
    ].associatedConceptSchemes[conceptSchemeIdx] = pickBy({
      description,
      name,
      origin,
      version,
    });

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

  useEffect(() => {
    const schemaFiles =
      currentCP.structure.standardsOrganizations[currentDSOIndex].associatedSchemas || [];

    const schemaFile = schemaFiles[schemaFileIdx] || {};
    const conceptScheme = (schemaFile.associatedConceptSchemes || [])[conceptSchemeIdx];

    const { description, name, origin, version } = conceptScheme || {};

    setDescription(description || '');
    setName(name || '');
    setOrigin(origin || '');
    setVersion(version || '');
  }, [conceptSchemeIdx, currentDSOIndex, schemaFileIdx]);

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
            placeholder="The name of the concept scheme file"
            value={name || ''}
            onChange={(event) => {
              setName(event.target.value);
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
            placeholder="The version of the concept scheme file"
            value={version || ''}
            onChange={(event) => {
              setVersion(event.target.value);
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
            placeholder="A detailed description of the concept scheme file. E.g. what it represents, which concepts should be expected it to contain."
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
          />
        </div>
        <small className="col-on-primary-light fst-italic">
          Please be sure the content is in one of the following formats: CSV, JSON, JSONLD, RDF or
          XML
        </small>
      </div>
    </>
  );
};

export default ConceptSchemeMetadata;
