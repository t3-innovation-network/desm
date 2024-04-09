const VocabularyLabel = ({ onVocabularyClick, term }) => (
  <p
    className={'col-primary underlined' + (onVocabularyClick ? ' cursor-pointer' : '')}
    onClick={() => onVocabularyClick?.(term)}
  >
    {term.vocabularies[0].name}
  </p>
);

export default VocabularyLabel;
