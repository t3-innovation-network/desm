import { pickBy } from 'lodash';
import { useEffect, useState } from 'react';
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
import fetchCPSkosLabels from '../../../../services/fetchCpSkosLabels';
import useDidMountEffect from '../../../../helpers/useDidMountEffect';

const MappingPredicates = () => {
  const configurationProfile = useSelector((state) => state.currentCP);
  const dispatch = useDispatch();

  const [name, setName] = useState(configurationProfile.structure.mappingPredicates?.name || '');
  const [version, setVersion] = useState(
    configurationProfile.structure.mappingPredicates?.version || ''
  );
  const [description, setDescription] = useState(
    configurationProfile.structure.mappingPredicates?.description || ''
  );
  const [origin, setOrigin] = useState(
    configurationProfile.structure.mappingPredicates?.origin || ''
  );
  const [jsonMappingPredicates, setJsonMappingPredicates] = useState([]);
  const [predicateStrongestMatch, setPredicateStrongestMatch] = useState(
    configurationProfile.predicateStrongestMatch
  );
  const [loading, setLoading] = useState(false);
  const [urlEditable, setUrlEditable] = useState(
    !configurationProfile.structure.mappingPredicates?.origin
  );
  const [predicateLabels, setPredicateLabels] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const buildCpData = () => ({
    ...configurationProfile,
    jsonMappingPredicates,
    predicateStrongestMatch,
    structure: {
      ...configurationProfile.structure,
      mappingPredicates: pickBy({
        description,
        name,
        origin,
        version,
      }),
    },
  });

  const handleFetchUrl = () => {
    if (!validURL(origin)) {
      dispatch(setEditCPErrors('The mapping predicates origin must be a valid URL'));
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

    setUrlEditable(false);
    setLoading(false);
    saveChanges({ ...buildCpData(), jsonMappingPredicates: skosFile });
  };

  const handleFetchPredicateLabels = () => {
    fetchCPSkosLabels(configurationProfile.id, 'json_mapping_predicates').then((response) => {
      if (response.error) {
        let message = response.error;
        dispatch(setEditCPErrors(message));
        return;
      }

      setPredicateLabels(response.conceptNames);
    });
  };

  const handlePredicateChange = (e) => {
    const { value } = e.target;
    setPredicateStrongestMatch(value);
    saveChanges({ ...buildCpData(), predicateStrongestMatch: value });
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
    const { mappingPredicates } = configurationProfile.structure;

    if (!mappingPredicates) return;

    const { description, name, origin, version } = mappingPredicates;
    setDescription(description || '');
    setName(name || '');
    setOrigin(origin || '');
    setUrlEditable(!origin);
    setVersion(version || '');
  }, [configurationProfile.structure.mappingPredicates, refresh]);

  useEffect(() => {
    setJsonMappingPredicates(configurationProfile.jsonMappingPredicates);

    if (configurationProfile.jsonMappingPredicates) {
      handleFetchPredicateLabels();
    }
  }, [configurationProfile.jsonMappingPredicates]);

  useDidMountEffect(() => {
    setPredicateStrongestMatch(configurationProfile.predicateStrongestMatch);
  }, [configurationProfile.predicateStrongestMatch]);

  return (
    <div className="col">
      <div className="mt-5">
        <label className="form-label" htmlFor="name">
          File Name
          <span className="ms-1 text-danger">*</span>
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
        <label className="form-label" htmlFor="version">
          Version
        </label>
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
        <label className="form-label" htmlFor="description">
          Description
        </label>
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
        <label className="form-label" htmlFor="origin">
          Origin (URL)
          <span className="ms-1 text-danger">*</span>
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
              className="btn btn-dark ms-2"
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
              className="btn btn-dark ms-auto"
              onClick={() => setUrlEditable(true)}
              title="Edit the origin Url"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {predicateLabels.length > 0 && (
        <div>
          <p className="mt-5 fw-bold">👇 Please, select the strongest match</p>
          <div className="form-group">
            {predicateLabels.map((concept, index) => {
              const { label, uri } = concept;
              const id = `predicate-${index}`;

              return (
                <div className="form-check" key={index}>
                  <input
                    className="form-check-input"
                    checked={uri === predicateStrongestMatch}
                    id={id}
                    onChange={handlePredicateChange}
                    type="radio"
                    value={uri}
                  />
                  <label className="cursor-pointer form-check-label" htmlFor={id}>
                    {label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MappingPredicates;
