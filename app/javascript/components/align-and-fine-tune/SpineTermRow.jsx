import { useEffect } from 'react';
import { useLocalStore } from 'easy-peasy';
import AlignmentTransformation from './AlignmentTransformation';
import EditAlignment from './EditAlignment';
import Collapsible from '../shared/Collapsible';
import MatchVocabulary from './match-vocabulary/MatchVocabulary';
import DropZone from '../shared/DropZone';
import PredicateOptions from '../shared/PredicateOptions';
import { DraggableItemTypes } from '../shared/DraggableItemTypes';
import MapVocabularyLink from './match-vocabulary/MapVocabularyLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
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
    onUpdateAlignmentTransformation,
    onEditTermClick,
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
      mappedTermsMatching: mappedTermsToSpineTerm(term).filter(
        (mTerm) => mTerm.vocabularies?.length
      ),
    })
  );
  const {
    predicateOption,
    predicateDefinition,
    mappedTermsMatching,
    editing,
    transforming,
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
   * It will depend on mapped terms having a vocabulary. In case if spine doesn't
   * have a vocabulary, it will be created automatically on dialog opening.
   */
  const alignmentHasVocabulary = () =>
    mappedTermsToSpineTerm(term).some((mTerm) => mTerm.vocabularies?.length);
  /**
   * Manage to show a card when there's a predicate selected.
   * If there's a comment, show an orange dot.
   */
  const predicateSelectedCard = ({ selectedOption }) => {
    return (
      <>
        {alignment.comment && (
          <FontAwesomeIcon icon={faCircle} className="fa-xs col-success float-start comment-dot" />
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

  const handleOnTransformationUpdated = (result) => {
    if (result.saved) {
      showSuccess('Changes saved!');
      // Update the mapping term in state (if there's a transformation, we need to
      // redraw in order to let the orange dot to appear)
      onUpdateAlignmentTransformation({ id: alignment.id, transformation: result.transformation });
    }
    actions.setTransforming(false);
  };

  // Closes the modal window for editing the alignment and cancel editing the alignment
  const onRequestEditClose = () => actions.setEditing(false);
  // Closes the modal window for matching vocabularies
  const onRequestVocabsClose = () => actions.setMatchingVocab(false);
  // Closes the modal window for transformation and cancel adding alignment transformation
  const onRequestTransformationClose = () => actions.setTransforming(false);

  const mappedTerms = mappedTermsToSpineTerm(term);
  const syntheticNotSaved = term.synthetic && !term.persisted;
  const withPredicate = predicateOption && !noMatchPredicate(predicateOption);
  const clsPredicate =
    (withPredicate && mappedTerms.length === 0) || (!predicateOption && mappedTerms.length > 0)
      ? 'border-warning w-100'
      : 'w-100';

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
      <AlignmentTransformation
        isOpen={transforming}
        onUpdate={handleOnTransformationUpdated}
        alignment={alignment}
        onClose={onRequestTransformationClose}
      />

      {alignmentHasVocabulary() ? (
        <MatchVocabulary
          modalIsOpen={matchingVocab}
          onRequestClose={onRequestVocabsClose}
          mappingOrigin={origin}
          spineOrigin={spineOrigin}
          spineTerm={term}
          mappedTerms={mappedTermsMatching}
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
                  <h6 className="card-subtitle text-body-secondary">
                    Name: <strong>{term.title}</strong>
                  </h6>
                )}
                <p className="card-text">{term.property.comment}</p>
                {alignment.transformation?.from && (
                  <h6 className="card-subtitle">
                    Data Transformation: {alignment.transformation.from}
                  </h6>
                )}
                <button
                  className="btn btn-link p-0"
                  onClick={() => actions.setSpineTermExpanded(!spineTermExpanded)}
                >
                  {spineTermExpanded ? 'Collapse' : 'Expand'}
                </button>
                {spineTermExpanded ? (
                  <div className="mt-2">
                    {!term.synthetic ? (
                      <>
                        <p className="card-text">
                          Used on class(es):{' '}
                          <span className="col-primary">
                            {intersection(compactDomains, term.compactDomains).join(', ')}
                          </span>
                        </p>
                        <p className="card-text">
                          Expected value type(s):{' '}
                          <span className="col-primary">{term.compactRanges.join(', ')}</span>
                        </p>
                      </>
                    ) : null}
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
          <div className="w-100 mt-1 text-end">
            <button
              className="btn btn-link p-0 col-primary"
              onClick={() => actions.setEditing(true)}
              disabled={syntheticNotSaved}
            >
              {alignment?.comment ? 'Edit Comment' : 'Add Comment'}
            </button>
          </div>
          <div className="w-100 mt-1 text-end">
            <button
              className="btn btn-link p-0 col-primary"
              onClick={() => actions.setTransforming(true)}
              disabled={syntheticNotSaved}
            >
              {alignment?.transformation?.to || alignment?.transformation?.from
                ? 'Edit Transformation'
                : 'Add Transformation'}
            </button>
          </div>
          <div className="w-100 mt-1 text-end">
            <MapVocabularyLink
              disabled={!alignmentHasVocabulary()}
              notPersisted={syntheticNotSaved}
              onVocabularyClick={actions.handleMatchVocabularyClick}
              terms={mappedTerms.filter((mTerm) => mTerm.vocabularies?.length)}
              id={term.id}
            />
          </div>
        </div>

        <div className="col-4">
          <DropZone
            acceptedItemType={DraggableItemTypes.PROPERTIES_SET}
            droppedItem={{ id: term.id }}
            disabled={noMatchPredicate(predicateOption)}
            cls={clsPredicate}
            placeholder="Drag relevant properties/elements here"
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
                        <span
                          onClick={() => onEditTermClick(mTerm)}
                          className="ms-3 cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                      </div>
                    </div>
                  }
                  cardStyle={`with-shadow mb-2 ${predicateOption ? '' : 'border-warning'}`}
                  key={mTerm.id}
                  observeOutside={false}
                  bodyContent={
                    <>
                      {mTerm.title && (
                        <h6 className="card-subtitle text-body-secondary">
                          Name: <strong>{mTerm.title}</strong>
                        </h6>
                      )}
                      <p className="card-text">{mTerm.property.comment}</p>
                      <p className="card-text">
                        ID:
                        <span>{' ' + mTerm.sourceUri}</span>
                      </p>
                      {alignment.transformation?.to && (
                        <h6 className="card-subtitle">
                          Data Transformation: {alignment.transformation.to}
                        </h6>
                      )}
                      <button
                        className="btn btn-link p-0"
                        onClick={() => actions.setMappedTermExpanded(!mappedTermExpanded)}
                      >
                        {mappedTermExpanded ? 'Collapse' : 'Expand'}
                      </button>
                      {mappedTermExpanded ? (
                        <div className="mt-2">
                          <p className="card-text">
                            Used on class(es):{' '}
                            <span>
                              {intersection(compactDomains, mTerm.compactDomains).join(', ')}
                            </span>
                          </p>
                          <p className="card-text">
                            Expected value type(s): <span>{mTerm.compactRanges.join(', ')}</span>
                          </p>
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
