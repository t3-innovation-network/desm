import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import updateCP from "../../../../services/updateCP";

const DSOMetaData = (props) => {
  const { dsoData } = props;
  const [dsoName, setDsoName] = useState(dsoData.name || "");
  const [dsoEmail, setDsoEmail] = useState(dsoData.email || "");
  const [dsoDescription, setDsoDescription] = useState(
    dsoData.description || ""
  );
  const [homepageURL, setHomepageURL] = useState(dsoData.homepageURL || "");
  const [standardsPage, setStandardsPage] = useState(
    dsoData.standardsPage || ""
  );
  const configurationProfile = useSelector((state) => state.currentCP);
  const dispatch = useDispatch();

  useEffect(() => {
    setDsoName(dsoData.name);
    setDsoEmail(dsoData.email);
    setDsoDescription(dsoData.description);
    setHomepageURL(dsoData.homepageURL);
    setStandardsPage(dsoData.standardsPage);
  }, [dsoData]);

  const handleBlur = () => {
    dispatch(setSavingCP(true));

    updateCP(configurationProfile.id, buildDsoData()).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      dispatch(setSavingCP(false));
    });
  };

  const buildDsoData = () => {
    let localCP = configurationProfile;
    let currentDso = localCP.structure.standardsOrganizations.find(
      (dso) => dso.name === dsoName
    );
    currentDso.name = dsoName;
    currentDso.email = dsoEmail;
    currentDso.homepageURL = homepageURL;
    currentDso.standardsPage = standardsPage;

    return localCP;
  };

  return (
    <div className="col">
      <div className="mt-5">
        <label>
          DSO Name
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            name="name"
            placeholder="The name of the organization"
            value={dsoName || ""}
            onChange={(event) => {
              setDsoName(event.target.value);
            }}
            onBlur={handleBlur}
            autoFocus
          />
        </div>
      </div>

      <div className="mt-5">
        <label>
          DSO Email
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="email"
            className="form-control input-lg"
            name="email"
            placeholder="The email of the organization"
            value={dsoName || ""}
            onChange={(event) => {
              setDsoEmail(event.target.value);
            }}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div className="mt-5">
        <label>DSO Description</label>
        <div className="input-group input-group">
          <textarea
            className="form-control input-lg"
            name="description"
            placeholder="A description that provides consistent information about the standards organization"
            value={dsoDescription || ""}
            onChange={(event) => {
              setDsoDescription(event.target.value);
            }}
            style={{ height: "20rem" }}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div className="mt-5">
        <label>
          Homepage URL
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            name="homepageURL"
            placeholder="The homepage URL of the standards organization"
            value={homepageURL || ""}
            onChange={(event) => {
              setHomepageURL(event.target.value);
            }}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div className="mt-5">
        <label>
          Standards Page
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            name="standardsPage"
            placeholder="The homepage URL of the standards organization"
            value={standardsPage || ""}
            onChange={(event) => {
              setStandardsPage(event.target.value);
            }}
            onBlur={handleBlur}
          />
        </div>
      </div>
    </div>
  );
};

export default DSOMetaData;
