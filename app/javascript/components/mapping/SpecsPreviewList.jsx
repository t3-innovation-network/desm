import { useDispatch, useSelector } from 'react-redux';
import { setVocabularies } from '../../actions/vocabularies';
import { vocabName } from '../../helpers/Vocabularies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import pluralize from 'pluralize';

/**
 * Displays a specification and its vocabularies in the tabbed form
 *
 * Props:
 *
 * @prop {Boolean} disabled
 * @prop {int} propertiesCount
 */
const SpecsPreviewList = (props) => {
  /**
   * Elements from props
   */
  const { disabled, propertiesCount } = props;
  /**
   * The files content already merged. If its only one file, the same result.
   */
  const filteredFile = useSelector((state) => state.filteredFile);
  /**
   * The vocabularies content ready to be printed. JSON format.
   */
  const vocabularies = useSelector((state) => state.vocabularies);
  /**
   * Redux statement to be able to change the store.
   */
  const dispatch = useDispatch();

  /**
   * Remove a specific vocabulary from the collection of recognized vocabularies
   *
   * @param {Integer} i: The Vocabulary index to find in the vocabularies collection
   */
  const handleRemoveVocabulary = (i) => {
    const tempVocabularies = [...vocabularies];
    tempVocabularies.splice(i, 1);
    dispatch(setVocabularies(tempVocabularies));
  };

  return (
    <>
      <h4>
        {' '}
        Spec {' - '}
        <strong className={propertiesCount < 1 ? 'col-primary' : ''}>
          {propertiesCount + ' '}
        </strong>
        {pluralize('property', propertiesCount)}
      </h4>
      {(filteredFile['@graph'] || []).map((property, i) => {
        return (
          <div className="card mt-2 mb-2" key={i}>
            <div className="card-header">{property['@id']}</div>
          </div>
        );
      })}

      <hr />

      <h4>Vocabularies</h4>
      {vocabularies.map((vocabulary, i) => {
        return (
          <div className="card mt-2 mb-2">
            <div className="card-header d-flex justify-content-between align-items-center">
              {vocabName(vocabulary['@graph'])}
              <button
                className="btn"
                onClick={() => {
                  handleRemoveVocabulary(i);
                }}
                title="Remove this vocabulary"
                disabled={disabled}
              >
                <FontAwesomeIcon icon={faTrash} aria-hidden="true" className="cursor-pointer" />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SpecsPreviewList;
