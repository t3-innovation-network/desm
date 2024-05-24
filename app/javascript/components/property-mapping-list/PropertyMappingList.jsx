import { useEffect, useContext } from 'react';
import { useLocalStore } from 'easy-peasy';
import AlertNotice from '../shared/AlertNotice';
import Loader from '../shared/Loader';
import TopNav from '../shared/TopNav';
import TopNavOptions from '../shared/TopNavOptions';
import DesmTabs from '../shared/DesmTabs';
import PropertiesList from './PropertiesList';
import PropertyMappingsFilter from './PropertyMappingsFilter';
import SearchBar from './SearchBar';
import queryString from 'query-string';
import ConfigurationProfileSelect from '../shared/ConfigurationProfileSelect';
import { AppContext } from '../../contexts/AppContext';
import useDidMountEffect from 'helpers/useDidMountEffect';
import { i18n } from 'utils/i18n';
import { propertyMappingListStore } from './stores/propertyMappingListStore';

const PropertyMappingList = (props) => {
  const context = useContext(AppContext);
  const [state, actions] = useLocalStore(() => propertyMappingListStore());
  const {
    domains,
    organizations,
    predicates,
    selectedDomain,
    hideSpineTermsWithNoAlignments,
    propertiesInputValue,
    selectedAlignmentOrderOption,
    selectedAlignmentOrganizations,
    selectedPredicates,
    selectedSpineOrderOption,
    selectedSpineOrganizations,
  } = state;

  const navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  const handleSelectedDomain = () => {
    var selectedAbstractClassName = queryString.parse(props.location.search).abstractClass;

    if (selectedAbstractClassName) {
      let selectedAbstractClass = state.domains.find(
        (d) => d.name.toLowerCase() == selectedAbstractClassName.toLowerCase()
      );

      if (selectedAbstractClass) {
        actions.setSelectedDomain(selectedAbstractClass);
      }
    }
  };

  useEffect(() => loadData(), [context.currentConfigurationProfile]);
  useDidMountEffect(() => handleSelectedDomain(), [domains]);

  const loadData = async () => {
    if (!context.currentConfigurationProfile) {
      return;
    }
    await actions.fetchDataFromAPI();
  };

  return (
    <div className="container-fluid">
      <TopNav centerContent={navCenterOptions} />
      {state.hasErrors ? (
        <AlertNotice message={state.errors} onClose={actions.clearErrors} />
      ) : null}

      <div className="row">
        <div className="col p-lg-5 pt-5">
          {!context.loggedIn && <ConfigurationProfileSelect />}

          {context.currentConfigurationProfile &&
            (state.loading ? (
              <Loader />
            ) : (
              <>
                <h1>
                  <strong>{context.currentConfigurationProfile.name}</strong>:{' '}
                  {i18n.t('ui.view_mapping.subtitle')}
                </h1>
                <label className="my-0">{i18n.t('ui.view_mapping.select_abstract_class')}</label>
                <DesmTabs
                  onTabClick={(id) =>
                    actions.setSelectedDomain(domains.find((domain) => domain.id == id))
                  }
                  selectedId={selectedDomain?.id}
                  values={domains}
                />
                <SearchBar
                  onAlignmentOrderChange={actions.setSelectedAlignmentOrderOption}
                  onHideSpineTermsWithNoAlignmentsChange={actions.setHideSpineTermsWithNoAlignments}
                  onSpineOrderChange={actions.setSelectedSpineOrderOption}
                  onType={actions.setPropertiesInputValue}
                  selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                  selectedSpineOrderOption={selectedSpineOrderOption}
                />

                {selectedDomain && (
                  <>
                    <PropertyMappingsFilter
                      organizations={organizations}
                      onAlignmentOrganizationSelected={actions.setSelectedAlignmentOrganizations}
                      onPredicateSelected={actions.setSelectedPredicates}
                      onSpineOrganizationSelected={actions.setSelectedSpineOrganizations}
                      predicates={predicates}
                      selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                      selectedAlignmentOrganizations={selectedAlignmentOrganizations}
                      selectedDomain={selectedDomain}
                      selectedPredicates={selectedPredicates}
                      selectedSpineOrderOption={selectedSpineOrderOption}
                      selectedSpineOrganizations={selectedSpineOrganizations}
                    />

                    <PropertiesList
                      hideSpineTermsWithNoAlignments={hideSpineTermsWithNoAlignments}
                      inputValue={propertiesInputValue}
                      domains={domains}
                      organizations={organizations}
                      predicates={predicates}
                      selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                      selectedAlignmentOrganizations={selectedAlignmentOrganizations}
                      selectedDomain={selectedDomain}
                      selectedPredicates={selectedPredicates}
                      selectedSpineOrderOption={selectedSpineOrderOption}
                      selectedSpineOrganizations={selectedSpineOrganizations}
                    />
                  </>
                )}
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyMappingList;
