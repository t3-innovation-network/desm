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

export const SmallRemovableTab = (props) => {
  const {
    active,
    tabClickHandler,
    removeClickHandler,
    text,
    tooltipMsg,
  } = props;

  return (
    <div className="col mr-3 mt-3">
      <div className="row cursor-pointer" style={{ minWidth: "130px" }}>
        <div
          className={`col-10 bg-dashboard-background ${
            active ? "col-dashboard-highlight with-shadow" : "col-background"
          } p-2 rounded text-center`}
          style={{
            maxWidth: "150px",
            opacity: "80%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxHeight: "31px",
          }}
          data-toggle="tooltip"
          data-placement="bottom"
          title={tooltipMsg}
          onClick={tabClickHandler}
        >
          {text}
        </div>
        <div
          className="col-2 bg-dashboard-background col-background p-2 rounded text-center font-weight-bold"
          style={{
            maxWidth: "30px",
            position: "relative",
            right: "5px",
            maxHeight: "31px",
          }}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Click to remove this item"
          onClick={(event) => {
            event.stopPropagation();
            removeClickHandler();
          }}
        >
          x
        </div>
      </div>
    </div>
  );
};

export const SmallAddTabBtn = (props) => {
  const { onClickHandler } = props;

  return (
    <div
      className="col bg-dashboard-background-highlight col-background p-2 rounded text-center mt-3 mr-4 font-weight-bold cursor-pointer"
      style={{ maxWidth: "50px" }}
      onClick={onClickHandler}
    >
      +
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
      <div className="pl-5 pr-5 text-center font-italic">
        <h4>Couldn't find anything here!</h4>
        <p>{text}</p>
      </div>
    </Fragment>
  );
};

export const CenteredRoundedCard = (props) => {
  const { title, subtitle, children, styles = {} } = props;

  return (
    <div
      className="card"
      style={{
        ...styles,
        ...{
          borderRadius: "10px",
          height: "fit-content",
        },
      }}
    >
      <div className="card-header">
        <div className="row">
          <div className="col">
            <h1 className="col-dashboard-highlight text-center">{title}</h1>
          </div>
        </div>
      </div>
      <div className="card-body">
        {subtitle}

        {children}
      </div>
    </div>
  );
};

export const ToggleBtn = (props) => {
  const { active, onClick, text } = props;

  return (
    <div
      className={`cursor-pointer col-10 ${
        active
          ? "bg-dashboard-background-highlight col-background with-shadow"
          : "bg-dashboard-background-highlight2 col-dashboard-highlight"
      }  p-2 rounded text-center`}
      style={{
        maxWidth: "150px",
        opacity: "80%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxHeight: "31px",
      }}
      data-toggle="tooltip"
      data-placement="bottom"
      title="Upload a File"
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export const readFileContent = (file, onLoad, onError) => {
  const reader = new FileReader();

  reader.onload = () => {
    let content = reader.result;
    onLoad(content);
  };

  reader.onerror = function (e) {
    let tempErrors = errors;
    tempErrors.push("File could not be read! Code: " + e.target.error.code);
    onError(tempErrors);
  };

  reader.readAsText(file);
};
