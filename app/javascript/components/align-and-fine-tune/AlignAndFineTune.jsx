import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import fetchMapping from '../../services/fetchMapping';
import fetchMappingSelectedTerms from '../../services/fetchMappingSelectedTerms';
import fetchPredicates from '../../services/fetchPredicates';
import fetchSpineTerms from '../../services/fetchSpineTerms';
import TermCard from '../mapping-to-domains/TermCard';
import AlertNotice from '../shared/AlertNotice';
import Loader from '../shared/Loader';
import TopNav from '../shared/TopNav';
import TopNavOptions from '../shared/TopNavOptions';
import SpineTermRow from './SpineTermRow';
import SpineHeader from './SpineHeader';
import AlignmentsHeader from './AlignmentsHeader';
import Pluralize from 'pluralize';
import fetchAlignments from '../../services/fetchAlignments';
import deleteAlignment from '../../services/deleteAlignment';
import saveAlignments from '../../services/saveAlignments';
import { toastr as toast } from 'react-redux-toastr';
import createSpineTerm from '../../services/createSpineTerm';
import Draggable from '../shared/Draggable';
import { DraggableItemTypes } from '../shared/DraggableItemTypes';
import updateMapping from '../../services/updateMapping';
import MappingChangeLog from './mapping-changelog/MappingChangeLog';
import fetchAudits from '../../services/fetchAudits';
import ConfirmDialog from '../shared/ConfirmDialog';
import { AppContext } from '../../contexts/AppContext';

const AlignAndFineTune = (props) => {
  const { leadMapper, organization } = useContext(AppContext);

  const leftColumnRef = useRef(null);

  /**
   * Flag to control when the user is adding a synthetic property
   */
  const [addingSynthetic, setAddingSynthetic] = useState(false);
  /**
   * The terms of the mapping (The ones for the output, not visible here, but necessary
   * to configure the relation between the predicate, spine term and selected terms
   * from the specification)
   */
  const [alignments, setAlignments] = useState([]);
  /**
   * Controls the amount of changes performed after the page loads
   */
  const [changesPerformed, setChangesPerformed] = useState(0);
  /**
   * Controls displaying the removal confirmation dialog
   */
  const [confirmingRemoveAlignment, setConfirmingRemoveAlignment] = useState(false);
  /**
   * The date the mapping was marked as "mapped", which is "completed".
   */
  const [dateMapped, setDateMapped] = useState(null);
  /**
   * Representation of an error on this page process
   */
  const [errors, setErrors] = useState([]);
  /**
   * Whether to hide mapped spine terms or not
   */
  const [hideMappedSelectedTerms, setHideMappedSelectedTerms] = useState(false);
  /**
   * Whether to hide mapped mapping terms or not
   */
  const [hideMappedSpineTerms, setHideMappedSpineTerms] = useState(false);
  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);
  /**
   * Declare and have an initial state for the mapping
   */
  const [mapping, setMapping] = useState({});
  /**
   * The terms of the mapping (The selected ones from the uploaded specification)
   */
  const [mappingSelectedTerms, setMappingSelectedTerms] = useState([]);
  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of mapping terms
   */
  const [mappingSelectedTermsInputValue, setMappingSelectedTermsInputValue] = useState('');
  /**
   * Represents the alignment that's going to be removed if the user confirms that action
   */
  const [alignmentToRemove, setAlignmentToRemove] = useState(null);
  /**
   * The predicates from DB. These will be used to match a mapping term to a spine
   * term in a meaningful way. E.g. "Identical", "Aggregated", ...
   */
  const [predicates, setPredicates] = useState([]);
  /**
   * The terms of the spine (The specification being mapped against)
   */
  const [spineTerms, setSpineTerms] = useState([]);
  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of spine terms
   */
  const [spineTermsInputValue, setSpineTermsInputValue] = useState('');

  const [scrollTop, setScrollTop] = useState(0);
  /**
   * The logged in user
   */
  const user = useSelector((state) => state.user);

  /**
   * ---- FUNCTIONS ----
   */

  /**
   * The selected mapping terms (the terms of the original specification, now
   * selected to map into the spine).
   */
  const selectedAlignments = mappingSelectedTerms.filter((term) => {
    return term.selected;
  });

  const strongestMatchPredicate = predicates.find((p) => p.strongest_match);

  /**
   * Manage to change values from mapping term inputs in the state
   *
   * @param {Event} event
   */
  const filterMappingSelectedTermsOnChange = (event) => {
    setMappingSelectedTermsInputValue(event.target.value);
  };

  /**
   * Manage to change values from spine term inputs in the state
   *
   * @param {Event} event
   */
  const filterSpineTermsOnChange = (event) => {
    setSpineTermsInputValue(event.target.value);
  };

  /**
   * The already mapped terms. To use in progress bar.
   * For a term to be mapped, it can be 1 of 2 options:
   *
   * 1. The term is recently dragged to the domain, so it's not in the backend, just
   *    marked in memory as "mapped".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   *
   * @param {Object} spineTerm
   */
  const mappedTermsToSpineTerm = (spineTerm) => {
    let alignment = alignments.find((alg) => alg.spineTermId === spineTerm.id);
    return alignment ? alignment.mappedTerms : [];
  };

  /**
   * The selected or not selected terms that includes the string typed by the user in the
   * search box.
   */
  const filteredMappingSelectedTerms = (options = { pickSelected: false }) =>
    mappingSelectedTerms
      .filter((term) => {
        return (
          (options.pickSelected ? term.selected : !term.selected) &&
          term.name.toLowerCase().includes(mappingSelectedTermsInputValue.toLowerCase())
        );
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));

  /**
   * The selected or not selected terms that includes the string typed by the user in the
   * search box.
   */
  const filteredSpineTerms = _.sortBy(
    spineTerms.filter((term) => {
      return term.name.toLowerCase().includes(spineTermsInputValue.toLowerCase());
    }),
    [(t) => (t.createdAt ? 1 : 0), (t) => t.name.toLowerCase()]
  );

  /**
   * All the terms that are already mapped
   */
  const mappedSelectedTerms = mappingSelectedTerms.filter(selectedTermIsMapped);

  const completeAlignments = alignments.filter((a) => {
    const predicate = predicates.find((p) => p.id === a.predicateId);

    return (
      predicate?.source_uri?.toLowerCase()?.includes('nomatch') ||
      (a.predicateId && a.mappedTerms.length)
    );
  });

  /**
   * Returns whether all the terms from the specification are already mapped.
   * For a term to be correctly mapped, we ensure to detect the predicate for it.
   */
  const noPartiallyMappedTerms = alignments.every((a) => {
    const predicate = predicates.find((p) => p.id === a.predicateId);

    return (
      predicate?.source_uri?.toLowerCase()?.includes('nomatch') ||
      Boolean(a.mappedTerms.length) == Boolean(a.predicateId)
    );
  });

  /**
   * Returns whether the term is already mapped to the spine. It can be 1 of 2 options:
   *
   * 1. The mapping term was recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   */
  function selectedTermIsMapped(alignment) {
    return alignments.some((alg) =>
      alg.mappedTerms.some((mappedTerm) => mappedTerm.id === alignment.id)
    );
  }

  /**
   * Returns whether the spine term has any mapping terms mapped to it. It can be 1 of 2 options:
   *
   * 1. The mapping term was recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The mapping term is already mapped in the backend (is one of the mapping terms mapped in DB).
   */
  const spineTermIsMapped = (spineTerm) => {
    let alg = alignments.find((alignment) => alignment.spineTermId === spineTerm.id);
    return alg.mappedTerms.length;
  };

  /**
   * Mark the term as "selected"
   */
  const onSelectedTermClick = (clickedTerm) => {
    if (!clickedTerm.mappedTo) {
      let tempTerms = [...mappingSelectedTerms];
      let term = tempTerms.find((t) => t.id === clickedTerm.id);
      term.selected = clickedTerm.selected;

      setMappingSelectedTerms(tempTerms);
    }
  };

  /**
   * Returns the mapping term that corresponds to a specific term by its id
   * It represents the relation between a spine term, one or more selected
   * terms from the original specification and the predicate
   *
   * @param {Integer} spineTermId
   */
  const alignmentForSpineTerm = (spineTermId) =>
    alignments.find((alg) => alg.spineTermId === spineTermId);

  /**
   * Link the predicate to the corresponding mapping term
   *
   * @param {Object} spineTerm
   * @param {Object} predicate
   */
  const onPredicateSelected = (spineTerm, predicate) => {
    let tempAlignments = alignments;
    let selectedAlignment = tempAlignments.find((alg) => alg.spineTermId === spineTerm.id);
    selectedAlignment.predicateId = predicate.id;
    selectedAlignment.changed = true;

    setAlignments(tempAlignments);

    /// Warn to save changes
    setChangesPerformed(changesPerformed + 1);
  };

  /**
   * Update the name of a spine term
   *
   * @param {Integer} spineTermId
   * @param {String} name
   */
  const setSyntheticName = (spineTermId, name) => {
    let tempSpineTerms = spineTerms;
    let spineTerm = tempSpineTerms.find((sTerm) => sTerm.id === spineTermId);

    if (spineTerm.synthetic) {
      spineTerm.name = name;
      setSpineTerms(tempSpineTerms);
    }
  };

  /**
   * Action to perform after a mapping term is dropped
   */
  const afterDropTerm = (spineTerm) => {
    setLoading(true);
    /// Set the selected terms as mapped for the mapping terms dropped on
    let selectedTerms = selectedAlignments;
    let alignment = alignments.find((alg) => alg.spineTermId === spineTerm.id);
    alignment.mappedTerms = selectedTerms;
    alignment.changed = true;
    let tempAlignments = alignments;

    /// Manage synthetic name (valid only when the spine term is synthetic)
    let [firstSelectedTerm] = selectedTerms;
    setSyntheticName(spineTerm.id, firstSelectedTerm.name);

    /// Deselect terms
    selectedTerms.forEach((term) => (term.selected = !term.selected));

    /// Redraw the mapping selected terms
    setMappingSelectedTerms([...mappingSelectedTerms]);

    /// Redraw the mapped terms
    setAlignments(tempAlignments);

    /// Warn to save changes
    setChangesPerformed(changesPerformed + 1);
    setLoading(false);

    leftColumnRef.current?.scroll(0, scrollTop);
  };

  /**
   * Manages to use the API service to remove an alignment
   */
  const handleRemoveAlignment = async () => {
    let response = await deleteAlignment(alignmentToRemove.id);

    if (!anyError(response)) {
      /// Update the UI
      setAlignments([...alignments.filter((mt) => mt.id !== alignmentToRemove.id)]);
      setSpineTerms([...spineTerms.filter((sTerm) => sTerm.id !== alignmentToRemove.spineTermId)]);

      /// Close the modal confirmation window
      setConfirmingRemoveAlignment(false);

      /// If this is the only change, it's not right to count it as a change to save, since it's already
      /// performed against the service, so it does not represent a change to perform.
      setChangesPerformed(changesPerformed - 1);

      /// Communicate the operation result to the user
      toast.success('Synthetic alignment successfully removed');
    }
  };

  /**
   * Get the alignment to its previous state
   */
  const handleCancelRemoveAlignment = () => {
    alignmentToRemove.predicateId = alignmentToRemove.previousPredicateId;
    alignmentToRemove.mappedTerms = alignmentToRemove.previousMappedTerms;

    setConfirmingRemoveAlignment(false);
  };

  /**
   * Mark the term not mapped.
   *
   * @param {Object} alignment Also called "alignment", containing the information about the spine term,
   * predicate and mapped terms.
   * @param {Object} mappedTerm The mapped term that's going to be detached from the mapping term
   */
  const handleRevertMapping = (alignment, mappedTerm) => {
    alignment.changed = true;
    alignment.previousMappedTerms = alignment.mappedTerms;
    alignment.mappedTerms = alignment.mappedTerms.filter((mTerm) => mTerm.id !== mappedTerm.id);

    /// If there's no mapped terms after removing the selected one (this was the last mapped
    /// term, and we removed it) remove the predicate
    if (_.isEmpty(alignment.mappedTerms)) {
      alignment.previousPredicateId = alignment.predicateId;
      alignment.predicateId = null;
      /// If it's a synthetic alignment, and we added it, let's remove it
      if (
        alignment.synthetic &&
        alignment.origin.toLowerCase() === organization.name.toLowerCase()
      ) {
        setAlignmentToRemove(alignment);
        setConfirmingRemoveAlignment(true);
      }
    }

    setChangesPerformed(changesPerformed + 1);
    setAlignments([...alignments]);
  };

  /**
   * Button to accept the mapping alignment.
   */
  const AlignmentOptions = () => {
    return (
      <React.Fragment>
        <button
          className="btn btn-dark mr-2"
          onClick={handleSaveAlignments}
          disabled={!changesPerformed || !noPartiallyMappedTerms || loading}
          data-toggle="tooltip"
          data-placement="bottom"
          title={
            'You can save the changes to continue mapping later' +
            (changesPerformed ? '' : '. Try making a change!')
          }
        >
          Save
        </button>
        {leadMapper && mapping.status !== 'mapped' && (
          <button
            className="btn bg-col-primary col-background"
            onClick={handleDoneAlignment}
            disabled={loading || !noPartiallyMappedTerms}
            data-toggle="tooltip"
            data-placement="bottom"
            title={
              noPartiallyMappedTerms
                ? 'Mark this mapping as finished'
                : 'Be sure to map all the properties to the spine, and to set a predicate to each alignment'
            }
          >
            Done Alignment
          </button>
        )}
      </React.Fragment>
    );
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
        stepperStep={3}
        customcontent={<AlignmentOptions />}
      />
    );
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  function anyError(response) {
    if (response.error) {
      let tempErrors = errors;
      tempErrors.push(response.error);
      setErrors([]);
      setErrors(tempErrors);
    }
    /// It will return a truthy value (depending no the existence
    /// of the errors on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Returns the next id for a given "in-memory" collection
   *
   * @param {Array} collection
   */
  const nextId = (collection) => {
    return 1 + collection.reduce((max, elem) => (elem.id > max ? elem.id : max), 0);
  };

  /**
   * Adds an extra property to the spineTerms collection
   */
  const addSyntheticTerm = () => {
    const id = nextId(spineTerms);

    setSpineTerms([
      ...spineTerms,
      {
        id,
        name: '',
        synthetic: true,
        property: {
          comment: 'Synthetic property added to spine',
        },
      },
    ]);

    return id;
  };

  /**
   * Adds an extra property to the alignments collection (alignments)
   *
   * @param {Integer} syntheticTermId
   */
  const addSyntheticAlignment = (syntheticTermId) => {
    setAlignments([
      ...alignments,
      {
        synthetic: true,
        mappedTerms: [],
        spineTermId: syntheticTermId,
        predicateId: strongestMatchPredicate?.id,
        comment: null,
      },
    ]);
  };

  /**
   * Adds a synthetic property to the spine. It also handles the alignment object to be created.
   */
  const handleAddSynthetic = () => {
    setLoading(true);
    addSyntheticAlignment(addSyntheticTerm());
    setChangesPerformed(changesPerformed + 1);
    setAddingSynthetic(true);
    setLoading(false);
  };

  /**
   * Cancel adding a synthetic term to the spine
   */
  const handleCancelSynthetic = () => {
    setAlignments(alignments.filter((al) => !al.synthetic));
    setSpineTerms(spineTerms.filter((st) => !st.synthetic));
    setChangesPerformed(changesPerformed - 1);
    setAddingSynthetic(false);
  };

  /**
   * Save a synthetic property added to the spine to the service
   *
   * It const of saving both:
   * - The spine term, which is a property in the specification marked
   * as spine for the current domain, and
   *
   * - The alignment (alignment) which specifies which mappedTerm/
   * from the uploaded specification is going to be aligned with the
   * new synthetic term and with which predicate.
   */
  const saveSynthetic = async (alignment) => {
    if (!alignment.mappedTerms.length) {
      let tempErrors = errors;
      tempErrors.push('You must select at least 1 term to add the synthetic!');
      setErrors(tempErrors);
      return false;
    }
    let [mappedTerm] = alignment.mappedTerms;
    let tempUri = mappedTerm.uri + '-synthetic';

    let response = await createSpineTerm({
      synthetic: {
        alignment: {
          comment:
            'Alignment for a synthetic property added to the spine. Synthetic uri: ' + tempUri,
          uri: tempUri,
          predicateId: strongestMatchPredicate?.id,
          mappingId: mapping.id,
          mappedTermsIds: alignment.mappedTerms.map((term) => term.id),
          synthetic: true,
        },
        spineId: mapping.spine_id,
        spineTermId: alignment.mappedTerms[0].id,
      },
    });

    return !anyError(response);
  };

  /**
   * Save the performed changes.
   */
  const handleSaveAlignments = async () => {
    /// Save alignments
    setLoading(true);

    const data = completeAlignments.map((alignment) => ({
      id: alignment.id,
      predicateId: alignment.predicateId,
      mappedTermIds: alignment.mappedTerms?.map((t) => t.id) ?? [],
    }));

    const { error } = await saveAlignments(mapping.id, data);
    setLoading(false);

    if (error) {
      setErrors([error]);
    } else {
      setChangesPerformed(false);
      toast.success('Changes saved!');

      /// Redirect to the list of specifications
      props.history.push('/mappings');
    }
  };

  /**
   * Domain mapping complete. Confirm to save status in the backend
   */
  const handleDoneAlignment = async () => {
    /// Change the mapping status to "mapped", so we confirm it's finish the
    /// mapping phase
    let response = await updateMapping({
      id: mapping.id,
      status: 'mapped',
    });

    if (!anyError(response)) {
      /// Save changes if necessary
      if (changesPerformed) {
        await handleSaveAlignments();
      }
      /// Redirect to the specifications list
      props.history.push('/mappings');
    }
  };

  /**
   * Get the mapping
   */
  const handleFetchMapping = async (mappingId) => {
    let response = await fetchMapping(mappingId);
    if (!anyError(response)) {
      // Set the mapping and mapping terms on state
      setMapping(response.mapping);
    }
    return response;
  };

  /**
   * Get the mapping terms
   */
  const handleFetchMappingSelectedTerms = async (mappingId) => {
    let response = await fetchMappingSelectedTerms(mappingId);
    if (!anyError(response)) {
      // Set the mapping on state
      setMappingSelectedTerms(response.terms);
    }
  };

  /**
   * Get the mapping terms. These are those that will relate spine terms
   * with predicates and specification selected terms
   */
  const handleFetchAlignments = async (mappingId) => {
    let response = await fetchAlignments(mappingId);
    if (!anyError(response)) {
      let alignmentsList = response.alignments;
      alignmentsList.forEach((alignment) => (alignment.persisted = true));

      // Set the mapping terms on state
      setAlignments(alignmentsList);
    }
  };

  /**
   * Get the specification terms
   */
  const handleFetchSpineTerms = async (spineId) => {
    let response = await fetchSpineTerms(spineId);
    if (!anyError(response)) {
      // Set the spine terms on state
      setSpineTerms(response.terms);
    }
  };

  /**
   * Get the specification terms
   */
  const handleFetchPredicates = async () => {
    let response = await fetchPredicates();
    if (!anyError(response)) {
      // Set the spine terms on state
      setPredicates(response.predicates);
    }
  };

  /**
   * Fetch changes from the api service. This is only used to get the exact date
   * when the mapping changed from "in-progress" to "mapped".
   */
  const handleFetchMappingChanges = async (mapping) => {
    if (mapping.status === 'mapped') {
      let response = await fetchAudits({
        className: 'Mapping',
        instanceIds: mapping.id,
        auditAction: 'update',
      });

      if (!anyError(response)) {
        let statusChangedAudit = response.audits.find(
          (audit) => audit.audited_changes['status'].toString() === '1,2'
        );

        if (statusChangedAudit) {
          setDateMapped(statusChangedAudit.created_at);
        }
      }
    }
  };

  /**
   * Get the data from the service
   */
  const fetchDataFromAPI = async () => {
    // Get the mapping
    let response = await handleFetchMapping(props.match.params.id);

    // Get the mapping terms
    await handleFetchAlignments(props.match.params.id);

    // Get the mapping selected terms
    await handleFetchMappingSelectedTerms(props.match.params.id);

    // Get the spine terms
    await handleFetchSpineTerms(response.mapping.spine_id);

    // Get the predicates
    await handleFetchPredicates();

    // Get the audits
    await handleFetchMappingChanges(response.mapping);
  };

  /**
   * Use effect with an empty array as second parameter, will trigger the 'fetchDataFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted, but
   * it mimics the same action).
   */
  useEffect(() => {
    fetchDataFromAPI().then(() => {
      if (_.isEmpty(errors)) {
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="container-fluid d-flex flex-column h-100">
      <TopNav centerContent={navCenterOptions} />
      {errors.length ? <AlertNotice message={errors} /> : ''}
      <div className="row overflow-auto">
        {loading ? (
          <Loader />
        ) : (
          <React.Fragment>
            <ConfirmDialog
              onRequestClose={() => {
                handleCancelRemoveAlignment();
              }}
              onConfirm={() => handleRemoveAlignment()}
              visible={confirmingRemoveAlignment}
            >
              <h2 className="text-center">You are removing an alignment permanently.</h2>
              <h5 className="mt-3 text-center">Please confirm this action.</h5>
            </ConfirmDialog>

            {/* LEFT SIDE */}
            <div
              className="col-lg-8 mh-100 p-lg-5 pt-5"
              onScroll={(e) => setScrollTop(e.target.scrollTop)}
              ref={leftColumnRef}
              style={{ overflowY: 'scroll' }}
            >
              <SpineHeader
                domain={mapping.domain}
                hideMappedSpineTerms={hideMappedSpineTerms}
                setHideMappedSpineTerms={setHideMappedSpineTerms}
                mappingSelectedTerms={mappingSelectedTerms}
                mappedSelectedTerms={mappedSelectedTerms}
                spineTermsInputValue={spineTermsInputValue}
                filterSpineTermsOnChange={filterSpineTermsOnChange}
                addingSynthetic={addingSynthetic}
                handleAddSynthetic={handleAddSynthetic}
                alignments={alignments}
              />
              <div className="mt-5">
                {/* CHANGELOG */}
                {dateMapped && (
                  <MappingChangeLog
                    predicates={predicates}
                    mapping={mapping}
                    spineTerms={spineTerms}
                    alignments={alignments}
                    dateMapped={dateMapped}
                  />
                )}

                {/* CANCEL SYNTHETIC TERM FORM */}
                {addingSynthetic && (
                  <div className="row">
                    <div className="col mb-3">
                      <a
                        className="col-primary cursor-pointer float-right"
                        onClick={handleCancelSynthetic}
                      >
                        <strong>Cancel</strong>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {mapping['new_spine_created?'] && (
                <AlertNotice
                  cssClass="bg-col-success col-background mb-5"
                  message="No further mapping is necessary. If you want to publish the mapping, please click “Done Alignment.“"
                  title="A new spine was created."
                />
              )}

              <div className="row mb-2">
                <h4 className="col-5">Spine Term</h4>
                <h4 className="col-3">Mapping Predicate</h4>
                <h4 className="col-4">Mapped Term</h4>
              </div>

              {!loading &&
                filteredSpineTerms.map((term) => {
                  return props.hideMappedSpineTerms && props.isMapped(term) ? (
                    ''
                  ) : loading ? (
                    <Loader />
                  ) : hideMappedSpineTerms && spineTermIsMapped(term) ? (
                    ''
                  ) : (
                    <SpineTermRow
                      key={term.id}
                      term={term}
                      alignment={alignmentForSpineTerm(term.id)}
                      predicates={predicates}
                      selectedAlignments={selectedAlignments}
                      mappedTermsToSpineTerm={mappedTermsToSpineTerm}
                      origin={mapping.origin}
                      spineOrigin={mapping.spine_origin}
                      onPredicateSelected={onPredicateSelected}
                      onRevertMapping={(mappedTerm) =>
                        handleRevertMapping(alignmentForSpineTerm(term.id), mappedTerm)
                      }
                    />
                  );
                })}
              <div className="mt-3">
                <AlignmentOptions />
              </div>
            </div>

            {/* RIGHT SIDE */}

            <div
              className="bg-col-secondary col-lg-4 mh-100 p-lg-5 pt-5"
              style={{ overflowY: 'scroll' }}
            >
              <AlignmentsHeader
                organizationName={organization.name}
                domain={mapping.domain}
                selectedAlignments={selectedAlignments}
                hideMappedSelectedTerms={hideMappedSelectedTerms}
                setHideMappedSelectedTerms={setHideMappedSelectedTerms}
                mappingSelectedTerms={mappingSelectedTerms}
                mappedSelectedTerms={mappedSelectedTerms}
                mappingSelectedTermsInputValue={mappingSelectedTermsInputValue}
                filterMappingSelectedTermsOnChange={filterMappingSelectedTermsOnChange}
              />

              {/* MAPPING TERMS LIST */}

              <AlertNotice
                cssClass="bg-col-primary col-background mt-5"
                title={
                  mappingSelectedTerms.length +
                  ' ' +
                  Pluralize('property', mappingSelectedTerms.length) +
                  ' have been selected from the original specification'
                }
                message={
                  'The items below have been added to the ' +
                  _.capitalize(mapping.domain) +
                  ' domain. Now you can align them to the spine.'
                }
              />

              <Fragment>
                {/* SELECTED TERMS */}

                <Draggable
                  items={selectedAlignments}
                  itemType={DraggableItemTypes.PROPERTIES_SET}
                  afterDrop={afterDropTerm}
                >
                  {filteredMappingSelectedTerms({
                    pickSelected: true,
                  }).map((term) => {
                    return hideMappedSelectedTerms && selectedTermIsMapped(term) ? (
                      ''
                    ) : (
                      <TermCard
                        key={term.id}
                        term={term}
                        onClick={onSelectedTermClick}
                        editEnabled={false}
                        isMapped={selectedTermIsMapped}
                        origin={mapping.origin}
                        alwaysEnabled={true}
                      />
                    );
                  })}
                </Draggable>

                {/* NOT SELECTED TERMS */}
                {filteredMappingSelectedTerms({
                  pickSelected: false,
                }).map((term) => {
                  return hideMappedSelectedTerms && selectedTermIsMapped(term) ? (
                    ''
                  ) : (
                    <TermCard
                      key={term.id}
                      term={term}
                      onClick={onSelectedTermClick}
                      editEnabled={false}
                      isMapped={selectedTermIsMapped}
                      origin={mapping.origin}
                      alwaysEnabled={true}
                      disableClick={addingSynthetic && selectedAlignments.length > 0}
                    />
                  );
                })}
                {/* END NOT SELECTED TERMS */}
              </Fragment>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default AlignAndFineTune;
