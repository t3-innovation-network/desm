import DesmTooltip from '../../shared/Tooltip';
import { i18n } from '../../../utils/i18n';

const MapVocabularyLink = ({ disabled, notPersisted, onVocabularyClick, terms, id }) => {
  const vocabularyButton = () => (
    <button
      className="btn btn-link p-0 col-primary"
      onClick={() => onVocabularyClick?.(terms)}
      disabled={disabled || notPersisted}
    >
      {i18n.t('ui.mapping.vocabularies.map')}
    </button>
  );

  return disabled || notPersisted ? (
    <DesmTooltip
      id={id}
      title={i18n.t(`ui.mapping.vocabularies.${notPersisted ? 'not_saved' : 'no_vocabulary'}`)}
    >
      <div style={{ display: 'inline-block', cursor: 'not-allowed' }}>{vocabularyButton()}</div>
    </DesmTooltip>
  ) : (
    vocabularyButton()
  );
};

export default MapVocabularyLink;
