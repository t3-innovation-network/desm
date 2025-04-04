import { DraggableItemTypes } from '../../shared/DraggableItemTypes';
import DropZone from '../../shared/DropZone';
import PredicateOptions from '../../shared/PredicateOptions';
import SimpleConceptCard from './SimpleConceptCard';

/**
 * List the concepts for the spine term vocabulary as cards with the options to map.
 *
 * Props:
 * @prop {Object} alignment
 * @prop {Object} concept
 * @prop {String} mappingOrigin
 * @prop {String} spineOrigin
 * @prop {Array} predicates
 * @prop {Function} onPredicateSelected
 * @prop {Integer} selectedCount
 */
const SpineConceptRow = (props) => {
  /**
   * Elements from props
   */
  const {
    alignment,
    concept,
    mappingOrigin,
    spineOrigin,
    predicates,
    onPredicateSelected,
    selectedCount,
  } = props;

  /**
   * The name of the selected predicate
   */
  const predicateLabel = () => predicates.find((p) => p.id === alignment.predicateId)?.pref_label;

  return (
    <div className="row mb-2" key={concept.id}>
      <div className="col-4">
        <SimpleConceptCard concept={concept} origin={spineOrigin} />
      </div>
      <div className="col-4">
        <PredicateOptions
          predicates={predicates}
          onPredicateSelected={onPredicateSelected}
          predicate={predicateLabel}
        />
      </div>
      <div className="col-4">
        {alignment.mappedConceptsList && alignment.mappedConceptsList.length ? (
          alignment.mappedConceptsList.map((concept) => {
            return <SimpleConceptCard key={concept.id} concept={concept} origin={mappingOrigin} />;
          })
        ) : (
          <DropZone
            droppedItem={{ spineConceptId: concept.id }}
            selectedCount={selectedCount}
            acceptedItemType={DraggableItemTypes.CONCEPTS_SET}
            textStyle={{ fontSize: '12px' }}
            placeholder="Drag a matching concept here"
          />
        )}
      </div>
    </div>
  );
};

export default SpineConceptRow;
