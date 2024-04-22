import { useMemo, useState } from 'react';
import { implementAlignmentSort } from './SortOptions';
import { propertyClassesForAlignmentTerm } from './stores/propertiesListStore';

/**
 * @description A list of alignments with information like predicate, comment, and more.
 *   The alignments are built in form of separate cards.
 *
 * Props:
 * @param {Object} spineTerm The term of the spine to look for alignments
 * @param {Array} selectedPredicates The list of predicates selected by the user in the filter
 * @param {String} selectedAlignmentOrderOption The option selected by the user to order the list of alignments
 * @param {Array} selectedAlignmentOrganizations The list of organizations that made alignments, selected by the user
 *   in the filter.
 * @param {Array} selectedSpineOrganizations The list of organizations that has properties with alignments, selected
 *   by the user in the filter. This refers to the origin of the property. Initially, a spine specification will have
 *   all its properties with the same organization. When a synthetic property is created, it will keep the organization
 *   of origin.
 */
const PropertyAlignments = (props) => {
  const alignments = props.spineTerm.alignments;

  // TODO: this need to be moved to top level store
  const selectedPredicateIds = useMemo(
    () => props.selectedPredicates.map((predicate) => predicate.id),
    [props.selectedPredicates]
  );
  const selectedAlignmentOrganizationIds = useMemo(
    () => props.selectedAlignmentOrganizations.map((org) => org.id),
    [props.selectedAlignmentOrganizations]
  );
  const selectedSpineOrganizationIds = useMemo(
    () => props.selectedSpineOrganizations.map((org) => org.id),
    [props.selectedSpineOrganizations]
  );

  // TODO: this need to be moved to top level store
  const filteredAlignments = useMemo(() => {
    let filteredAl = alignments.filter(
      (alignment) =>
        /// It matches the selected predicates
        selectedPredicateIds.includes(alignment.predicateId) &&
        /// It matches the selected alignment organizations
        alignment.mappedTerms.some((mTerm) =>
          selectedAlignmentOrganizationIds.includes(mTerm.organization.id)
        ) &&
        /// It matches the selected alignment organizations
        selectedSpineOrganizationIds.includes(props.spineTerm.organization.id)
    );
    return implementAlignmentSort(filteredAl, props.selectedAlignmentOrderOption);
  }, [
    alignments,
    selectedPredicateIds,
    selectedAlignmentOrganizationIds,
    selectedSpineOrganizationIds,
    props.selectedAlignmentOrderOption,
  ]);

  return filteredAlignments.map((alignment) => {
    const filteredMappedTerms = alignment.mappedTerms.filter((mTerm) =>
      selectedAlignmentOrganizationIds.includes(mTerm.organization.id)
    );

    return filteredMappedTerms.length
      ? filteredMappedTerms.map((mTerm) => (
          <AlignmentCard alignment={alignment} key={mTerm.id} term={mTerm} />
        ))
      : null;
  });
};

/**
 * Props:
 * @param {Object} alignment
 */

const AlignmentCard = ({ alignment, term }) => {
  const [showingAlignmentComment, setShowingAlignmentComment] = useState(false);

  const alignmentTermClasses = propertyClassesForAlignmentTerm(alignment, term).map((c) => (
    <li key={c}>{c}</li>
  ));

  return (
    <div className="card borderless mb-3">
      <div className="card-header desm-rounded bottom-borderless bg-col-secondary">
        <div className="row">
          <div className="col-2">
            <small className="mt-3 col-on-primary-light">Organization</small>
            <h5>{alignment.origin}</h5>

            <small className="mt-3 col-on-primary-light">Schema</small>
            <h5>{alignment.schemaName}</h5>
          </div>
          <div className="col-2">
            <small className="mt-3 col-on-primary-light">Element/Property</small>
            <h5>{term.name}</h5>

            <small className="mt-3 col-on-primary-light">Class/Type</small>
            <h5>
              <ul className="list-unstyled">{alignmentTermClasses}</ul>
            </h5>
          </div>
          <div className="col-6">
            <small className="mt-3 col-on-primary-light">Definition</small>
            <h5>{term.property.comment}</h5>
          </div>
          <div className="col-2">
            <div className="card borderless">
              <div
                className="card-hader text-center desm-rounded p-3"
                style={{
                  backgroundColor: alignment.predicate.color || 'unset',
                  color: alignment.predicate.color ? 'White' : 'DarkSlateGrey',
                }}
              >
                <strong>{alignment.predicate ? alignment.predicate.prefLabel : ''}</strong>
              </div>
            </div>
            {alignment.comment && (
              <label
                className="non-selectable float-right mt-3 col-primary cursor-pointer"
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
