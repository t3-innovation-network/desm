import React, { Component, Fragment } from "react";

export default class StepsAside extends Component {
  steps = [
    {
      number: 1,
      description: "General data about the configuration profile",
      active: true,
    },
    {
      number: 2,
      description: "Select the mapping predicates",
    },
    {
      number: 3,
      description: "Select the abstract classes",
    },
    {
      number: 4,
      description: "DSO's information",
    },
  ];

  render() {
    return (
      <Fragment>
        {this.steps.map((step) => {
          return (
            <div className="row justify-content-center h-100">
              <div className="col-8">{step.description}</div>
              <div
                className={`col-4 rounded-circle ${
                  step.active
                    ? "bg-dashboard-background-highlight col-background"
                    : "border-color-dashboard col-dashboard-highlight"
                } p-3 text-center`}
                style={{ maxWidth: "50px", height: "50px" }}
              >
                {step.number}
              </div>
            </div>
          );
        })}
      </Fragment>
    );
  }
}
