import { useEffect, useMemo, useState } from 'react';
import { compact, flatMap, intersection, kebabCase } from 'lodash';
import classNames from 'classnames';
import { implementAlignmentSort, implementAlignmentTermsSort } from './SortOptions';
import { propertyClassesForAlignmentTerm } from './stores/propertyMappingListStore';
import PropertyComments from './PropertyComments';
import Predicate from '../shared/Predicate';

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
 * @param {Function} onSetShowingConnectors A function to set the state of the showing connectors of the spine term
 */
const PropertyAlignments = (props) => {
  const { selectedPredicateIds, selectedAlignmentSpecificationsIds, onSetShowingConnectors } =
    props;
  const alignments = props.spineTerm.alignments;

  // TODO: this need to be moved to top level store
  const filteredMappedTerms = useMemo(() => {
    let filteredAl = alignments.filter(
      (alignment) =>
        /// It matches the selected predicates
        selectedPredicateIds.includes(alignment.predicateId) &&
        /// It matches the selected alignment specifications
        selectedAlignmentSpecificationsIds.includes(alignment.mapping.specification.id)
    );
    filteredAl = implementAlignmentSort(filteredAl, props.selectedAlignmentOrderOption);
    let filteredMappedTerms = compact(
      flatMap(filteredAl, (alignment) =>
        alignment.mappedTerms.map((mTerm) =>
          intersection(selectedAlignmentSpecificationsIds, mTerm.specificationIds).length
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
    props.selectedAlignmentOrderOption,
  ]);

  useEffect(() => {
    onSetShowingConnectors(props.spineTerm.id, filteredMappedTerms.length > 0);
  }, [filteredMappedTerms.length > 0]);

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

  const alignmentTermClasses = term.selectedClasses.join(', ');
  const alignmentTermRanges = term.compactRanges.join(', ');
  const clsHeader = classNames(
    'card-header u-txt--predicate d-inline-flex align-items-center  px-2 py-1',
    `desm-predicate--${kebabCase(alignment.predicate.color || 'unset')}`
  );
  const clsConnector = classNames('desm-connector--mapping-property-vertical d-lg-none', {
    'h-full': !isLast,
    'h-50': isLast,
  });

  return (
    <div className={`card ${isLast ? '' : 'mb-3'} bg-bg-dark position-relative`}>
      <div className={clsHeader}>
        <Predicate predicate={alignment.predicate} />
      </div>
      <div className="desm-connector--mapping"></div>
      <div className={clsConnector}></div>
      <div className="card-body p-2">
        <p className="mb-2">
          <span className="desm-icon me-1 align-middle">account_tree</span>
          <span>{alignment.schemaName}</span>
          <br />
          <span className="desm-icon me-1 align-middle">arrow_split</span>
          <span className="fs-5">{term.name}</span>
        </p>

        <p className="mb-1">
          <span className="fw-bold">Definition:&nbsp;</span> {<PropertyComments term={term} />}
          <br />
          <span className="fw-bold">Relevant class(es):&nbsp;</span>
          {alignmentTermClasses}
          <br />
          <span className="fw-bold">Expected value type:&nbsp;</span>
          {alignmentTermRanges}
          <br />
        </p>
        {(alignment.transformation?.to || alignment.transformation?.from) && (
          <>
            <div className="mb-1">
              <p className="fw-bold mb-0">Data Transformation:</p>
              {alignment.transformation?.to ? (
                <p className="mb-0">To Spine: {alignment.transformation.to}</p>
              ) : null}
              {alignment.transformation?.from ? (
                <p className="mb-0">From Spine: {alignment.transformation.from}</p>
              ) : null}
            </div>
          </>
        )}
        {alignment.comment && (
          <div className="w-100 text-end">
            <label
              className="non-selectable my-1 text-desm-primary cursor-pointer"
              onClick={() => setShowingAlignmentComment(!showingAlignmentComment)}
            >
              {showingAlignmentComment ? 'Hide Alignment Notes' : 'Alignment Notes'}
            </label>
          </div>
        )}
        {showingAlignmentComment && (
          <div className="p-2 bg-white w-100">
            <h6>Alignment Note</h6>
            {alignment.comment}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyAlignments;
