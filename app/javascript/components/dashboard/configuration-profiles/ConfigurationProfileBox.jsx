import { Component } from 'react';
import Loader from './../../shared/Loader';
import EllipsisOptions from '../../shared/EllipsisOptions';
import ConfirmDialog from '../../shared/ConfirmDialog';
import { CPActionHandlerFactory } from './CPActionHandler';
import ActivateProgress from './ActivateProgress';
import { Link } from 'react-router-dom';
import { stateStyle } from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { camelizeKeys } from 'humps';

export const CPBoxContainer = ({ action, children, icon, linkTo, sideBoxClass }) => (
  <div className="col-12 col-lg-6 col-xl-4 mb-3">
    <div className="card h-100">
      <div className="row h-100 no-gutters">
        <div
          className={
            'col-md-4 cursor-pointer d-flex justify-content-center align-items-center ' +
            (sideBoxClass || '')
          }
          onClick={action}
        >
          {linkTo ? (
            <Link className="col-background" to={linkTo}>
              {icon}
            </Link>
          ) : (
            icon
          )}
        </div>
        <div className="col-md-8">{children}</div>
      </div>
    </div>
  </div>
);

const CardBody = (props) => {
  const { configurationProfile, errors, handleOptionSelected, linkTo, processing } = props;

  const cpStateOptions = {
    active: [
      { id: 3, name: 'deactivate' },
      { id: 4, name: 'export' },
      { id: 5, name: 'remove' },
    ],
    complete: [
      { id: 1, name: 'activate' },
      { id: 4, name: 'export' },
      { id: 5, name: 'remove' },
    ],
    deactivated: [
      { id: 1, name: 'activate' },
      { id: 4, name: 'export' },
      { id: 5, name: 'remove' },
    ],
    incomplete: [
      { id: 2, name: 'complete' },
      { id: 4, name: 'export' },
      { id: 5, name: 'remove' },
    ],
  };

  const totalAgents = () =>
    new Set(
      configurationProfile.structure?.standardsOrganizations
        ?.map((o) => (o?.dsoAgents || []).map((a) => a.email))
        ?.flat() || []
    ).size;

  return (
    <div className="card-body">
      <div className="row no-gutters">
        <div className="col-md-10">
          <Link className="col-on-primary" to={linkTo} style={{ textDecoration: 'none' }}>
            <h5 className="card-title">{configurationProfile.name}</h5>
          </Link>
          {processing && <Loader noPadding={true} cssClass={'float-over'} />}
          <p className="card-text mb-0" style={stateStyle(configurationProfile.state)}>
            {_.capitalize(configurationProfile.state)}
          </p>
          <p className="card-text mb-0">{totalAgents() + ' agent(s)'}</p>
          <p className="card-text">
            <small className="text-muted">
              {new Date(configurationProfile.createdAt).toLocaleString('en-US')}
            </small>
          </p>
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
      this.setState({ activating: false, processing: false });
      this.props.onErrors(response.error);
      return;
    }

    actionHandler.handleResponse(response, this);
  }

  reloadCP(newCP) {
    this.setState({
      configurationProfile: camelizeKeys(newCP),
      processing: false,
    });

    this.props.onErrors(null);
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

  stopProcessing() {
    this.setState({ processing: false });
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
      <>
        {confirmationVisible && (
          <ConfirmDialog
            onRequestClose={() => this.setState({ confirmationVisible: false })}
            onConfirm={() => this.handleExecuteAction()}
            visible={confirmationVisible}
          >
            <h2 className="text-center">Attention!</h2>
            <h5 className="mt-3 text-center"> {actionHandler.confirmationMsg}</h5>
          </ConfirmDialog>
        )}
        <ActivateProgress visible={activating} />
        {removed ? (
          ''
        ) : (
          <CPBoxContainer
            sideBoxClass={`bg-dashboard-background ${
              configurationProfile.state === 'deactivated' || processing ? 'disabled-container' : ''
            }`}
            icon={<FontAwesomeIcon icon={faCogs} className="fa-3x" />}
            linkTo={`/dashboard/configuration-profiles/${configurationProfile.id}`}
          >
            <CardBody
              configurationProfile={configurationProfile}
              errors={errors}
              handleOptionSelected={this.handleOptionSelected}
              processing={processing}
              linkTo={`/dashboard/configuration-profiles/${configurationProfile.id}`}
            />
          </CPBoxContainer>
        )}
      </>
    );
  }
}
