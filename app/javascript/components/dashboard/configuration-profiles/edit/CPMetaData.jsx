import _ from 'lodash';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import updateCP from '../../../../services/updateCP';
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from '../../../../actions/configurationProfiles';
import { formatDateForInput } from '../utils';

const CPMetaData = () => {
  const configurationProfile = useSelector((state) => state.currentCP);
  const [name, setName] = useState(configurationProfile.name);
  const [description, setDescription] = useState(configurationProfile.description);
  const [createdAt, setCreatedAt] = useState(formatDateForInput(configurationProfile.createdAt));
  const [updatedAt, setUpdatedAt] = useState(formatDateForInput(configurationProfile.updatedAt));
  const dispatch = useDispatch();

  const buildCpData = () =>
    _.pickBy({
      ...configurationProfile,
      createdAt,
      description,
      name,
      structure: _.pickBy({
        ...configurationProfile.structure,
        description,
        name,
      }),
      updatedAt,
    });

  const handleBlur = () => {
    dispatch(setSavingCP(true));

    updateCP(configurationProfile.id, buildCpData()).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      dispatch(setSavingCP(false));
    });
  };

  return (
    <div className="col">
      <div className="mt-5">
        <label htmlFor="name">
          Profile Name
          <span className="ml-1 text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            id="name"
            type="text"
            className="form-control input-lg"
            name="name"
            placeholder="Give a descriptive name for the configuration profile"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            onBlur={handleBlur}
            autoFocus
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="description">Profile Description</label>
        <div className="input-group input-group">
          <textarea
            id="description"
            className="form-control input-lg"
            name="description"
            placeholder="A description that provides consistent information about the standards organization"
            value={description || ''}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            style={{ height: '20rem' }}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="createdAt">Date Created</label>
        <div className="input-group input-group">
          <input
            id="createdAt"
            type="date"
            className="form-control input-lg"
            name="createdAt"
            value={createdAt}
            onChange={(event) => {
              setCreatedAt(event.target.value);
            }}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="updatedAt">Date Last Modified</label>
        <div className="input-group input-group">
          <input
            id="updatedAt"
            type="date"
            className="form-control input-lg"
            name="updatedAt"
            value={updatedAt}
            onChange={(event) => {
              setUpdatedAt(event.target.value);
            }}
            onBlur={handleBlur}
          />
        </div>
      </div>
    </div>
  );
};

export default CPMetaData;
