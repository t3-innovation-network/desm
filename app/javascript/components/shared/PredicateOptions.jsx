import React, { useState } from 'react';
import ExpandableOptions from './ExpandableOptions';

/**
 * The predicates list as "Expandable"
 *
 * Props:
 * @prop {Array} predicates
 * @prop {String} predicate
 */
const PredicateOptions = (props) => {
  /**
   * Elements from props
   */
  const { predicates, cls = '' } = props;

  /**
   * The current selected predicate
   */
  const [predicate, setPredicate] = useState(props.predicate);

  /**
   * Return the list of predicates as options to use on the abstract
   * expandable options component
   */
  const predicatesAsOptions = () => {
    return predicates.map((predicate) => {
      return {
        name: predicate.pref_label,
        id: predicate.id,
      };
    });
  };

  /**
   * Actions to take when a predicate has been selected for a mapping term
   *
   * @param {Object} predicate
   */
  const handlePredicateSelected = (predicate) => {
    setPredicate(predicate.name);
    props.onPredicateSelected(predicate);
  };

  return (
    <ExpandableOptions
      options={predicatesAsOptions()}
      onClose={(predicate) => handlePredicateSelected(predicate)}
      selectedOption={predicate}
      cardCssClass={`with-shadow ${cls}`}
    />
  );
};

export default PredicateOptions;
