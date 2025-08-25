import { useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Collapse from 'react-bootstrap/Collapse';
import { setVocabularies } from '../../actions/vocabularies';
import { vocabName } from '../../helpers/Vocabularies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import pluralize from 'pluralize';

const SpecCollapseHeder = ({ id, collapsed, onToggleCollapse, children }) => {
  const clsToggle = classNames('desm-icon me-1 desm-toggle fs-3', {
    'desm-toggle--collapsed': collapsed[id],
  });

  return (
    <div
      className="d-flex justify-content-between align-items-center"
      onClick={() => onToggleCollapse(id)}
      aria-expanded={!collapsed[id]}
      role="button"
    >
      {children}
      <div className={clsToggle}>keyboard_arrow_up</div>
    </div>
  );
};

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
  const [collapsed, setCollapsed] = useState({ 'spec-list': true, 'vocabularies-list': true });
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

  const onToggleCollapse = (id) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      <SpecCollapseHeder id="spec-list" collapsed={collapsed} onToggleCollapse={onToggleCollapse}>
        <h4>
          Spec {' - '}
          <strong className={propertiesCount < 1 ? 'col-primary' : ''}>
            {propertiesCount + ' '}
          </strong>
          {pluralize('property', propertiesCount)}
          {'/'}
          {pluralize('element', propertiesCount)}
        </h4>
      </SpecCollapseHeder>
      <Collapse in={!collapsed['spec-list']}>
        <div id="spec-list">
          {(filteredFile['@graph'] || [])
            .filter((r) => /rdfs?:Property/.test(r['@type']))
            .map((property, i) => {
              return (
                <div className="card mt-2 mb-2" key={i}>
                  <div className="card-header">{property['@id']}</div>
                </div>
              );
            })}
        </div>
      </Collapse>

      <hr />

      <SpecCollapseHeder
        id="vocabularies-list"
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      >
        <h4>
          Controlled Vocabularies{' '}
          {` - ${vocabularies.length} ${pluralize('vocabulary', vocabularies.length)}`}{' '}
        </h4>
      </SpecCollapseHeder>
      <Collapse in={!collapsed['vocabularies-list']}>
        <div id="vocabularies-list">
          {vocabularies.map((vocabulary, i) => {
            const name = vocabName(vocabulary, 1);
            return (
              <div className="card mt-2 mb-2" key={name}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  {name}
                  <button
                    className="btn"
                    onClick={() => {
                      handleRemoveVocabulary(i);
                    }}
                    title="Remove this controlled vocabulary"
                    disabled={disabled}
                  >
                    <FontAwesomeIcon icon={faTrash} aria-hidden="true" className="cursor-pointer" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Collapse>
    </>
  );
};

export default SpecsPreviewList;
