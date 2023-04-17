import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import { validURL } from "../../../../helpers/URL";
import updateCP from "../../../../services/updateCP";
import { EMAIL_REGEX } from "../../../../helpers/Constants";

const DSOMetaData = ({ dsoData }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [homepageUrl, setHomepageURL] = useState("");
  const [standardsPage, setStandardsPage] = useState("");
  const configurationProfile = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const dispatch = useDispatch();

  useEffect(() => {
    const { description, email, homepageUrl, name, standardsPage } = dsoData;
    setName(name);
    setEmail(email);
    setDescription(description);
    setHomepageURL(homepageUrl);
    setStandardsPage(standardsPage);
  }, [dsoData]);

  const handleEmailBlur = () => {
    if (!email) {
      dispatch(setEditCPErrors("DSO Email can't be blank"));
      return;
    }

    if (!email.match(EMAIL_REGEX)) {
      dispatch(setEditCPErrors("DSO Email is invalid"));
      return;
    }

    dispatch(setEditCPErrors(null));
    handleBlur();
  };

  const handleNameBlur = () => {
    if (!name) {
      dispatch(setEditCPErrors("DSO Name can't be blank"));
      return;
    }

    dispatch(setEditCPErrors(null));
    handleBlur();
  };

  const handleUrlBlur = (url) => {
    if (!validURL(url)) {
      dispatch(
        setEditCPErrors("Please check the standards page and the homepage URL.")
      );
      return;
    }
    dispatch(setEditCPErrors(null));
    handleBlur();
  };

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
    const organization = localCP.structure.standardsOrganizations[currentDSOIndex];

    localCP.structure.standardsOrganizations[currentDSOIndex] = {
      ...organization,
      ..._.pickBy({
        description,
        email,
        homepageUrl,
        name,
        standardsPage
      })
    };

    return localCP;
  };

  return (
    <div className="col">
      <div className="mt-5">
        <label htmlFor="name">
          DSO Name
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            id="name"
            placeholder="The name of the organization"
            value={name || ""}
            onChange={e => setName(e.target.value.trim())}
            onBlur={handleNameBlur}
            autoFocus
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="email">
          DSO Email
          <span className="ml-1 text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            className="form-control input-lg"
            id="email"
            placeholder="The email of the organization"
            value={email || ""}
            onChange={e => setEmail(e.target.value.trim())}
            onBlur={handleEmailBlur}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="description">DSO Description</label>
        <div className="input-group input-group">
          <textarea
            className="form-control input-lg"
            id="description"
            placeholder="A description that provides consistent information about the standards organization"
            value={description || ""}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            style={{ height: "10rem" }}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="homepageUrl">Homepage URL</label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            id="homepageUrl"
            placeholder="The homepage URL of the standards organization"
            value={homepageUrl || ""}
            onChange={(event) => {
              setHomepageURL(event.target.value);
            }}
            onBlur={() => handleUrlBlur(homepageUrl)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="standardsPage">Standards Page</label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            id="standardsPage"
            placeholder="The homepage URL of the standards organization"
            value={standardsPage || ""}
            onChange={(event) => {
              setStandardsPage(event.target.value);
            }}
            onBlur={() => handleUrlBlur(standardsPage)}
          />
        </div>
      </div>
    </div>
  );
};

export default DSOMetaData;
