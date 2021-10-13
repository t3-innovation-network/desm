import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import DSOMetaData from "./DSOMetadata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faUsers, faFile } from "@fortawesome/free-solid-svg-icons";
import { activeTabClass, inactiveTabClass, line, tabStyle } from "../utils";
import Agents from "./Agents";
import SchemaFiles from "./SchemaFiles";

const DSOInfoWrapper = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDsoIndex = useSelector((state) => state.currentDSOIndex);
  const getDsos = () => currentCP.structure.standardsOrganizations || [];
  const [currentTab, setCurrentTab] = useState(0);

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

  const dsoInfoTabs = () => {
    return (
      <Fragment>
        <div className="row justify-content-center">
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
        return <Agents />;
      case 2:
        return <SchemaFiles />;
      default:
        dsoMetaData;
    }
  };

  return (
    <Fragment>
      {dsoInfoTabs()}
      {renderTab()}
    </Fragment>
  );
};

export default DSOInfoWrapper;
