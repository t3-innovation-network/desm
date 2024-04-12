import { flatMap, intersection, uniq } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';

export const defaultState = {};

export const propertyClassesForSpineTerm = (term) => {
  const selectedDomains = uniq(
    flatMap(term.alignments, (alignment) => alignment.selectedDomains || [])
  );
  const termClasses = term.property.domain || [];
  return intersection(selectedDomains, termClasses);
};

export const propertyClassesForAlignment = (alignment) => {
  const selectedDomains = alignment.selectedDomains || [];
  const termClasses = uniq(flatMap(alignment.mappedTerms, (t) => t.property.domain || []));
  return intersection(selectedDomains, termClasses);
};

// TODO: implement properties list store
export const propertiesListStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),
});
