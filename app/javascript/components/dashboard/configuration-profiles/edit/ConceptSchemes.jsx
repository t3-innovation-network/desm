import React, { Fragment, useEffect, useState } from "react";
import {
  NoDataFound,
  SmallAddTabBtn,
  SmallRemovableTab,
  TabGroup,
} from "../utils";

const ConceptSchemes = (props) => {
  const [files, setFiles] = useState(props.files);
  const [activeTab, setActiveTab] = useState(0);
  const [fileName, setFileName] = useState(files[activeTab]?.name || "");
  const [fileVersion, setFileVersion] = useState(
    files[activeTab]?.version || ""
  );
  const [description, setDescription] = useState(
    files[activeTab]?.description || ""
  );
  const [origin, setOrigin] = useState(files[activeTab]?.origin || "");

  const conceptSchemeBtns = () => {
    return files.map((file, idx) => {
      return (
        <SmallRemovableTab
          active={activeTab === idx}
          tabClickHandler={() => setActiveTab(idx)}
          removeClickHandler={() => {}}
          text={file.name}
          tooltipMsg={"Click to view/edit this concept scheme file information"}
        />
      );
    });
  };

  const handleBlur = () => {};

  const currentFileInfo = () => {
    return (
      <Fragment>
        <div className="mt-5">
          <label>
            File Name
            <span className="text-danger">*</span>
          </label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="filename"
              placeholder="The name of the schema file"
              value={fileName || ""}
              onChange={(event) => {
                setFileName(event.target.value);
              }}
              onBlur={handleBlur}
              autoFocus
            />
          </div>
        </div>

        <div className="mt-5">
          <label>Version</label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="version"
              placeholder="The version of the schema file"
              value={fileVersion || ""}
              onChange={(event) => {
                setFileVersion(event.target.value);
              }}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="mt-5">
          <label>Description</label>
          <div className="input-group input-group">
            <textarea
              className="form-control input-lg"
              name="description"
              placeholder="A detailed description of the schema file. E.g. what it represents, which concepts should be expected it to contain."
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
          <label>Origin (URL)</label>
          <div className="input-group input-group">
            <input
              type="url"
              className="form-control input-lg"
              name="origin"
              value={origin}
              onChange={(event) => {
                setOrigin(event.target.value);
              }}
              onBlur={() =>
                handleUrlBlur(origin, "The origin must be a valid URL")
              }
              pattern="https://.*"
              size="30"
              placeholder="https://example.com"
              required
            />
          </div>
        </div>
      </Fragment>
    );
  };

  useEffect(() => {
    const { files } = props;
    if (files.length <= 0) {
      return;
    }

    setFileName(files[activeTab].name);
    setFileVersion(files[activeTab].version);
    setDescription(files[activeTab].description);
    setOrigin(files[activeTab].origin);
  }, [activeTab]);

  return (
    <Fragment>
      <div className="mt-5 ml-3">
        <TabGroup>
          {conceptSchemeBtns()} {<SmallAddTabBtn onClickHandler={() => {}} />}{" "}
        </TabGroup>
      </div>
      {files.length ? (
        currentFileInfo()
      ) : (
        <NoDataFound
          text={`This DSO does not have any concept scheme files declared yet. You can add an agent clicking on the "+" button`}
        />
      )}
    </Fragment>
  );
};

export default ConceptSchemes;
