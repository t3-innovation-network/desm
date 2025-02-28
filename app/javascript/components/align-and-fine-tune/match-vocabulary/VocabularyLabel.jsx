const VocabularyLabel = ({ onVocabularyClick, term }) => (
  <p
    className={
      'col-primary text-decoration-underline' + (onVocabularyClick ? ' cursor-pointer' : '')
    }
    onClick={() => onVocabularyClick?.(term)}
  >
    {term.vocabularies[0].name}
  </p>
);

export default VocabularyLabel;
