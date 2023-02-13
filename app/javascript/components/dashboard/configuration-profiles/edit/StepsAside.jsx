import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../../../actions/configurationProfiles";

const StepsAside = () => {
  const dispatch = useDispatch();
  const steps = [
    {
      number: 1,
      description: "General info",
    },
    {
      number: 2,
      description: "Mapping predicates",
    },
    {
      number: 3,
      description: "Abstract classes",
    },
    {
      number: 4,
      description: "DSOs",
    },
  ];

  const currentStep = useSelector((state) => state.cpStep);

  return (
    <Fragment>
      {steps.map((step) => {
        return (
          <div
            className="row cp-step-row"
            key={step.number}
          >
            <div className="col-8">{step.description}</div>
            <div
              className={`col-4 rounded-circle cursor-pointer ${
                step.number === currentStep
                  ? "bg-dashboard-background-highlight col-background"
                  : "border-color-dashboard col-dashboard-highlight"
              } p-3 text-center`}
              style={{ height: "50px", lineHeight: 1, maxWidth: "50px" }}
              onClick={() => dispatch(setStep(step.number))}
            >
              {step.number}
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default StepsAside;
