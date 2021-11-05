import { decamelizeKeys } from "humps";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import checkCPStructureValidity from "../../../services/checkCPStructureValidity";
import createCP from "../../../services/createCP";
import AlertNotice from "../../shared/AlertNotice";
import { readFileContent } from "./utils";

const UploadConfigurationProfileForm = () => {
  const [cpName, setCpName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [errors, setErrors] = useState([]);
  const history = useHistory();
  const [fileIsValid, setFileIsValid] = useState(false);

  const checkFileValidity = async () => {
    let response = await checkCPStructureValidity(fileContent);
    let validationResult = response?.validity?.validation;

    if (validationResult.length) {
      setErrors(validationResult);
      setFileIsValid(false);
      return;
    }

    setErrors([]);
    setFileIsValid(true);
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!fileContent || !cpName) {
      setErrors(["Please be sure to type a name and select a file"]);
      return;
    }

    setError(null);

    let response = await createCP({
      name: cpName,
      structure: decamelizeKeys(JSON.parse(fileContent)),
    });

    if (response.errors) {
      setErrors([response.errors]);
      return;
    }

    history.push("/dashboard/configuration-profiles");
  };

  useEffect(() => {
    if (selectedFile != null)
      readFileContent(
        selectedFile,
        (content) => setFileContent(content),
        (error) => setErrors([error])
      );
  }, [selectedFile]);

  useEffect(() => {
    if (fileContent) checkFileValidity();
  }, [fileContent]);

  return (
    <div className="col">
      {errors.length > 0 ? (
        <div className="mt-3">
          <AlertNotice message={errors} />
        </div>
      ) : (
        ""
      )}

      <div className="mt-5">
        <div
          className={`float-right ${
            fileIsValid ? "text-success" : "text-danger"
          }`}
        >
          {fileContent ? (fileIsValid ? "Valid" : "Invalid") : ""}
        </div>
        <label>
          Configuration Profile Name
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            name="fullname"
            placeholder="The name of the new Configuration Profile"
            value={cpName || ""}
            onChange={(event) => {
              setCpName(event.target.value);
            }}
            autoFocus
          />
        </div>
      </div>
      <div className="custom-file mt-5">
        <input
          type="file"
          data-show-upload="true"
          data-show-caption="true"
          id="file-uploader"
          aria-describedby="upload-help"
          accept=".json, .jsonld"
          onChange={onFileChange}
        />
        <label className="custom-file-label" htmlFor="file-uploader">
          Attach File
          <span className="text-danger">*</span>
        </label>
      </div>
      {selectedFile && fileContent && (
        <div className="mt-5">
          <div
            className="card mt-2 mb-2 has-scrollbar scrollbar"
            style={{ maxHeight: "250px" }}
          >
            <div className="card-body">
              <pre>
                <code>{fileContent}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5">
        <button
          className="btn btn-dark"
          onClick={onFileUpload}
          disabled={!fileIsValid}
        >
          Upload!
        </button>
      </div>
    </div>
  );
};

export default UploadConfigurationProfileForm;
