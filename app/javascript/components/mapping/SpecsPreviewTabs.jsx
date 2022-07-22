import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { setVocabularies } from "../../actions/vocabularies";
import { vocabName } from "../../helpers/Vocabularies";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

/**
 * Reads the file content
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

  /**
   * Remove a specific vocabulary from the collection of recognized vocabularies
   *
   * @param {Integer} i: The Vocabulary index to find in the vocabularies collection
   */
  const handleRemoveVocabulary = (i) => {
    /// Remove the vocabulary using its index in the collection
    let tempVocabularies = vocabularies;
    delete tempVocabularies[i];

    /// Refresh the UI
    dispatch(setVocabularies([]));
    dispatch(setVocabularies(tempVocabularies));
  };

  const graphFromFilteredFile = useMemo(
    () => ({ "@graph": filteredFile['@graph'] }),
    [filteredFile]
  );

  return (
    <React.Fragment>
      <Tabs
        className={"mt-3" + (disabled ? " disabled-container" : "")}
        defaultFocus={true}
        defaultIndex={0}
      >
        <TabList>
          <Tab>
            Spec {" - "}
            <strong className={propertiesCount < 1 ? "col-primary" : ""}>
              {propertiesCount + " "}
            </strong>
            properties
          </Tab>

          {vocabularies.map((content, i) => {
            return <Tab key={i}>{vocabName(content["@graph"])}</Tab>;
          })}
        </TabList>

        <TabPanel>
          <div className="card mt-2 mb-2 has-scrollbar scrollbar">
            <div className="card-body">
              <pre>
                <code>{JSON.stringify(graphFromFilteredFile, null, 2)}</code>
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
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Remove this vocabulary"
                    disabled={disabled}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      aria-hidden="true"
                      className="cursor-pointer"
                    />
                  </button>
                </div>
                <div className="card-body  has-scrollbar scrollbar">
                  <pre>
                    <code>{JSON.stringify(vocabulary, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </TabPanel>
          );
        })}
      </Tabs>
    </React.Fragment>
  );
};

export default SpecsPreviewTabs;
