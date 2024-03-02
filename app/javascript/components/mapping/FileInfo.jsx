import mime from 'mime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

/**
 * Prints a card with basic information about the selected file.
 *
 * @param {File} selectedFile
 */
const FileInfo = (props) => {
  /**
   * Elements from props
   */
  const { selectedFile } = props;

  return (
    <div className="card mt-3">
      <div className="card-header">
        <FontAwesomeIcon icon={faFile} />
        <span className="pl-2 subtitle">File Details</span>
      </div>
      <div className="card-body">
        <p>
          <strong>File Name:</strong> {selectedFile.name}
        </p>
        <p>
          <strong>File Type:</strong> {mime.getType(selectedFile.name)}
        </p>
        <p>
          <strong>Last Modified:</strong> {' ' + new Date(selectedFile.lastModified).toDateString()}
        </p>
      </div>
    </div>
  );
};

export default FileInfo;
