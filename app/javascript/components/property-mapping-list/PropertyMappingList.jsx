import { useEffect, useState } from 'react';
import { useLocalStore } from 'easy-peasy';
import Offcanvas from 'react-bootstrap/Offcanvas';
import AlertNotice from '../shared/AlertNotice';
import Loader from '../shared/Loader';
import TopNav from '../shared/TopNav';
import TopNavOptions from '../shared/TopNavOptions';
import DesmTabs from '../shared/DesmTabs';
import PropertiesList from './PropertiesList';
import Sidebar from './Sidebar';
import ConfigurationProfileSelect from '../shared/ConfigurationProfileSelect';
import { i18n } from 'utils/i18n';
import { propertyMappingListStore } from './stores/propertyMappingListStore';
import { camelizeLocationSearch, updateWithRouter } from 'helpers/queryString';
import { isEmpty } from 'lodash';
import ExportMappings from '../shared/ExportMappings';
import { TabletAndBelow, Desktop } from '../../utils/mediaQuery';
import classNames from 'classnames';

const PropertyMappingList = (props) => {
  const store = useLocalStore(() => {
    const { cp, abstractClass } = camelizeLocationSearch(props);
    return propertyMappingListStore({ cp, abstractClass });
  });
  const [state, actions] = store;
  const {
    configurationProfile,
    domains,
    specifications,
    predicates,
    selectedDomain,
    hideSpineTermsWithNoAlignments,
    propertiesInputValue,
    sidebarCollapsed,
    selectedAlignmentOrderOption,
    selectedAlignmentSpecifications,
    selectedPredicates,
    selectedSpineOrderOption,
    selectedSpineSpecifications,
  } = state;
  const [showInfo, setShowInfo] = useState(false);
  const [showExport, setShowExport] = useState(false);
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
    updateQueryString({ abstractClass: selectedAbstractClass?.name });
  };

  useEffect(() => loadData(), [configurationProfile]);
  useEffect(() => handleSelectedData(), [domains]);
  useEffect(() => loadSpecifications(), [configurationProfile, selectedDomain]);

  const updateSelectedDomain = (id) => {
    const selectedDomain = domains.find((domain) => domain.id == id);
    actions.updateSelectedDomain(selectedDomain);
    updateQueryString({ abstractClass: selectedDomain.name });
  };

  const updateSelectedConfigurationProfile = (configurationProfile) => {
    actions.updateSelectedConfigurationProfile(configurationProfile);
    if (configurationProfile) {
      updateQueryString({ cp: configurationProfile.id });
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

  const clsMainContent = classNames('w-auto desm-content', {
    'desm-content--collapsed': sidebarCollapsed && configurationProfile?.withSharedMappings,
    'desm-content--expanded': !sidebarCollapsed && configurationProfile?.withSharedMappings,
  });

  return (
    <>
      <TopNav centerContent={navCenterOptions} />

      <Desktop>
        {configurationProfile?.withSharedMappings ? <Sidebar store={store} /> : null}
      </Desktop>
      <div className={clsMainContent}>
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
              >
                {configurationProfile ? (
                  <div className="col-auto d-flex gap-2">
                    <button
                      className="btn btn-light border-dark-subtle border pb-0"
                      disabled={
                        !configurationProfile?.withSharedMappings ||
                        !selectedDomain ||
                        state.loading
                      }
                      onClick={() => setShowInfo(!showInfo)}
                    >
                      <span className="desm-icon fs-3">info</span>
                    </button>
                    <button
                      className="btn btn-light border-dark-subtle border pb-0"
                      disabled={!configurationProfile?.withSharedMappings || state.loading}
                      onClick={() => setShowExport(!showExport)}
                    >
                      <span className="desm-icon fs-3">download</span>
                    </button>
                  </div>
                ) : null}
              </ConfigurationProfileSelect>
              <Offcanvas
                placement="start"
                show={showExport}
                onHide={() => setShowExport(false)}
                aria-labelledby="Info"
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
          (state.loading ? (
            <Loader />
          ) : (
            <>
              <div className="container-fluid border-top border-bottom border-dark-subtle py-3 position-sticky desm-tabs bg-white z-3">
                <DesmTabs
                  onTabClick={(id) => updateSelectedDomain(id)}
                  selectedId={selectedDomain?.id}
                  values={domains}
                />
              </div>
              {selectedDomain && (
                <div className="container-fluid py-3">
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
                    selectedSpineSpecifications={selectedSpineSpecifications}
                    showInfo={showInfo}
                    setShowInfo={setShowInfo}
                  />
                </div>
              )}
            </>
          ))}
      </div>
      <TabletAndBelow>
        <nav className="navbar sticky-bottom bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Fixed bottom
            </a>
          </div>
        </nav>
      </TabletAndBelow>
    </>
  );
};

export default PropertyMappingList;
