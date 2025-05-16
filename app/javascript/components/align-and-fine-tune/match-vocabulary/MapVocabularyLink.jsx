import DesmTooltip from '../../shared/Tooltip';
import { i18n } from '../../../utils/i18n';

const MapVocabularyLink = ({ disabled, onVocabularyClick, term, id }) => {
  const vocabularyButton = () => (
    <button
      className="btn btn-link p-0 col-primary"
      onClick={() => onVocabularyClick?.(term)}
      disabled={disabled}
    >
      {i18n.t('ui.mapping.vocabularies.map')}
    </button>
  );

  return disabled ? (
    <DesmTooltip id={id} title={disabled ? i18n.t('ui.mapping.vocabularies.no_vocabulary') : ''}>
      <div style={{ display: 'inline-block', cursor: 'not-allowed' }}>{vocabularyButton()}</div>
    </DesmTooltip>
  ) : (
    vocabularyButton()
  );
};

export default MapVocabularyLink;
