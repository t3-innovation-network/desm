import { useMemo, useState } from 'react';
import { compact, flatMap, intersection } from 'lodash';
import { implementAlignmentSort, implementAlignmentTermsSort } from './SortOptions';
import { propertyClassesForAlignmentTerm } from './stores/propertyMappingListStore';

/**
 * @description A list of alignments with information like predicate, comment, and more.
 *   The alignments are built in form of separate cards.
 *
 * Props:
 * @param {Object} spineTerm The term of the spine to look for alignments
 * @param {Array} selectedPredicateIds The list of predicates selected by the user in the filter
 * @param {String} selectedAlignmentOrderOption The option selected by the user to order the list of alignments
 * @param {Array} selectedAlignmentSpecificationsIds The list of specifications that made alignments, selected by the user
 *   in the filter.
 * @param {Array} selectedSpineSpecificationIds The list of specifications that has properties with alignments, selected
 *   by the user in the filter. This refers to the origin of the property. Initially, a spine specification will have
 *   all its properties with the same specification. When a synthetic property is created, it will keep the specification
 *   of origin.
 */
const PropertyAlignments = (props) => {
  const {
    selectedPredicateIds,
    selectedAlignmentSpecificationsIds,
    selectedSpineSpecificationIds,
  } = props;
  const alignments = props.spineTerm.alignments;

  // TODO: this need to be moved to top level store
  const filteredMappedTerms = useMemo(() => {
    let filteredAl = alignments.filter(
      (alignment) =>
        /// It matches the selected predicates
        selectedPredicateIds.includes(alignment.predicateId) &&
        /// It matches the selected alignment specifications
        selectedAlignmentSpecificationsIds.includes(alignment.mapping.specification.id) &&
        /// It matches the selected alignment specifications
        intersection(
          selectedSpineSpecificationIds,
          props.spineTerm.specifications.map((s) => s.id)
        ).length
    );
    filteredAl = implementAlignmentSort(filteredAl, props.selectedAlignmentOrderOption);
    let filteredMappedTerms = compact(
      flatMap(filteredAl, (alignment) =>
        alignment.mappedTerms.map((mTerm) =>
          intersection(
            selectedAlignmentSpecificationsIds,
            mTerm.specifications.map((s) => s.id)
          ).length
            ? {
                ...mTerm,
                alignment,
                selectedClasses: propertyClassesForAlignmentTerm(alignment, mTerm),
              }
            : null
        )
      )
    );
    return implementAlignmentTermsSort(filteredMappedTerms, props.selectedAlignmentOrderOption);
  }, [
    alignments,
    selectedPredicateIds,
    selectedAlignmentSpecificationsIds,
    selectedSpineSpecificationIds,
    props.selectedAlignmentOrderOption,
  ]);

  return filteredMappedTerms.map((mTerm, idx) => (
    <AlignmentCard
      alignment={mTerm.alignment}
      key={`${mTerm.alignment?.id}-${mTerm.id}`}
      term={mTerm}
      isLast={idx === filteredMappedTerms.length - 1}
    />
  ));
};

/**
 * Props:
 * @param {Object} alignment
 */

const AlignmentCard = ({ alignment, term, isLast = false }) => {
  const [showingAlignmentComment, setShowingAlignmentComment] = useState(false);

  const alignmentTermClasses = term.selectedClasses.map((c) => <li key={c}>{c}</li>);

  return (
    <div className={`card borderless ${isLast ? '' : 'mb-3'}`}>
      <div className="card-header desm-rounded bottom-borderless bg-col-secondary">
        <div className="row">
          <div className="col-2">
            <small className="mt-1 col-on-primary-light">Organization</small>
            <p className="mb-1">{alignment.origin}</p>

            <small className="mt-1 col-on-primary-light">Schema</small>
            <p className="mb-1">{alignment.schemaName}</p>
          </div>
          <div className="col-2 px-1">
            <small className="mt-1 col-on-primary-light">Element/Property</small>
            <p className="mb-1">{term.name}</p>

            <small className="mt-1 col-on-primary-light">Class/Type</small>
            <ul className="list-unstyled mb-1">{alignmentTermClasses}</ul>
          </div>
          <div className="col-6">
            <small className="mt-1 col-on-primary-light">Definition</small>
            <p className="mb-1">{term.property.comment}</p>
          </div>
          <div className="col-2 ps-1">
            <div
              className="text-center desm-rounded p-3"
              style={{
                backgroundColor: alignment.predicate.color || 'unset',
                color: alignment.predicate.color ? 'White' : 'DarkSlateGrey',
              }}
            >
              <strong>{alignment.predicate ? alignment.predicate.prefLabel : ''}</strong>
            </div>
            {alignment.predicate?.definition && (
              <div className="lh-1 mt-1">
                <small>{alignment.predicate.definition}</small>
              </div>
            )}
            {alignment.comment && (
              <label
                className="non-selectable float-right mt-1 mb-0 col-primary cursor-pointer"
                onClick={() => setShowingAlignmentComment(!showingAlignmentComment)}
              >
                {showingAlignmentComment ? 'Hide Alignment Notes' : 'Alignment Notes'}
              </label>
            )}
          </div>
        </div>

        {showingAlignmentComment && (
          <div className="row">
            <div className="col">
              <div className="card borderless">
                <div className="card-body">
                  <h6 className="col-on-primary">Alignment Note</h6>
                  {alignment.comment}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyAlignments;
