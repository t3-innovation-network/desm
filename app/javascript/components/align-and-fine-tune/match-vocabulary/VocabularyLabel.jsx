import React from "react";

/**
 * Here we take the first vocabulary. This term might have more than only 1 associated,
 * but we only can match 1 vocabulary to another.
 *
 * Props:
 * @prop {Object} term
 * @prop {Function} onVocabularyClick
 * @prop {Boolean} clickable
 */
const VocabularyLabel = ({ onVocabularyClick, term }) => (
  <p
    className={
      "col-primary underlined" + (Boolean(onVocabularyClick) ? " cursor-pointer" : "")
    }
    onClick={() => onVocabularyClick?.(term)}
  >
    {term.vocabularies[0].name}
  </p>
);

export default VocabularyLabel;
