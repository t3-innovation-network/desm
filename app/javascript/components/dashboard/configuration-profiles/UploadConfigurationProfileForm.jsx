import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import importCP from '../../../services/importCP';
import AlertNotice from '../../shared/AlertNotice';
import { readFileContent } from './utils';
import Loader from './../../shared/Loader';

const UploadConfigurationProfileForm = () => {
  const [cpName, setCpName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onFileChange = (event) => {
    setError(null);
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!fileContent) {
      setError(['Please upload a file']);
      return;
    }

    setError(null);
    setLoading(true);

    let response = await importCP({
      name: cpName,
      data: JSON.parse(fileContent),
    });

    setLoading(false);

    if (response.error) {
      setError(response.error);
      setSelectedFile(null);
      return;
    }

    history.push('/dashboard/configuration-profiles');
  };

  useEffect(() => {
    if (selectedFile != null)
      readFileContent(
        selectedFile,
        (content) => setFileContent(content),
        (error) => setError(error)
      );
  }, [selectedFile]);

  return (
    <div className="col">
      {error ? (
        <div className="mt-3">
          <AlertNotice message={error} onClose={() => setError(null)} />
        </div>
      ) : (
        ''
      )}

      <div>
        <label className="form-label">
          Configuration Profile Name
          <span className="text-danger">*</span>
        </label>
        <div className="input-group input-group">
          <input
            type="text"
            className="form-control input-lg"
            name="fullname"
            placeholder="The name of the new Configuration Profile"
            value={cpName || ''}
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
          accept=".json"
          onChange={onFileChange}
        />
        <label className="custom-file-label" htmlFor="file-uploader">
          Attach File
          <span className="text-danger">*</span>
        </label>
      </div>
      <div className="mt-5">
        <button className="btn btn-dark" onClick={onFileUpload}>
          {loading ? <Loader noPadding smallSpinner /> : 'Upload!'}
        </button>
      </div>
    </div>
  );
};

export default UploadConfigurationProfileForm;
