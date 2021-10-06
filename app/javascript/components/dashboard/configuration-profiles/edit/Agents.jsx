import React, { Fragment } from "react";

const Agents = (props) => {
  const { agentsData } = props;

  const agentButtons = () => {
    return agentsData.map((agent, idx) => {
      return (
        <div className="col mr-3" key={idx}>
          <div className="row cursor-pointer">
            <div
              className="col-10 bg-dashboard-background col-background p-2 rounded text-center"
              style={{
                maxWidth: "150px",
                opacity: "80%",
              }}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Click to view/edit this user's information"
            >
              {agent.fullname}
            </div>
            <div
              className="col-2 bg-dashboard-background col-background p-2 rounded text-center font-weight-bold"
              style={{
                maxWidth: "30px",
                position: "relative",
                right: "5px",
              }}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Click to remove this user"
            >
              x
            </div>
          </div>
        </div>
      );
    });
  };

  const createAgent = () => {
    return (
      <div className="col bg-dashboard-background-highlight col-background p-2 rounded text-center mr-4 font-weight-bold cursor-pointer">
        +
      </div>
    );
  };

  return (
    <Fragment>
      <div className="row mt-5 ml-3">
        {agentButtons()} {createAgent()}{" "}
      </div>
      <div className="row mt-5 justify-content-center">
        <h3>Selected Agent Info</h3>
      </div>
    </Fragment>
  );
};

export default Agents;
