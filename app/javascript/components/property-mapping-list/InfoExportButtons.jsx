const InfoExportButtons = ({ store, cls = '' }) => {
  const [state, actions] = store;
  return (
    <div className={`col-auto d-flex gap-2 ${cls}`}>
      <button
        className="btn btn-light border-dark-subtle border pb-0"
        disabled={!state.isInfoEnabled}
        onClick={() => actions.setShowInfo(!state.showInfo)}
      >
        <span className="desm-icon fs-3">info</span>
      </button>
      <button
        className="btn btn-light border-dark-subtle border pb-0"
        disabled={!state.isExportEnabled}
        onClick={() => actions.setShowExport(!state.showExport)}
      >
        <span className="desm-icon fs-3">download</span>
      </button>
    </div>
  );
};

export default InfoExportButtons;
