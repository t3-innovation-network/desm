import React from "react";
import { useSelector } from "react-redux";

const DSOMetaData = () => {
  const configurationProfile = useSelector((state) => state.currentCP);

  return (
    <div className="col">
      <div className="mt-5">
        <label>
          Profile Name
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            name="name"
            placeholder="Give a descriptive name for the configuration profile"
            value={configurationProfile.name}
            autoFocus
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <label>Profile Description</label>
        <div className="input-group input-group">
          <textarea
            className="form-control input-lg"
            name="description"
            placeholder="A description that provides consistent information about the standards organization"
            value={configurationProfile.description}
          />
        </div>
      </div>

      <div className="mt-5">
        <label>Date Created</label>
        <div className="input-group input-group">
          <input
            type="date"
            className="form-control input-lg"
            name="createdAt"
            value={configurationProfile.createdAt}
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <label>Date Last Modified</label>
        <div className="input-group input-group">
          <input
            type="date"
            className="form-control input-lg"
            name="updatedAt"
            value={configurationProfile.updatedAt}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DSOMetaData;
