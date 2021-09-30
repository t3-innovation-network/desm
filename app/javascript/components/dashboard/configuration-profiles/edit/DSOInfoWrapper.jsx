import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import DSOMetaData from "./DSOMetadata";

const DSOInfoWrapper = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDsoIndex = useSelector((state) => state.currentDSOIndex);
  const getDsos = () => currentCP.structure.standardsOrganizations || [];

  return <DSOMetaData dsoData={getDsos()[currentDsoIndex]} />;
};

export default DSOInfoWrapper;
