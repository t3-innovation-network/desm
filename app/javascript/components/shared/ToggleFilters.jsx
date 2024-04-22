import { i18n } from 'utils/i18n';

const ToggleFilters = ({ showFilters, toggleFilters }) => {
  return (
    <div className="mb-3" onClick={toggleFilters}>
      <button className="btn btn-dark mr-3">{showFilters ? '▲' : '▼'}</button>
      <label className="cursor-pointer non-selectable">
        {i18n.t(`ui.filters.${showFilters ? 'hide' : 'show'}`)}
      </label>
    </div>
  );
};

export default ToggleFilters;
