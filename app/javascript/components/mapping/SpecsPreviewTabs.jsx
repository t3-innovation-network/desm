import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
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
const SpecsPreviewTabs = (props) => {
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

  const [selectedTab, setSelectedTab] = useState(0);

  /**
   * Remove a specific vocabulary from the collection of recognized vocabularies
   *
   * @param {Integer} i: The Vocabulary index to find in the vocabularies collection
   */
  const handleRemoveVocabulary = (i) => {
    const tempVocabularies = [...vocabularies];
    tempVocabularies.splice(i, 1);
    setSelectedTab(0);
    dispatch(setVocabularies(tempVocabularies));
  };

  const renderSpec = (spec) => JSON.stringify({ '@graph': spec['@graph'] }, null, 2);

  return (
    <>
      <Tabs
        className={'mt-3' + (disabled ? ' disabled-container' : '')}
        defaultFocus={true}
        defaultIndex={selectedTab}
        onSelect={(index) => setSelectedTab(index)}
      >
        <TabList>
          <Tab>
            <input checked={selectedTab === 0} className="mr-2" readOnly type="radio" />
            Spec {' - '}
            <strong className={propertiesCount < 1 ? 'col-primary' : ''}>
              {propertiesCount + ' '}
            </strong>
            {pluralize('property', propertiesCount)}
          </Tab>

          {vocabularies.map((content, i) => (
            <Tab key={i}>
              <input checked={selectedTab === i + 1} className="mr-2" readOnly type="radio" />
              {vocabName(content['@graph'])}
            </Tab>
          ))}
        </TabList>

        <TabPanel>
          <div className="card mt-2 mb-2 has-scrollbar scrollbar">
            <div className="card-body">
              <pre>
                <code>{renderSpec(filteredFile)}</code>
              </pre>
            </div>
          </div>
        </TabPanel>

        {vocabularies.map((vocabulary, i) => {
          return (
            <TabPanel key={i}>
              <div className="card mt-2 mb-2">
                <div className="card-header">
                  <button
                    className="btn float-right"
                    onClick={() => {
                      handleRemoveVocabulary(i);
                    }}
                    title="Remove this vocabulary"
                    disabled={disabled}
                  >
                    <FontAwesomeIcon icon={faTrash} aria-hidden="true" className="cursor-pointer" />
                  </button>
                </div>
                <div className="card-body  has-scrollbar scrollbar">
                  <pre>
                    <code>{renderSpec(vocabulary)}</code>
                  </pre>
                </div>
              </div>
            </TabPanel>
          );
        })}
      </Tabs>
    </>
  );
};

export default SpecsPreviewTabs;
