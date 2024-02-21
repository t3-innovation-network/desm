import React, { Fragment, useContext, useEffect, useRef, useMemo } from 'react';
import { compact } from 'lodash';
import TermCard from '../mapping-to-domains/TermCard';
import AlertNotice from '../shared/AlertNotice';
import Loader from '../shared/Loader';
import TopNav from '../shared/TopNav';
import TopNavOptions from '../shared/TopNavOptions';
import SpineTermRow from './SpineTermRow';
import SpineHeader from './SpineHeader';
import AlignmentsHeader from './AlignmentsHeader';
import AlignmentsOptions from './AlignmentsOptions';
import Pluralize from 'pluralize';
import Draggable from '../shared/Draggable';
import { DraggableItemTypes } from '../shared/DraggableItemTypes';
import MappingChangeLog from './mapping-changelog/MappingChangeLog';
import ConfirmDialog from '../shared/ConfirmDialog';
import { AppContext } from '../../contexts/AppContext';
import { useLocalStore } from 'easy-peasy';
import { mappingStore } from './stores/mappingStore';

const AlignAndFineTune = (props) => {
  const { leadMapper, organization } = useContext(AppContext);
  const leftColumnRef = useRef(null);
  const [state, actions] = useLocalStore(() => mappingStore());
  const {
    addingSynthetic,
    alignments,
    hideMappedSelectedTerms,
    hideMappedSpineTerms,
    mapping,
    mappingSelectedTerms,
    mappingSelectedTermsInputValue,
    predicates,
    spineTerms,
    spineTermsInputValue,
  } = state;

  // All the terms that are already mapped
  const mappedSelectedTerms = useMemo(
    () => mappingSelectedTerms.filter(state.selectedTermIsMapped),
    [mappingSelectedTerms, alignments]
  );

  // Mark the term as "selected"
  const onSelectedTermClick = (clickedTerm) => {
    if (!clickedTerm.mappedTo) actions.markMappingTermSelected(clickedTerm);
  };

  // Link the predicate to the corresponding mapping term
  const onPredicateSelected = (spineTerm, predicate) =>
    actions.selectPredicate({ spineTerm, predicate });

  // Action to perform after a mapping term is dropped
  const afterDropTerm = (spineTerm) => {
    actions.afterDropTerm({ spineTerm });
    leftColumnRef.current?.scroll(0, state.scrollTop);
  };
  /**
   * Domain mapping complete. Confirm to save status in the backend
   */
  const handleDoneAlignment = async () => {
    const result = await actions.handleDoneAlignment();
    if (result) {
      // Redirect to the specifications list
      props.history.push('/mappings');
    }
  };

  /**
   * Save the performed changes.
   */
  const handleSaveAlignments = async () => {
    const result = await actions.handleSaveAlignments();
    if (result) {
      // TODO: maybe need some action here
      // props.history.push('/mappings');
    }
  };

  const alignmentsOptions = () => (
    <AlignmentsOptions
      isAllowedToMap={leadMapper && mapping.status !== 'mapped'}
      handleSaveAlignments={handleSaveAlignments}
      handleDoneAlignment={handleDoneAlignment}
      changesPerformed={state.changesPerformed}
      noPartiallyMappedTerms={state.noPartiallyMappedTerms}
      loading={state.loading}
    />
  );

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
        customcontent={alignmentsOptions()}
      />
    );
  };

  /**
   * Use effect with an empty array as second parameter, will trigger the 'fetchDataFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted, but
   * it mimics the same action).
   */
  useEffect(() => {
    actions.fetchDataFromAPI({ mappingId: props.match.params.id }).then(() => {
      if (!state.hasErrors) {
        actions.setLoading(false);
      }
    });
  }, []);

  const confirmDialog = () => (
    <ConfirmDialog
      onRequestClose={actions.handleCancelRemoveAlignment}
      onConfirm={actions.handleRemoveAlignment}
      visible={state.confirmingRemoveAlignment}
    >
      <h2 className="text-center">You are removing an alignment permanently.</h2>
      <h5 className="mt-3 text-center">Please confirm this action.</h5>
    </ConfirmDialog>
  );

  const renderFilteredSpineTerms = () => {
    return compact(
      state.filteredSpineTerms.map((term) => {
        if (hideMappedSpineTerms && state.spineTermIsMapped(term)) return null;
        return (
          <SpineTermRow
            key={term.id}
            term={term}
            alignment={state.alignmentForSpineTerm(term.id)}
            predicates={predicates}
            selectedAlignments={state.selectedAlignments}
            mappedTermsToSpineTerm={state.mappedTermsToSpineTerm}
            origin={mapping.origin}
            spineOrigin={mapping.spine_origin}
            onPredicateSelected={onPredicateSelected}
            onUpdateAlignmentComment={actions.updateAlignmentComment}
            onRevertMapping={(mappedTerm) =>
              actions.handleRevertMapping({ termId: term.id, mappedTerm, organization })
            }
          />
        );
      })
    );
  };

  const renderLeftSide = () => (
    <div
      className="col-lg-8 mh-100 p-lg-5 pt-5"
      onScroll={(e) => actions.setScrollTop(e.target.scrollTop)}
      ref={leftColumnRef}
      style={{ overflowY: 'scroll' }}
    >
      <SpineHeader
        domain={mapping.domain}
        hideMappedSpineTerms={hideMappedSpineTerms}
        setHideMappedSpineTerms={actions.setHideMappedSpineTerms}
        mappingSelectedTerms={mappingSelectedTerms}
        mappedSelectedTerms={mappedSelectedTerms}
        spineTermsInputValue={spineTermsInputValue}
        filterSpineTermsOnChange={actions.filterSpineTermsOnChange}
        addingSynthetic={addingSynthetic}
        handleAddSynthetic={actions.handleAddSynthetic}
        noMatchPredicateId={state.noMatchPredicateId}
        alignments={alignments}
      />
      <div className="mt-5">
        {/* CHANGELOG */}
        {state.dateMapped && (
          <MappingChangeLog
            predicates={predicates}
            mapping={mapping}
            spineTerms={spineTerms}
            alignments={alignments}
            dateMapped={state.dateMapped}
          />
        )}

        {/* CANCEL SYNTHETIC TERM FORM */}
        {addingSynthetic && (
          <div className="row">
            <div className="col mb-3">
              <a
                className="col-primary cursor-pointer float-right"
                onClick={actions.handleCancelSynthetic}
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
          message="No further mapping is necessary. If you want to publish the mapping, please click “Done.“"
          title="A new spine was created."
        />
      )}

      <div className="row mb-2">
        <h4 className="col-5">Spine Term</h4>
        <h4 className="col-3">Mapping Predicate</h4>
        <h4 className="col-4">Mapped Term</h4>
      </div>

      {renderFilteredSpineTerms()}

      <div className="mt-3">{alignmentsOptions()}</div>
    </div>
  );

  const renderFilteredTermsFor = (terms, options = { disableClick: false }) =>
    compact(
      terms.map((term) => {
        return hideMappedSelectedTerms && state.selectedTermIsMapped(term) ? null : (
          <TermCard
            key={term.id}
            term={term}
            onClick={onSelectedTermClick}
            editEnabled={false}
            isMapped={state.selectedTermIsMapped}
            origin={mapping.origin}
            alwaysEnabled={true}
            disableClick={options.disableClick}
          />
        );
      })
    );

  const renderRightSide = () => (
    <div className="bg-col-secondary col-lg-4 mh-100 p-lg-5 pt-5" style={{ overflowY: 'scroll' }}>
      <AlignmentsHeader
        organizationName={organization.name}
        domain={mapping.domain}
        selectedAlignments={state.selectedAlignments}
        hideMappedSelectedTerms={hideMappedSelectedTerms}
        setHideMappedSelectedTerms={actions.setHideMappedSelectedTerms}
        mappingSelectedTerms={mappingSelectedTerms}
        mappedSelectedTerms={mappedSelectedTerms}
        mappingSelectedTermsInputValue={mappingSelectedTermsInputValue}
        filterMappingSelectedTermsOnChange={actions.filterMappingSelectedTermsOnChange}
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
          items={state.selectedAlignments}
          itemType={DraggableItemTypes.PROPERTIES_SET}
          afterDrop={afterDropTerm}
        >
          {renderFilteredTermsFor(state.filteredMappingSelectedTerms, { disableClick: false })}
        </Draggable>
        {/* NOT SELECTED TERMS */}
        {renderFilteredTermsFor(state.filteredMappingNotSelectedTerms, {
          disableClick: addingSynthetic && state.selectedAlignments.length > 0,
        })}
        {/* END NOT SELECTED TERMS */}
      </Fragment>
    </div>
  );

  return (
    <div className="container-fluid d-flex flex-column h-100">
      <TopNav centerContent={navCenterOptions} />
      {state.hasErrors ? <AlertNotice message={state.errors} /> : null}
      <div className="row overflow-auto">
        {state.loading ? (
          <Loader />
        ) : (
          <React.Fragment>
            {confirmDialog()}
            {/* LEFT SIDE */}
            {renderLeftSide()}
            {/* RIGHT SIDE */}
            {renderRightSide()}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default AlignAndFineTune;
