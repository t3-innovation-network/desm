import React from "react";

/**
 * Here we take the first vocabulary. This term might have more than only 1 associated,
 * but we only can match 1 vocabulary to another.
 *
 * Props:
 * @param {Object} term
 * @param {Function} onVocabularyClick
 * @param {Boolean} clickable
 */
const VocabularyLabel = (props) => {
  const { term, onVocabularyClick, clickable } = props;

  return term.vocabularies && term.vocabularies.length ? (
    <p
      className={
        "col-primary underlined" + (clickable ? " cursor-pointer" : "")
      }
      onClick={() => onVocabularyClick?.(term)}
    >
      {term.vocabularies[0].name}
    </p>
  ) : (
    ""
  );
};

export default VocabularyLabel;
