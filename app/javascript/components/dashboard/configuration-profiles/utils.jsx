import React from "react";
import moment from "moment";

export const stateStyle = (state) => {
  return {
    color: stateColorsList[state],
  };
};

const stateColorsList = {
  active: "green",
  deactivated: "grey",
  incomplete: "red",
  complete: "orange",
};

export const formatDateForInput = (dateString) => {
  return moment(dateString)
    .locale(navigator.language)
    .format(moment.HTML5_FMT.DATE);
};

export const tabStyle = { height: "30px", maxWidth: "30px" };
export const activeTabClass = "bg-dashboard-background col-background";
export const inactiveTabClass = "border-color-dashboard-dark col-dashboard";

export const line = () => {
  return <div className="col-4 border-bottom" style={{ bottom: "1rem" }}></div>;
};
