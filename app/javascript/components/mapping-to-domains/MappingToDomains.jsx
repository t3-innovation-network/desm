import React, { Fragment, useContext, useEffect, useState } from 'react';
import TopNav from '../shared/TopNav';
import Loader from '../shared/Loader';
import fetchMapping from '../../services/fetchMapping';
import { useSelector } from 'react-redux';
import AlertNotice from '../shared/AlertNotice';
import TopNavOptions from '../shared/TopNavOptions';
import TermCard from './TermCard';
import DomainCard from './DomainCard';
import EditTerm from './EditTerm';
import fetchSpecification from '../../services/fetchSpecification';
import fetchSpecificationTerms from '../../services/fetchSpecificationTerms';
import updateMappingSelectedTerms from '../../services/updateMappingSelectedTerms';
import { toastr as toast } from 'react-redux-toastr';
import updateMapping from '../../services/updateMapping';
import Draggable from '../shared/Draggable';
import { DraggableItemTypes } from '../shared/DraggableItemTypes';
import deleteMappingSelectedTerm from '../../services/deleteMappingSelectedTerm';
import Pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../contexts/AppContext';

const MappingToDomains = (props) => {
  const { organization } = useContext(AppContext);

  /**
   * Representation of an error on this page process
   */
  const [errors, setErrors] = useState([]);

  /**
   * Declare and have an initial state for the mapping
   */
  const [mapping, setMapping] = useState({});

  /**
   * Declare and have an initial state for the mapping
   */
  const [domain, setDomain] = useState({});

  /**
   * The specification terms list
   */
  const [terms, setTerms] = useState([]);

  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);

  /**
   * Whether we are saving changes to the mapping
   */
  const [savingChanges, setSavingChanges] = useState(false);

  /**
   * Whether any change awas performed after the page loads
   */
  const [changesPerformed, setChangesPerformed] = useState(0);

  /**
   * Whether to hide mapped terms or not
   */
  const [hideMapped, setHideMapped] = useState(false);

  /**
   * Whether we are editing a term or not. Useful to show/hide the
   * modal window to edit a term
   */
  const [editingTerm, setEditingTerm] = useState(false);

  /**
   * The term to be edited. Active when the user clicks the pencil
   * icon on a term
   */
  const [termToEdit, setTermToEdit] = useState({ property: {} });

  /**
   * The logged in user
   */
  const user = useSelector((state) => state.user);

  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of terms
   */
  const [termsInputValue, setTermsInputValue] = useState('');

  /**
   * The selected or not selected terms that includes the string typed by the user in the
   * search box.
   */
  const filteredTerms = (options = { pickSelected: false }) =>
    terms
      .filter((term) => {
        return (
          (options.pickSelected ? term.selected : !term.selected) &&
          term.name.toLowerCase().includes(termsInputValue.toLowerCase())
        );
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));

  /**
   * The already mapped terms. To use in progress bar.
   */
  const mappedTerms = terms.filter(termIsMapped);

  /**
   * Returns wether the term is already mapped to the domain. It can be 1 of 2 options:
   *
   * 1. The term is recently dragged to the domain, so it's not in the backend, just
   *    marked in memory as "mapped".
   * 2. The term is already mapped in the backend (is one of the mapping selected terms in DB).
   */
  function termIsMapped(term) {
    return (
      term.mapped ||
      mapping.selected_terms.some((selectedTerm) => {
        return selectedTerm.id === term.id;
      })
    );
  }

  /**
   * The selected terms.
   */
  const selectedTerms = terms.filter((t) => t.selected);

  /**
   * Action to perform after a term is dropped
   */
  const afterDropTerm = () => {
    /// Mark the terms as not selected and mapped
    let tempTerms = selectedTerms;
    tempTerms.forEach((termToMap) => {
      termToMap.mapped = true;
      termToMap.selected = !termToMap.selected;
    });

    /// Count the amont of changes
    setChangesPerformed(changesPerformed + tempTerms.length);

    /// Refresh the UI
    setTerms([...terms]);
  };

  /**
   * Handles to view the modal window that allows to edit a term
   *
   * @param {Object} term
   */
  const onEditTermClick = (term) => {
    setEditingTerm(true);
    setTermToEdit(term);
  };

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
        customcontent={<SaveButtonOptions />}
      />
    );
  };

  /**
   * Actions on term removed. The term was removed using another component,
   * so in this one, it's still visible, we need to change that to also
   * don't show it.
   *
   * @param {Object} removedTerm
   */
  const termRemoved = (removedTerm) => {
    const tempTerms = terms.filter((term) => term.id !== removedTerm.id);
    setTerms(tempTerms);
  };

  /**
   * Manage to change values from inputs in the state
   *
   * @param {Event} event
   */
  const filterTermsOnChange = (event) => {
    setTermsInputValue(event.target.value);
  };

  /**
   * Mark the term as "selected"
   */
  const onTermClick = (clickedTerm) => {
    if (!clickedTerm.mapped) {
      let tempTerms = [...terms];
      let term = tempTerms.find((t) => t.id == clickedTerm.id);
      term.selected = clickedTerm.selected;

      setTerms(tempTerms);
    }
  };

  /**
   * Mark the term as "selectable" again. Remove it from the "mapped terms".
   *
   * @param {Object} term
   */
  const handleRevertMapping = async (termId) => {
    let tempTerms = [...terms];
    let term = tempTerms.find((t) => t.id == termId);

    /// Revert the mapping without interact with the API.
    if (term.mapped) {
      term.mapped = false;
      setTerms(tempTerms);
      setChangesPerformed(changesPerformed - 1);
      return;
    }

    /// Update through the api service
    let response = await deleteMappingSelectedTerm({
      mappingId: mapping.id,
      termId: termId,
    });

    /// Handle errors
    if (response.error) {
      toast.error(response.error);
      return;
    }

    /// Update the mapping selected terms
    let tempMapping = mapping;
    tempMapping.selected_terms = tempMapping.selected_terms.filter((term) => term.id !== termId);

    /// Update the UI
    setMapping(tempMapping);
    setTerms([...terms]);

    toast.success('Changes saved');
  };

  /**
   * Button to accept the mapping, create the mapping terms and go to the next screen
   */
  const DoneDomainMapping = () => {
    return (
      <button
        className="btn bg-col-primary col-background"
        onClick={handleDoneDomainMapping}
        disabled={!mappedTerms.length}
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
      <Fragment>
        <DoneDomainMapping />
        <button
          className="btn btn-dark ml-3"
          onClick={handleSaveChanges}
          disabled={!changesPerformed || savingChanges}
        >
          {savingChanges ? <Loader noPadding={true} smallSpinner={true} /> : 'Save Changes'}
        </button>
      </Fragment>
    );
  };

  /**
   * Comain mappping complete. Confirm to save status in the backend
   */
  const handleDoneDomainMapping = async () => {
    // Change the mapping satus to "in_progress" (with underscore, because it's
    // the name in the backend), so we say it's begun terms mapping phase
    let response = await updateMapping({
      id: mapping.id,
      status: 'in_progress',
    });
    if (!anyError(response)) {
      // Save changes if necessary
      if (changesPerformed) {
        await handleSaveChanges();
      }
      // Redirect to 3rd step mapping ("Align and Fine Tune")
      props.history.push('/mappings/' + mapping.id + '/align');
    }
  };

  /**
   * Create the mapping terms
   */
  const handleSaveChanges = async () => {
    setSavingChanges(true);

    const response = await updateMappingSelectedTerms({
      mappingId: mapping.id,
      termIds: mappedTerms.map((t) => t.id),
    });

    if (!anyError(response)) {
      // Mark the terms marked as mapped in memory not mapped, since we already know it's part of the selected terms now
      terms
        .filter((t) => t.mapped)
        .forEach((term) => {
          term.mapped = false;
          let tempMapping = mapping;
          tempMapping.selected_terms.push(term);
          setMapping(tempMapping);
        });

      toast.success('Changes saved');
      setChangesPerformed(0);
      setSavingChanges(false);
    }
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  function anyError(response) {
    if (response.error) {
      setErrors([...errors, response.error]);
    }
    /// It will return a truthy value (depending no the existence
    /// of the errors on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Get the mapping
   */
  const handleFetchMapping = async (mapping_id) => {
    let response = await fetchMapping(mapping_id);
    if (!anyError(response)) {
      // Set the mapping on state
      setMapping(response.mapping);
    }
    return response;
  };

  /**
   * Get the specification
   */
  const handleFetchSpecification = async (spec_id) => {
    let response = await fetchSpecification(spec_id);
    if (!anyError(response)) {
      // Set the domain on state
      setDomain(response.specification.domain);
    }
  };

  /**
   * Get the specification terms
   */
  const handleFetchSpecificationTerms = async (spec_id) => {
    let response = await fetchSpecificationTerms(spec_id);
    if (!anyError(response)) {
      // Set the spine terms on state
      setTerms(response.terms);
    }
  };

  /**
   * Get the data from the service
   */
  const fetchDataFromAPI = async () => {
    // Get the mapping
    let response = await handleFetchMapping(props.match.params.id);

    // Get the specification
    await handleFetchSpecification(response.mapping.specification_id);

    // Get the terms
    await handleFetchSpecificationTerms(response.mapping.specification_id);
  };

  const toggleSelectAll = () => {
    const selected = !selectedTerms.length;
    setTerms((terms) => terms.map((t) => Object.assign(t, { selected })));
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchDataFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    let fn;
    if (loading) {
      fn = async function fetchData() {
        await fetchDataFromAPI();
      };
      fn().then(() => {
        if (_.isEmpty(errors)) {
          setLoading(false);
        }
      });
    }
  }, []);

  return (
    <React.Fragment>
      <EditTerm
        modalIsOpen={editingTerm}
        onRequestClose={() => {
          setEditingTerm(false);
        }}
        onRemoveTerm={termRemoved}
        termId={termToEdit.id}
      />
      <div className="container-fluid d-flex flex-column h-100">
        <TopNav centerContent={navCenterOptions} />
        {errors.length ? <AlertNotice message={errors} onClose={() => setErrors([])} /> : ''}
        <div className="row overflow-auto">
          {loading ? (
            <Loader />
          ) : (
            <React.Fragment>
              {/* LEFT SIDE */}

              <div className="col-lg-6 mh-100 p-lg-5 pt-5" style={{ overflowY: 'scroll' }}>
                <div className="border-bottom">
                  <h6 className="subtitle">2. Add the properties to the proper domain</h6>
                  <h1>Mapping {mapping.name}</h1>
                  <div className="row">
                    <div className="col-5">
                      <p>
                        <strong>{mappedTerms.length}</strong>
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
                            width: (mappedTerms.length * 100) / terms.length + '%',
                          }}
                          aria-valuenow="0"
                          aria-valuemin="0"
                          aria-valuemax={terms.length}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  {/* DOMAINS */}
                  {!loading && (
                    <DomainCard
                      domain={domain}
                      mappedTerms={mappedTerms}
                      selectedTermsCount={selectedTerms.length}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <SaveButtonOptions />
                </div>
              </div>

              {/* RIGHT SIDE */}

              <div
                className="bg-col-secondary col-lg-6 mh-100 p-lg-5 pt-5"
                style={{ overflowY: 'scroll' }}
              >
                <div className="row">
                  <div className="col-6">
                    <h6 className="subtitle">{organization.name}</h6>
                  </div>
                  <div className="col-6">
                    <div className="form-check float-right">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={hideMapped}
                        onChange={(e) => setHideMapped(!hideMapped)}
                        id="hideElems"
                      />
                      <label className="form-check-label" htmlFor="hideElems">
                        Hide mapped properties
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 form-group input-group-has-icon">
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

                <p>
                  <strong>{selectedTerms.length}</strong>{' '}
                  {' ' + Pluralize('property', selectedTerms.length) + ' selected'}
                  <button className="btn btn-link" onClick={toggleSelectAll}>
                    {selectedTerms.length ? 'Deselect' : 'Select'} All
                  </button>
                </p>

                <div className="mt-5">
                  <AlertNotice
                    cssClass="bg-col-primary col-background"
                    title={
                      terms.length +
                      ' ' +
                      Pluralize('property', terms.length) +
                      ' have been uploaded'
                    }
                    message="Drag the individual properties below to the matching domains on the left to begin mapping your specification"
                  />

                  <Fragment>
                    {/* SELECTED TERMS */}

                    <Draggable
                      items={selectedTerms}
                      itemType={DraggableItemTypes.PROPERTIES_SET}
                      afterDrop={afterDropTerm}
                    >
                      {filteredTerms({ pickSelected: true }).map((term) => {
                        return hideMapped && termIsMapped(term) ? (
                          ''
                        ) : (
                          <TermCard
                            key={term.id}
                            term={term}
                            onClick={onTermClick}
                            isMapped={termIsMapped}
                            editEnabled={true}
                            onEditClick={onEditTermClick}
                          />
                        );
                      })}
                    </Draggable>

                    {/* NOT SELECTED TERMS */}
                    {filteredTerms({ pickSelected: false }).map((term) => {
                      return hideMapped && termIsMapped(term) ? (
                        ''
                      ) : (
                        <TermCard
                          key={term.id}
                          term={term}
                          onClick={onTermClick}
                          isMapped={termIsMapped}
                          editEnabled={true}
                          onEditClick={onEditTermClick}
                          onRevertMapping={handleRevertMapping}
                        />
                      );
                    })}
                    {/* END NOT SELECTED TERMS */}
                  </Fragment>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default MappingToDomains;
