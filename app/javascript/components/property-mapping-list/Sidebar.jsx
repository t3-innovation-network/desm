import classNames from 'classnames';
import PropertyMappingsFilter from './PropertyMappingsFilter';
import SearchBar from './SearchBar';
import NotificationDot from '../shared/NotificationDot';
import InfoExportButtons from './InfoExportButtons';

const Sidebar = (props) => {
  const [state, actions] = props.store;
  const {
    hideSpineTermsWithNoAlignments,
    predicates,
    propertiesInputValue,
    sidebarCollapsed,
    selectedAlignmentOrderOption,
    selectedAlignmentSpecifications,
    selectedDomain,
    selectedPredicates,
    selectedSpineOrderOption,
    specifications,
  } = state;
  const clsSidebar = classNames('desm-sidebar border-dark-subtle border-end', {
    'desm-sidebar--collapsed': sidebarCollapsed,
    'desm-sidebar--expanded': !sidebarCollapsed,
  });
  const clsToggle = classNames('desm-sidebar-toggle btn btn-light border-dark-subtle border p-0', {
    'desm-sidebar-toggle--collapsed': sidebarCollapsed,
    'desm-sidebar-toggle--expanded': !sidebarCollapsed,
  });

  return (
    <div className={clsSidebar} role="complementary">
      <div className={clsToggle} onClick={actions.toggleSidebar} role="button">
        <span className="desm-sidebar-toggle__icon desm-icon">chevron_right</span>
      </div>
      {sidebarCollapsed ? (
        <div className="d-grip gap-2 text-center">
          <div
            className="border-bottom border-dark-subtle py-3 cursor-pointer link-opacity-75-hover"
            onClick={actions.toggleSidebar}
            role="button"
          >
            <span className="desm-icon fs-3">search</span>
            <NotificationDot show={state.withSearchInput} type="search" />
          </div>
          <div
            className="border-bottom border-dark-subtle py-3 cursor-pointer link-opacity-75-hover"
            onClick={actions.toggleSidebar}
            role="button"
          >
            <span className="desm-icon desm-icon--fill fs-3">filter_alt</span>
            <NotificationDot show={state.withFilters} />
          </div>
          <div
            className="border-bottom border-dark-subtle py-3 cursor-pointer link-opacity-75-hover"
            disabled={!state.isInfoEnabled}
            onClick={() => actions.setShowInfo(!state.showInfo)}
            role="button"
          >
            <span className="desm-icon fs-3">info</span>
          </div>
          <div
            className="border-bottom border-dark-subtle py-3 cursor-pointer link-opacity-75-hover"
            disabled={!state.isExportEnabled}
            onClick={() => actions.setShowExport(!state.showExport)}
            role="button"
          >
            <span className="desm-icon fs-3">download</span>
          </div>
        </div>
      ) : (
        <div className="h-100 overflow-x-hidden overflow-y-auto">
          <InfoExportButtons
            store={props.store}
            cls="justify-content-center py-4 border-bottom border-dark-subtle"
          />
          <div className="py-4 px-2 border-bottom border-dark-subtle">
            <SearchBar
              onAlignmentOrderChange={actions.setSelectedAlignmentOrderOption}
              onHideSpineTermsWithNoAlignmentsChange={actions.setHideSpineTermsWithNoAlignments}
              onSpineOrderChange={actions.setSelectedSpineOrderOption}
              onType={actions.setPropertiesInputValue}
              propertiesInputValue={propertiesInputValue}
              hideSpineTermsWithNoAlignments={hideSpineTermsWithNoAlignments}
              selectedAlignmentOrderOption={selectedAlignmentOrderOption}
              selectedSpineOrderOption={selectedSpineOrderOption}
            />
          </div>
          <div className="py-4 px-2">
            <PropertyMappingsFilter
              specifications={specifications}
              onAlignmentSpecificationSelected={actions.setSelectedAlignmentSpecifications}
              onPredicateSelected={actions.setSelectedPredicates}
              predicates={predicates}
              selectedAlignmentOrderOption={selectedAlignmentOrderOption}
              selectedAlignmentSpecifications={selectedAlignmentSpecifications}
              selectedDomain={selectedDomain}
              selectedPredicates={selectedPredicates}
              selectedSpineOrderOption={selectedSpineOrderOption}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
