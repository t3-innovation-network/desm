import React from "react";

const ProgressReportBar = (props) => {
  return (
    <React.Fragment>
      <div className="progress terms-progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width:
              (props.currentValue * 100) / props.maxValue + "%",
          }}
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax={props.maxValue}
        ></div>
      </div>
      <h5>
        <strong>{props.currentValue}</strong>
        {"/" + props.maxValue + " " + props.messageReport}
      </h5>
    </React.Fragment>
  );
};

export default ProgressReportBar;
