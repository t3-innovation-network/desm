import React, { Fragment } from "react";
import moment from "moment";
import noDataImg from "./../../../../assets/images/no-data-found.png";

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

export const TabGroup = (props) => {
  const { cssClass, children, controlledSize = true } = props;
  return (
    <div
      className={`row ${
        controlledSize
          ? "row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5"
          : ""
      } ${cssClass || ""}`}
    >
      {children}
    </div>
  );
};

export const RemovableTab = (props) => {
  const {
    active,
    removeClickHandler,
    tabClickHandler,
    title,
    showCloseBtn = true,
  } = props;

  return (
    <div
      className={`col ${
        active
          ? "dashboard-active-tab border-left border-right"
          : "border bg-col-on-primary-light col-background"
      } rounded cursor-pointer pl-2 pr-2 pt-3 pb-3 text-center`}
      onClick={tabClickHandler}
      style={{
        height: "50px",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {title}
      {showCloseBtn && (
        <span
          className="font-weight-bold"
          onClick={(event) => {
            event.stopPropagation();
            removeClickHandler();
          }}
          style={{ position: "absolute", top: "0px", right: "10px" }}
        >
          x
        </span>
      )}
    </div>
  );
};

export const AddTabBtn = (props) => {
  const { onClickHandler, tooltipMsg } = props;

  return (
    <span
      className="col pl-3 pr-3 pt-3 pb-3 text-center border rounded bg-dashboard-background-highlight col-background font-weight-bold cursor-pointer"
      data-toggle="tooltip"
      data-placement="top"
      title={tooltipMsg || "Add new tab"}
      onClick={onClickHandler}
      style={{ maxWidth: "50px", fontSize: "large", height: "50px" }}
    >
      +
    </span>
  );
};

export const NoDataFound = (props) => {
  const { text } = props;

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <img src={noDataImg} alt="No data found" />
      </div>
      <div className="d-flex align-items-center justify-content-center h-100 w-100">
        <p>{text}</p>
      </div>
    </Fragment>
  );
};
