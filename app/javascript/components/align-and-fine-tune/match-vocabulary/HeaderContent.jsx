const HeaderContent = (props) => {
  const { onRequestClose, onRequestSave, disableSave } = props;

  return (
    <div className="row">
      <div className="col-6">
        <h3>Match Controlled Vocabulary</h3>
      </div>
      <div className="col-6 text-right">
        <button className="btn btn-outline-secondary mr-2" onClick={onRequestClose}>
          Cancel
        </button>
        <button className="btn btn-dark" onClick={onRequestSave} disabled={disableSave}>
          Save Mapping
        </button>
      </div>
    </div>
  );
};

export default HeaderContent;
