import { useEffect } from 'react';
import { useLocalStore } from 'easy-peasy';
import Offcanvas from 'react-bootstrap/Offcanvas';
import AlertNotice from '../shared/AlertNotice';
import Loader from '../shared/Loader';
import TopNav from '../shared/TopNav';
import TopNavOptions from '../shared/TopNavOptions';
import DesmTabs from '../shared/DesmTabs';
import BottomNav from './BottomNav';
import PropertiesList, { buildPropertyCardId } from './PropertiesList';
import Sidebar from './Sidebar';
import ConfigurationProfileSelect from '../shared/ConfigurationProfileSelect';
import { i18n } from '../../utils/i18n';
import { propertyMappingListStore } from './stores/propertyMappingListStore';
import { camelizeLocationSearch, updateWithRouter } from '../../helpers/queryString';
import { isEmpty } from 'lodash';
import ExportMappings from '../shared/ExportMappings';
import { TabletAndBelow, Desktop } from '../../utils/mediaQuery';
import classNames from 'classnames';
import { scrollToElement } from '../../utils/scrollToElement';

const PropertyMappingList = (props) => {
  const store = useLocalStore(() => {
    const { cp, abstractClass } = camelizeLocationSearch(props);
    return propertyMappingListStore({ cp, abstractClass });
  });
  const { hash } = props.location;
  const [state, actions] = store;
  const {
    configurationProfile,
    domains,
    specifications,
    predicates,
    selectedDomain,
    hideSpineTermsWithNoAlignments,
    propertiesInputValue,
    propertyIds,
    sidebarCollapsed,
    selectedAlignmentOrderOption,
    selectedAlignmentSpecifications,
    selectedPredicates,
    selectedSpineOrderOption,
    showInfo,
    showExport,
  } = state;
  const updateQueryString = updateWithRouter(props);

  const navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  const handleSelectedData = () => {
    if (isEmpty(domains)) return;

    let selectedAbstractClass = state.abstractClass
      ? domains.find((d) => d.name.toLowerCase() == state.abstractClass.toLowerCase())
      : domains[0];
    selectedAbstractClass ||= domains[0];
    actions.setSelectedDomain(selectedAbstractClass);
    updateQueryString(
      { abstractClass: selectedAbstractClass?.name },
      { replace: !state.abstractClass }
    );
  };

  useEffect(() => {
    loadData();
  }, [configurationProfile?.id]);
  useEffect(() => {
    handleSelectedData();
  }, [domains]);
  useEffect(() => {
    loadSpecifications();
  }, [configurationProfile?.id, selectedDomain]);
  useEffect(() => {
    // TODO: need to handle configurationProfile change too
    const { abstractClass } = camelizeLocationSearch(props);
    if (
      abstractClass &&
      selectedDomain &&
      abstractClass.toLowerCase() !== selectedDomain.name.toLowerCase()
    ) {
      const selectedAbstractClass = domains.find(
        (d) => d.name.toLowerCase() == abstractClass.toLowerCase()
      );
      if (selectedAbstractClass) actions.setSelectedDomain(selectedAbstractClass);
    }
  }, [props.location.search]);

  useEffect(() => {
    if (propertyIds.length) {
      scrollToElement(hash, buildPropertyCardId);
    }
  }, [hash, propertyIds]);

  const updateSelectedDomain = (id) => {
    const selectedDomain = domains.find((domain) => domain.id == id);
    actions.updateSelectedDomain(selectedDomain);
    updateQueryString({ abstractClass: selectedDomain.name });
  };

  const updateSelectedConfigurationProfile = (configurationProfile) => {
    actions.updateSelectedConfigurationProfile(configurationProfile);
    if (configurationProfile) {
      updateQueryString({ cp: configurationProfile.id.toString() });
    }
  };

  const loadData = async () => {
    if (!configurationProfile) {
      return;
    }
    await actions.fetchDataFromAPI();
  };

  const loadSpecifications = async () => {
    if (!configurationProfile || !selectedDomain) {
      return;
    }

    actions.handleFetchSpecifications({
      configurationProfileId: configurationProfile.id,
      domainId: selectedDomain.id,
    });
  };

  const clsMainContent = classNames('w-auto desm-content desm-content__shared-mapping', {
    'desm-content--collapsed': sidebarCollapsed && configurationProfile?.withSharedMappings,
    'desm-content--expanded': !sidebarCollapsed && configurationProfile?.withSharedMappings,
  });

  return (
    <>
      <TopNav centerContent={navCenterOptions} />

      <Desktop>
        {configurationProfile?.withSharedMappings ? <Sidebar store={store} /> : null}
      </Desktop>
      <div className={clsMainContent} role="main">
        <div className="container-fluid">
          {state.hasErrors ? (
            <AlertNotice message={state.errors} onClose={actions.clearErrors} />
          ) : null}

          <div className="row">
            <div className="col pt-3">
              {state.withoutSharedMappings && (
                <div className="w-100">
                  <AlertNotice
                    withTitle={false}
                    message={i18n.t('ui.view_mapping.no_mappings.current_profile')}
                    cssClass="alert-warning"
                  />
                </div>
              )}
              <ConfigurationProfileSelect
                onSubmit={updateSelectedConfigurationProfile}
                requestType="indexWithSharedMappings"
                selectedConfigurationProfileId={state.selectedConfigurationProfileId(null)}
                withoutUserConfigurationProfile={true}
              />
              <Offcanvas
                placement="start"
                show={showExport}
                onHide={() => actions.setShowExport(false)}
                aria-labelledby="Export"
              >
                <Offcanvas.Header closeButton />
                <Offcanvas.Body>
                  <ExportMappings configurationProfile={configurationProfile} domains={domains} />
                </Offcanvas.Body>
              </Offcanvas>
            </div>
          </div>
        </div>
        {configurationProfile?.withSharedMappings &&
          (state.loading && !selectedDomain ? (
            <Loader />
          ) : (
            <>
              <div className="container-fluid border-top border-bottom border-dark-subtle py-3 position-sticky desm-tabs bg-white z-3">
                <DesmTabs
                  onTabClick={(id) => updateSelectedDomain(id)}
                  selectedId={selectedDomain?.id}
                  values={domains}
                  isAllTermsCollapsed={state.isAllTermsCollapsed}
                  isAllTermsExpanded={state.isAllTermsExpanded}
                  collapseAllTerms={actions.collapseAllTerms}
                  expandAllTerms={actions.expandAllTerms}
                />
              </div>
              {selectedDomain ? (
                <div className="desm-mapping-list__wrapper container-fluid py-3 ">
                  <PropertiesList
                    hideSpineTermsWithNoAlignments={hideSpineTermsWithNoAlignments}
                    inputValue={propertiesInputValue}
                    configurationProfile={configurationProfile}
                    domains={domains}
                    specifications={specifications}
                    predicates={predicates}
                    selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                    selectedAlignmentSpecifications={selectedAlignmentSpecifications}
                    selectedDomain={selectedDomain}
                    selectedPredicates={selectedPredicates}
                    selectedSpineOrderOption={selectedSpineOrderOption}
                    showInfo={showInfo}
                    setShowInfo={actions.setShowInfo}
                    collapsedTerms={state.collapsedTerms}
                    onToggleTermCollapse={actions.toggleTermCollapse}
                    onUpdateProperties={actions.setPropertyIds}
                  />
                </div>
              ) : null}
            </>
          ))}
      </div>
      <TabletAndBelow>{configurationProfile ? <BottomNav store={store} /> : null}</TabletAndBelow>
    </>
  );
};

export default PropertyMappingList;
