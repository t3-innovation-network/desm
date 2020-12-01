import React from "react";

/**
 * Draws a progress bar with values the user provides. It can print a message too.
 *
 * Props:
 * @param {String} cssClass
 * @param {Integer} currentValue
 * @param {Integer} maxValue
 * @param {String} messageReport
 * @param {Boolean} percentageMode
 */
const ProgressReportBar = (props) => {
  /**
   * Elements from props
   */
  const {
    currentValue,
    maxValue,
    messageReport,
    percentageMode,
    cssClass,
  } = props;

  return (
    <React.Fragment>
      <div className="progress terms-progress">
        <div
          className={"progress-bar" + (cssClass ? " " + cssClass : "")}
          role="progressbar"
          style={{
            width: (currentValue * 100) / maxValue + "%",
          }}
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax={maxValue}
        ></div>
      </div>
      {percentageMode ? (
        <h5 className="mt-2">
          <strong>{(currentValue * 100) / maxValue + "%"}</strong>
        </h5>
      ) : (
        <h5>
          <strong>{currentValue}</strong>
          {"/" + maxValue + (messageReport ? " " + messageReport : "")}
        </h5>
      )}
    </React.Fragment>
  );
};

export default ProgressReportBar;
