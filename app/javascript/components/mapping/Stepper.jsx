import React from "react";

const Stepper = (props) => {
  return (
    <React.Fragment>
      <div className="row indicator">
        <div
          className={
            "col-xs-4 indicator-step" +
            (props.stepperStep == 1 ? " complete" : "")
          }
        >
          <div className="indicator-stepnum">1. Upload Specification</div>
          <div className="progress">
            <div className="progress-bar"></div>
          </div>
          <a href="#" className="indicator-dot"></a>
        </div>

        <div
          className={
            "col-xs-4 indicator-step" +
            (props.stepperStep > 1 ? " complete" : " active")
          }
        >
          <div className="indicator-stepnum">2. Map to Domains</div>
          <div className="progress">
            <div className="progress-bar"></div>
          </div>
          <a href="#" className="indicator-dot"></a>
        </div>

        <div
          className={
            "col-xs-4 indicator-step" +
            (props.stepperStep == 3 ? " complete" : "")
          }
        >
          <div className="indicator-stepnum">3. Align and Fine Tune</div>
          <div className="progress">
            <div className="progress-bar"></div>
          </div>
          <a href="#" className="indicator-dot"></a>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Stepper;
