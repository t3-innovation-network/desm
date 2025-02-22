import { useContext, useEffect } from 'react';
import { useLocalStore } from 'easy-peasy';
import TopNav from '../shared/TopNav';
import Loader from '../shared/Loader';
import AlertNotice from '../shared/AlertNotice';
import TopNavOptions from '../shared/TopNavOptions';
import TermCard from './TermCard';
import DomainCard from './DomainCard';
import EditTerm from './EditTerm';
import Draggable from '../shared/Draggable';
import { DraggableItemTypes } from '../shared/DraggableItemTypes';
import Pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../contexts/AppContext';
import { mappingToDomainsStore } from './stores/mappingToDomainsStore';
import { pageRoutes } from '../../services/pageRoutes';

const MappingToDomains = (props) => {
  const { organization } = useContext(AppContext);
  const [state, actions] = useLocalStore(() =>
    mappingToDomainsStore({ mapping: { id: props.match.params.id || null } })
  );
  const {
    editingTerm,
    changesPerformed,
    savingChanges,
    hideMapped,
    domain,
    mapping,
    terms,
    termToEdit,
    termsInputValue,
  } = state;

  // Action to perform after a term is dropped
  const afterDropTerm = (_spineTerm, items) => actions.afterDropTerm({ items });
  // If term is mapped
  const termIsMapped = (term) => term.mapped;
  // Manage to change values from inputs in the state
  const filterTermsOnChange = (event) => actions.setTermsInputValue(event.target.value);
  // Revert mapping
  const handleRevertMapping = (termId) => actions.handleRevertMapping({ termId });
  // Save changes
  const handleSaveChanges = () => actions.handleSaveChanges();
  // Domain mappping complete
  const handleDoneDomainMapping = async () => {
    const result = await actions.handleDoneDomainMapping();
    if (result) {
      // Redirect to 3rd step mapping ("Align and Fine Tune")
      props.history.push(pageRoutes.mappingInProgress(mapping.id));
    }
  };
  // Toggle select all
  const toggleSelectAll = () => actions.toggleSelectAll({ selected: !state.selectedTerms.length });

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchDataFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    actions.fetchDataFromAPI({ mappingId: props.match.params.id });
  }, []);

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return (
      <TopNavOptions
        viewMappings={true}
        mapSpecification={true}
        stepper={true}
        stepperStep={2}
        mapping={state.mapping}
        customcontent={<SaveButtonOptions />}
      />
    );
  };

  /**
   * Button to accept the mapping, create the mapping terms and go to the next screen
   */
  const DoneDomainMapping = () => {
    return (
      <button
        className="btn bg-col-primary col-background"
        onClick={handleDoneDomainMapping}
        disabled={!state.mappedTerms.length}
      >
        Done Domain Mapping
      </button>
    );
  };

  /**
   * Options to show on the topbar
   */
  const SaveButtonOptions = () => {
    return (
      <>
        <DoneDomainMapping />
        <button
          className="btn btn-dark ms-3"
          onClick={handleSaveChanges}
          disabled={!changesPerformed || savingChanges}
        >
          {savingChanges ? <Loader noPadding={true} smallSpinner={true} /> : 'Save Changes'}
        </button>
      </>
    );
  };

  const filteredTermsFor = (terms) => {
    if (!hideMapped) return terms;
    return terms.filter((term) => !term.mapped);
  };

  const renderTermCard = (term) => (
    <TermCard
      key={term.id}
      term={term}
      onClick={actions.onTermClick}
      isMapped={termIsMapped}
      editEnabled={true}
      onEditClick={actions.onEditTermClick}
      onRevertMapping={handleRevertMapping}
      compactDomains={mapping.compactDomains}
    />
  );

  return (
    <>
      <EditTerm
        modalIsOpen={editingTerm}
        onRequestClose={() => actions.setEditingTerm(false)}
        onRemoveTerm={actions.onRemoveTerm}
        onUpdateTerm={actions.onUpdateTerm}
        termId={termToEdit.id}
      />
      <TopNav centerContent={navCenterOptions} />
      <div className="container-fluid d-flex flex-column h-100 desm-content">
        {state.hasErrors ? (
          <AlertNotice message={state.errors} onClose={actions.clearErrors} />
        ) : null}
        <div className="row overflow-auto">
          {state.loading ? (
            <Loader />
          ) : (
            <>
              {/* LEFT SIDE */}
              <div className="col-lg-7 col-6 mh-100 p-lg-5 pt-5" style={{ overflowY: 'scroll' }}>
                <div className="border-bottom">
                  <h6 className="subtitle">2. Add the properties to the proper domain</h6>
                  <h1>Mapping {mapping.name}</h1>
                  <div className="row">
                    <div className="col-5">
                      <p>
                        <strong>{state.mappedTerms.length}</strong>
                        {' of ' +
                          terms.length +
                          ' ' +
                          Pluralize('property', terms.length) +
                          ' added to domains'}
                      </p>
                    </div>
                    <div className="col-7">
                      <div className="progress terms-progress">
                        <div
                          className="progress-bar bg-col-on-primary"
                          role="progressbar"
                          style={{
                            width: (state.mappedTerms.length * 100) / terms.length + '%',
                          }}
                          aria-valuenow="0"
                          aria-valuemin="0"
                          aria-valuemax={terms.length}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  {/* DOMAINS */}
                  <DomainCard
                    domain={domain}
                    mappedTerms={state.mappedTerms}
                    selectedTermsCount={state.selectedTerms.length}
                    onRevertMapping={handleRevertMapping}
                  />
                </div>
                <div className="mt-2">
                  <SaveButtonOptions />
                </div>
              </div>

              {/* RIGHT SIDE */}

              <div
                className="bg-col-secondary col-lg-5 col-6 mh-100 p-lg-5 pt-5"
                style={{ overflowY: 'scroll' }}
              >
                <div className="row">
                  <div className="col-6">
                    <h6 className="subtitle">{organization.name}</h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 form-group input-group-has-icon position-relative">
                    <FontAwesomeIcon icon={faSearch} className="form-control-feedback" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Find Element / Property"
                      value={termsInputValue}
                      onChange={filterTermsOnChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <strong>{state.selectedTerms.length}</strong>{' '}
                    {' ' + Pluralize('property', state.selectedTerms.length) + ' selected'}
                    <button className="btn btn-link py-0" onClick={toggleSelectAll}>
                      {state.selectedTerms.length ? 'Deselect' : 'Select'} All
                    </button>
                  </div>
                  <div className="col-6">
                    <div className="form-check float-end">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={hideMapped}
                        onChange={(_e) => actions.setHideMapped(!hideMapped)}
                        id="hideElems"
                      />
                      <label className="form-check-label" htmlFor="hideElems">
                        Hide mapped properties
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <AlertNotice
                    cssClass="bg-col-primary col-background"
                    title={
                      terms.length +
                      ' ' +
                      Pluralize('property', terms.length) +
                      ' have been uploaded'
                    }
                    message="Now you can drag and drop them to the matching domain on the left individually or click on several/select all and drag them as a group to begin maping your specification."
                  />

                  <>
                    {/* SELECTED TERMS */}

                    <Draggable
                      items={state.selectedTerms}
                      itemType={DraggableItemTypes.PROPERTIES_SET}
                      afterDrop={afterDropTerm}
                    >
                      {filteredTermsFor(state.filteredSelectedTerms).map((term) =>
                        renderTermCard(term)
                      )}
                    </Draggable>

                    {/* NOT SELECTED TERMS */}
                    {filteredTermsFor(state.filteredNotSelectedTerms).map((term) => (
                      <Draggable
                        key={term.id}
                        items={[term]}
                        itemType={DraggableItemTypes.PROPERTIES_SET}
                        afterDrop={afterDropTerm}
                      >
                        {renderTermCard(term)}
                      </Draggable>
                    ))}
                    {/* END NOT SELECTED TERMS */}
                  </>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MappingToDomains;
