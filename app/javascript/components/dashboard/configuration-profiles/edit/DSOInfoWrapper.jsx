import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import DSOMetaData from "./DSOMetadata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faUsers, faFile } from "@fortawesome/free-solid-svg-icons";

const DSOInfoWrapper = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDsoIndex = useSelector((state) => state.currentDSOIndex);
  const getDsos = () => currentCP.structure.standardsOrganizations || [];
  const [currentTab, setCurrentTab] = useState(0);
  const tabStyle = { height: "30px", maxWidth: "30px" };
  const activeTabClass = "bg-dashboard-background col-background";
  const inactiveTabClass = "border-color-dashboard-dark col-dashboard";

  const tabIcon = (index, icon, text) => {
    return (
      <div
        className={`col-1 rounded-circle cursor-pointer ${
          index === currentTab ? activeTabClass : inactiveTabClass
        } p-1 text-center`}
        style={tabStyle}
        onClick={() => setCurrentTab(index)}
      >
        <FontAwesomeIcon
          icon={icon}
          data-toggle="tooltip"
          data-placement="bottom"
          title={text}
        />
      </div>
    );
  };

  const line = () => {
    return (
      <div className="col-4 border-bottom" style={{ bottom: "1rem" }}></div>
    );
  };

  const dsoInfoTabs = () => {
    return (
      <Fragment>
        <div className="row mt-5 justify-content-center">
          {tabIcon(0, faInfo, "DSO Basic Info")}
          {line()}
          {tabIcon(1, faUsers, "Agents")}
          {line()}
          {tabIcon(2, faFile, "Schema Files")}
        </div>
      </Fragment>
    );
  };

  const renderTab = () => {
    const dsoMetaData = <DSOMetaData dsoData={getDsos()[currentDsoIndex]} />;

    switch (currentTab) {
      case 0:
        return dsoMetaData;
      case 1:
        return (
          <div className="row mt-5 justify-content-center">
            <h3>Agents</h3>
          </div>
        );
      case 2:
        return (
          <div className="row mt-5 justify-content-center">
            <h3>Schema Files</h3>
          </div>
        );
      default:
        dsoMetaData;
    }
  };

  return (
    <div className="col">
      {dsoInfoTabs()}
      {renderTab()}
    </div>
  );
};

export default DSOInfoWrapper;
