import React, { Component, Fragment } from "react";
import Loader from "./../../shared/Loader";
import AlertNotice from "../../shared/AlertNotice";
import EllipsisOptions from "../../shared/EllipsisOptions";
import ConfirmDialog from "../../shared/ConfirmDialog";
import { CPActionHandlerFactory } from "./CPActionHandler";
import ActivateProgress from "./ActivateProgress";

export const CPBoxContainer = (props) => {
  const { children, iconClass, sideBoxClass } = props;
  const action = props.action || (() => {});

  return (
    <div className="card mb-3 mr-3" style={{ width: "350px" }}>
      <div className="row no-gutters" style={{ height: "130px" }}>
        <div
          className={"col-md-4 p-5 cursor-pointer " + (sideBoxClass || "")}
          style={{ height: "130px" }}
          onClick={action}
        >
          <i
            className={`fas ${iconClass} fa-3x`}
            style={{ transform: "translateY(20%) translateX(-5%)" }}
          ></i>
        </div>
        <div className="col-md-8">{children}</div>
      </div>
    </div>
  );
};

const CardBody = (props) => {
  const {
    configurationProfile,
    errors,
    handleOptionSelected,
    processing,
  } = props;

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
          <h5 className="card-title box-title">{configurationProfile.name}</h5>
          {processing && <Loader noPadding={true} cssClass={"float-over"} />}
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
            disabled={processing}
          />
        </div>
      </div>
    </div>
  );
};

export default class ConfigurationProfileBox extends Component {
  state = {
    actionHandler: null,
    activating: false,
    configurationProfile: this.props.configurationProfile,
    confirmationVisible: false,
    errors: null,
    processing: false,
    removed: false,
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
    this.setState({ processing: true, confirmationVisible: false });
    actionHandler.beforeExecute(this);
    let response;

    response = await actionHandler.execute(configurationProfile.id);
    if (response.error) {
      this.setState({
        errors: response.error,
        processing: false,
        activating: false,
      });
      return;
    }

    actionHandler.handleResponse(response, this);
  }

  reloadCP(newCP) {
    this.setState({
      configurationProfile: newCP,
      errors: null,
      processing: false,
    });
  }

  handleRemoveResponse(success) {
    if (success) this.setState({ removed: true });
  }

  showActivatingProgress() {
    this.setState({ activating: true });
  }

  hideActivatingProgress() {
    this.setState({ activating: false });
  }

  render() {
    const {
      activating,
      actionHandler,
      configurationProfile,
      confirmationVisible,
      errors,
      processing,
      removed,
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
        <ActivateProgress visible={activating} />
        {removed ? (
          ""
        ) : (
          <CPBoxContainer
            sideBoxClass={`bg-dashboard-background col-background p-5 ${
              configurationProfile.state === "deactivated" || processing
                ? "disabled-container"
                : ""
            }`}
            iconClass="fa-cogs"
          >
            <CardBody
              configurationProfile={configurationProfile}
              errors={errors}
              handleOptionSelected={this.handleOptionSelected}
              processing={processing}
            />
          </CPBoxContainer>
        )}
      </Fragment>
    );
  }
}
