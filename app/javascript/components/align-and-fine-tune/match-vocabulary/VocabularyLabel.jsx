import React from "react";

/**
 * Here we take the first vocabulary. This term might have more than only 1 associated,
 * but we only can match 1 vocabulary to another.
 *
 * Props:
 * @param {Object} term
 * @param {Function} handleMatchVocabularyClick
 * @param {Boolean} clickable
 */
const VocabularyLabel = (props) => {
  const { term, handleMatchVocabularyClick, clickable } = props;

  return term.vocabularies && term.vocabularies.length ? (
    <p
      className={
        "col-primary underlined" + (clickable ? " cursor-pointer" : "")
      }
      onClick={() => handleMatchVocabularyClick(term)}
    >
      {term.vocabularies[0].name}
    </p>
  ) : (
    ""
  );
};

export default VocabularyLabel;
