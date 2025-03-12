import Offcanvas from 'react-bootstrap/Offcanvas';
import PropertyMappingsFilter from './PropertyMappingsFilter';
import SearchBarActions from './SearchBarActions';
import NotificationDot from '../shared/NotificationDot';

const BottomNav = (props) => {
  const [state, actions] = props.store;
  const { showExport, showInfo, showSearch, showFilters } = state;
  const onCloseSearch = () => actions.setShowSearch(false);
  return (
    <nav className="desm-bottom-nav navbar sticky-bottom border-top border-bottom border-dark-subtle bg-white p-0">
      <div className="d-flex h-100 justify-content-between w-100">
        <div>
          <button
            className="desm-nav-button btn btn-light border-dark-subtle border-end rounded-0"
            disabled={!state.isSearchEnabled}
            onClick={() => actions.setShowSearch(!showSearch)}
          >
            <span className="desm-icon fs-3">search</span>
            <NotificationDot show={state.withSearchInput} type="search" />
          </button>
          <button
            className="desm-nav-button btn btn-light border-dark-subtle border-end rounded-0"
            disabled={!state.isFiltersEnabled}
            onClick={() => actions.setShowFilters(!showFilters)}
          >
            <span className="desm-icon desm-icon--fill fs-3">filter_alt</span>
            <NotificationDot show={state.withFilters} />
          </button>
        </div>
        <div>
          <button
            className="desm-nav-button btn btn-light border-dark-subtle border-start rounded-0"
            disabled={!state.isInfoEnabled}
            onClick={() => actions.setShowInfo(!showInfo)}
          >
            <span className="desm-icon fs-3">info</span>
          </button>
          <button
            className="desm-nav-button btn btn-light border-dark-subtle border-start rounded-0"
            disabled={!state.isExportEnabled}
            onClick={() => actions.setShowExport(!showExport)}
          >
            <span className="desm-icon fs-3">download</span>
          </button>
        </div>
      </div>
      <Offcanvas
        placement="start"
        show={showSearch}
        onHide={onCloseSearch}
        aria-labelledby="Search"
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <SearchBarActions
            onHide={onCloseSearch}
            onAlignmentOrderChange={actions.setSelectedAlignmentOrderOption}
            onHideSpineTermsWithNoAlignmentsChange={actions.setHideSpineTermsWithNoAlignments}
            onSpineOrderChange={actions.setSelectedSpineOrderOption}
            onType={actions.setPropertiesInputValue}
            propertiesInputValue={state.propertiesInputValue}
            hideSpineTermsWithNoAlignments={state.hideSpineTermsWithNoAlignments}
            selectedAlignmentOrderOption={state.selectedAlignmentOrderOption}
            selectedSpineOrderOption={state.selectedSpineOrderOption}
          />
        </Offcanvas.Body>
      </Offcanvas>
      <Offcanvas
        placement="start"
        show={showFilters}
        onHide={() => actions.setShowFilters(false)}
        aria-labelledby="Filters"
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <PropertyMappingsFilter
            specifications={state.specifications}
            onAlignmentSpecificationSelected={actions.setSelectedAlignmentSpecifications}
            onPredicateSelected={actions.setSelectedPredicates}
            predicates={state.predicates}
            selectedAlignmentOrderOption={state.selectedAlignmentOrderOption}
            selectedAlignmentSpecifications={state.selectedAlignmentSpecifications}
            selectedDomain={state.selectedDomain}
            selectedPredicates={state.selectedPredicates}
            selectedSpineOrderOption={state.selectedSpineOrderOption}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </nav>
  );
};

export default BottomNav;
