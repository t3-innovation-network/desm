import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { i18n } from 'utils/i18n';

const SearchBar = ({ search, updateSearch }) => {
  return (
    <div className="row mt-4 justify-content-end">
      <div className="col-3">
        <hr className="bottom-border-white" />
        <div className="form-group input-group-has-icon">
          <FontAwesomeIcon icon={faSearch} className="form-control-feedback" />
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder={i18n.t('ui.dashboard.agents.filters.search')}
            onChange={(e) => updateSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
