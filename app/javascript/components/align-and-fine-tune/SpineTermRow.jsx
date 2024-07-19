import { useEffect } from 'react';
import { useLocalStore } from 'easy-peasy';
import EditAlignment from './EditAlignment';
import Collapsible from '../shared/Collapsible';
import MatchVocabulary from './match-vocabulary/MatchVocabulary';
import DropZone from '../shared/DropZone';
import PredicateOptions from '../shared/PredicateOptions';
import { DraggableItemTypes } from '../shared/DraggableItemTypes';
import VocabularyLabel from './match-vocabulary/VocabularyLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { noMatchPredicate } from './stores/mappingStore';
import { showSuccess } from '../../helpers/Messages';
import { spineTermRowStore } from './stores/spineTermRowStore';
import { intersection } from 'lodash';

/**
 * Props:
 * @prop {String} origin The organization name of the mapping
 * @prop {String} spineOrigin The organization name of the spine specification
 * @prop {Object} term The spine term
 * @prop {Array} predicates The collection of predicates
 * @prop {Function} onPredicateSelected The actions to execute when a predicate is selected
 * @prop {Function} mappedTermsToSpineTerm The list of terms that are mapped to a given spine term
 * @prop {Function} onRevertMapping The actions to execute when the user wants to revert a term from being mapped
 */
const SpineTermRow = (props) => {
  /**
   * The data passed in props
   */
  const {
    alignment,
    onUpdateAlignmentComment,
    mappedTermsToSpineTerm,
    origin,
    compactDomains,
    onRevertMapping,
    predicates,
    spineOrigin,
    term,
  } = props;

  const findPredicate = () =>
    predicates.find((predicate) => predicate.id === alignment.predicateId);
  const [state, actions] = useLocalStore(() =>
    spineTermRowStore({
      predicateOption: findPredicate()?.pref_label,
      predicateDefinition: findPredicate()?.definition,
      mappedTermMatching: mappedTermsToSpineTerm(term)[0],
    })
  );
  const {
    predicateOption,
    predicateDefinition,
    mappedTermMatching,
    editing,
    matchingVocab,
    spineTermExpanded,
    mappedTermExpanded,
  } = state;

  useEffect(() => {
    if (!alignment.predicateId) {
      actions.setPredicateOption(null);
      actions.setPredicateDefinition(null);
    }
  }, [alignment.predicateId]);

  /**
   * Determines whether to show the vocabularies matching window or not.
   * It will depend on both the spine term having a vocabulary associated
   * and the mapped term either.
   */
  const alignmentHasVocabulary = () =>
    term.vocabularies?.length &&
    mappedTermsToSpineTerm(term).some((mTerm) => mTerm.vocabularies?.length);
  /**
   * Manage to show a card when there's a predicate selected.
   * If there's a comment, show an orange dot.
   */
  const predicateSelectedCard = ({ selectedOption }) => {
    return (
      <>
        {alignment.comment && (
          <FontAwesomeIcon icon={faCircle} className="fa-xs col-success float-left comment-dot" />
        )}
        <strong>{selectedOption}</strong>
      </>
    );
  };

  /**
   * Actions to take when a predicate has been selected for a mapping term
   *
   * @param {Object} predicate
   */
  const handlePredicateSelected = (term, predicate) => {
    actions.setPredicateOption(predicate.name);
    actions.setPredicateDefinition(predicate.description);
    props.onPredicateSelected(term, predicate);
  };

  /**
   * After saving the comment on the alignment.
   *
   * @param {String} result
   */
  const handleOnCommentUpdated = (result) => {
    if (result.saved) {
      showSuccess('Changes saved!');
      // Update the mapping term in state (if there's a comment, we need to
      // redraw in order to let the orange dot to appear)
      onUpdateAlignmentComment({ id: alignment.id, comment: result.comment });
    }
    actions.setEditing(false);
  };

  // Closes the modal window for editing the alignment and cancel editing the alignment
  const onRequestEditClose = () => actions.setEditing(false);
  // Closes the modal window for matching vocabularies
  const onRequestVocabsClose = () => actions.setMatchingVocab(false);

  const mappedTerms = mappedTermsToSpineTerm(term);
  const withPredicate = predicateOption && !noMatchPredicate(predicateOption);
  const clsPredicate =
    (withPredicate && mappedTerms.length === 0) || (!predicateOption && mappedTerms.length > 0)
      ? 'border-warning'
      : '';

  return (
    <>
      <EditAlignment
        modalIsOpen={editing}
        onCommentUpdated={handleOnCommentUpdated}
        alignment={alignment}
        spineTerm={term}
        predicate={findPredicate()}
        onRequestClose={onRequestEditClose}
      />

      {alignmentHasVocabulary() ? (
        <MatchVocabulary
          modalIsOpen={matchingVocab}
          onRequestClose={onRequestVocabsClose}
          mappingOrigin={origin}
          spineOrigin={spineOrigin}
          spineTerm={term}
          mappedTerm={mappedTermMatching}
          predicates={predicates}
          alignment={alignment}
        />
      ) : null}
      <div className="row mb-2" key={term.id}>
        <div className="col-5">
          <Collapsible
            expanded
            headerContent={<strong>{term.name}</strong>}
            cardStyle={'with-shadow mb-2'}
            observeOutside={false}
            bodyContent={
              <>
                {term.title && (
                  <h6 className="card-subtitle text-muted">
                    Name: <strong>{term.title}</strong>
                  </h6>
                )}
                <p className="card-text">{term.property.comment}</p>
                <button
                  className="btn btn-link p-0"
                  onClick={() => actions.setSpineTermExpanded(!spineTermExpanded)}
                >
                  {spineTermExpanded ? 'Collapse' : 'Expand'}
                </button>
                {spineTermExpanded ? (
                  <div className="mt-2">
                    <p className="card-text">
                      Origin:{' '}
                      <span className="col-primary">
                        {term.synthetic ? origin : term.organization.name}
                      </span>
                    </p>
                    {!term.synthetic ? (
                      <>
                        <p className="card-text">
                          Domains:{' '}
                          <span className="col-primary">
                            {intersection(compactDomains, term.compactDomains).join(', ')}
                          </span>
                        </p>
                        <p className="card-text">
                          Ranges:{' '}
                          <span className="col-primary">{term.compactRanges.join(', ')}</span>
                        </p>
                      </>
                    ) : null}

                    {alignmentHasVocabulary() ? <VocabularyLabel term={term} /> : ''}
                  </div>
                ) : null}
              </>
            }
          />
        </div>

        <div className="col-3">
          <PredicateOptions
            predicates={predicates}
            onPredicateSelected={(predicate) => handlePredicateSelected(term, predicate)}
            cls={clsPredicate}
            SelectedComponent={predicateSelectedCard}
            predicate={predicateOption}
          />
          {predicateDefinition && (
            <div className="lh-1 mt-2">
              <small>{predicateDefinition}</small>
            </div>
          )}
          <label
            className="non-selectable float-right mt-1 mb-0 col-primary cursor-pointer"
            onClick={() => actions.setEditing(true)}
          >
            {alignment?.comment ? 'Edit Comment' : 'Add Comment'}
          </label>
        </div>

        <div className="col-4">
          <DropZone
            acceptedItemType={DraggableItemTypes.PROPERTIES_SET}
            droppedItem={{ id: term.id }}
            disabled={noMatchPredicate(predicateOption)}
            cls={clsPredicate}
            placeholder="Drag a matching property here"
          >
            {mappedTerms.map((mTerm) => {
              return (
                <Collapsible
                  expanded
                  headerContent={
                    <div className="row">
                      <div
                        className="col-1 cursor-pointer"
                        title="Revert selecting this term"
                        onClick={() => onRevertMapping(mTerm)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </div>
                      <div className="col-10">
                        <strong>{mTerm.name}</strong>
                      </div>
                    </div>
                  }
                  cardStyle={`with-shadow mb-2 ${predicateOption ? '' : 'border-warning'}`}
                  key={mTerm.id}
                  observeOutside={false}
                  bodyContent={
                    <>
                      {mTerm.title && (
                        <h6 className="card-subtitle text-muted">
                          Name: <strong>{mTerm.title}</strong>
                        </h6>
                      )}
                      <p className="card-text">{mTerm.property.comment}</p>
                      <p className="card-text">
                        ID:
                        <span>{' ' + mTerm.sourceUri}</span>
                      </p>
                      <button
                        className="btn btn-link p-0"
                        onClick={() => actions.setMappedTermExpanded(!mappedTermExpanded)}
                      >
                        {mappedTermExpanded ? 'Collapse' : 'Expand'}
                      </button>
                      {mappedTermExpanded ? (
                        <div className="mt-2">
                          <p className="card-text">
                            Domains:{' '}
                            <span>
                              {intersection(compactDomains, mTerm.compactDomains).join(', ')}
                            </span>
                          </p>
                          <p className="card-text">
                            Ranges: <span>{mTerm.compactRanges.join(', ')}</span>
                          </p>
                          {alignmentHasVocabulary() ? (
                            <VocabularyLabel
                              onVocabularyClick={actions.handleMatchVocabularyClick}
                              term={mTerm}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      ) : null}
                    </>
                  }
                />
              );
            })}
          </DropZone>
        </div>
      </div>
    </>
  );
};

export default SpineTermRow;
