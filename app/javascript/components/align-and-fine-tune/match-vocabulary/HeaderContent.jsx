import React from "react";

/**
 * Structure of the header for the "Match Vocabulary" component
 *
 * Props:
 * @param {Function} onRequestClose
 * @param {Function} onRequestSave
 */
const HeaderContent = (props) => {
  const { onRequestClose, onRequestSave } = props;

  return (
    <div className="row">
      <div className="col-6">
        <h3>Match Controlled Vocabulary</h3>
      </div>
      <div className="col-6 text-right">
        <button
          className="btn btn-outline-secondary mr-2"
          onClick={onRequestClose}
        >
          Cancel
        </button>
        <button className="btn btn-dark" onClick={onRequestSave}>
          Save Mapping
        </button>
      </div>
    </div>
  );
};

export default HeaderContent;
