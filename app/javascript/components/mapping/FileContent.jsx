import React from "react";
import { useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

/**
 * Reads the file content
 */
const FileContent = () => {
  const previewSpecs = useSelector((state) => state.previewSpecs);
  const vocabularies = useSelector((state) => state.vocabularies);

  return (
    <React.Fragment>
      <Tabs>
        <TabList>
          {previewSpecs.map((content, i) => {
            return <Tab key={i}>{"Spec"}</Tab>
          })}
          {vocabularies.map((content, i) => {
            return <Tab key={i}>{"Vocab " + (i + 1)}</Tab>;
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

        {vocabularies.map((content, i) => {
          return (
            <TabPanel key={i}>
              <div className="card mt-2 mb-2 has-scrollbar scrollbar">
                <div className="card-body">
                  <pre>
                    <code>{JSON.stringify(content, null, 2)}</code>
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

export default FileContent;
