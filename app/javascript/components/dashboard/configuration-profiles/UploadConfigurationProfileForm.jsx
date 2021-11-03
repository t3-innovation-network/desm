import React, { useState } from "react";

const UploadConfigurationProfileForm = () => {
  const [cpName, setCpName] = useState("");

  return (
    <div className="col">
      <div className="mt-5">
        <label>
          Configuration Profile Name
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            name="fullname"
            placeholder="The name of this agent"
            value={cpName || ""}
            onChange={(event) => {
              setCpName(event.target.value);
            }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default UploadConfigurationProfileForm;
