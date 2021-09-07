import React, { Component, Fragment } from "react";
import AlertNotice from "../../shared/AlertNotice";
import EllipsisOptions from "../../shared/EllipsisOptions";
import ConfirmDialog from "../../shared/ConfirmDialog";
import { CPActionHandlerFactory } from "./CPActionHandler";

const CardBody = (props) => {
  const { configurationProfile, errors, handleOptionSelected } = props;

  const cpStateOptions = {
    active: [
      { id: 3, name: "deactivate" },
      { id: 4, name: "export" },
      { id: 5, name: "remove" },
    ],
    complete: [
      { id: 1, name: "activate" },
      { id: 4, name: "export" },
      { id: 5, name: "remove" },
    ],
    deactivated: [
      { id: 1, name: "activate" },
      { id: 4, name: "export" },
      { id: 5, name: "remove" },
    ],
    incomplete: [
      { id: 2, name: "complete" },
      { id: 4, name: "export" },
      { id: 5, name: "remove" },
    ],
  };

  const stateColor = (state) => {
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

  const totalAgents = () => {
    return (
      configurationProfile.structure?.standardsOrganizations?.reduce(
        (sum, org) => sum + org.dsoAgents.length,
        0
      ) || 0
    );
  };

  return (
    <div className="card-body">
      <div className="row no-gutters">
        <div className="col-md-10">
          <h5 className="card-title">{configurationProfile.name}</h5>
          <p
            className="card-text mb-0"
            style={stateColor(configurationProfile.state)}
          >
            {_.capitalize(configurationProfile.state)}
          </p>
          <p className="card-text mb-0">{totalAgents() + " agents"}</p>
          <p className="card-text">
            <small className="text-muted">
              {new Date(configurationProfile.createdAt).toLocaleString("en-US")}
            </small>
          </p>
          {errors && <AlertNotice message={errors} />}
        </div>
        <div className="col-md-2">
          <EllipsisOptions
            options={cpStateOptions[configurationProfile.state]}
            onOptionSelected={handleOptionSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default class ConfigurationProfileBox extends Component {
  state = {
    configurationProfile: this.props.configurationProfile,
    errors: null,
    confirmationVisible: false,
    actionHandler: null,
  };

  handleOptionSelected = async (option) => {
    let handler = new CPActionHandlerFactory(option.name).get();

    this.setState(
      {
        actionHandler: handler,
      },
      () => {
        if (this.state.actionHandler.needsConfirmation) {
          this.setState({ confirmationVisible: true });
          return;
        }

        this.handleExecuteAction();
      }
    );
  };

  async handleExecuteAction() {
    const { actionHandler, configurationProfile } = this.state;

    let response = await actionHandler.execute(configurationProfile.id);

    if (response.error) {
      this.setState({ errors: response.error, confirmationVisible: false });
      return;
    }

    actionHandler.handleResponse(response, this);
  }

  reloadCP(newCP) {
    this.setState({
      configurationProfile: newCP,
      errors: null,
      confirmationVisible: false,
    });
  }

  render() {
    const {
      actionHandler,
      configurationProfile,
      confirmationVisible,
      errors,
    } = this.state;

    return (
      <Fragment>
        {confirmationVisible && (
          <ConfirmDialog
            onRequestClose={() => this.setState({ confirmationVisible: false })}
            onConfirm={() => this.handleExecuteAction()}
            visible={confirmationVisible}
          >
            <h2 className="text-center">Attention!</h2>
            <h5 className="mt-3 text-center">
              {" "}
              {actionHandler.confirmationMsg}
            </h5>
          </ConfirmDialog>
        )}
        <div className="card mb-3" style={{ maxWidth: "540px" }}>
          <div className="row no-gutters">
            <div
              className={`col-md-4 bg-dashboard-background col-background p-5 ${
                configurationProfile.state === "deactivated"
                  ? "disabled-container"
                  : ""
              }`}
            >
              <i
                className="fa fa-cogs fa-3x"
                style={{ transform: "translateY(30%)" }}
              ></i>
            </div>
            <div className="col-md-8">
              <CardBody
                configurationProfile={configurationProfile}
                errors={errors}
                handleOptionSelected={this.handleOptionSelected}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
