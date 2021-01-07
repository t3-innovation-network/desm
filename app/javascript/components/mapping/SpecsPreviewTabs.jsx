import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { setVocabularies } from "../../actions/vocabularies";
import { vocabName } from "../../helpers/Vocabularies";

/**
 * Reads the file content
 *
 * Props:
 *
 * @param {Boolean} disabled
 */
const SpecsPreviewTabs = (props) => {
  /**
   * Elements from props
   */
  const { disabled } = props;
  /**
   * The specifcation contents ready to preview. THese are not the files object, but its contents
   * @todo: After the refactoring to merge the files to work with only one, this ahouls be only one file
   *    content, not a collection
   */
  const previewSpecs = useSelector((state) => state.previewSpecs);
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
   * @param {Integer} i: The Vicabulary index to find in the vocabularies collection
   */
  const handleRemoveVocabulary = (i) => {
    /// Remove the vocabulary using its index in the collection
    let tempVocabularies = vocabularies;
    delete tempVocabularies[i];

    /// Refresh the UI
    dispatch(setVocabularies([]));
    dispatch(setVocabularies(tempVocabularies));
  };

  return (
    <React.Fragment>
      <Tabs
        className={"mt-3" + (disabled ? " disabled-container" : "")}
        defaultFocus={true}
        defaultIndex={0}
      >
        <TabList>
          {previewSpecs.map((content, i) => {
            return <Tab key={i}>{"Spec"}</Tab>;
          })}
          {vocabularies.map((content, i) => {
            return <Tab key={i}>{vocabName(content["@graph"])}</Tab>;
          })}
        </TabList>

        {previewSpecs.map((content, i) => {
          return (
            <TabPanel key={i}>
              <div className="card mt-2 mb-2 has-scrollbar scrollbar">
                <div className="card-body">
                  <pre>
                    <code>{content}</code>
                  </pre>
                </div>
              </div>
            </TabPanel>
          );
        })}

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
                    <i
                      className="fa fa-trash cursor-pointer"
                      aria-hidden="true"
                    ></i>
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
