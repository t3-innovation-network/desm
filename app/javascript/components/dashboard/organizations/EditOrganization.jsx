import { Component } from 'react';
import DashboardContainer from '../DashboardContainer';
import fetchOrganization from '../../../services/fetchOrganization';
import AlertNotice from '../../shared/AlertNotice';
import deleteOrganization from '../../../services/deleteOrganization';
import updateOrganization from '../../../services/updateOrganization';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faTrash, faHome } from '@fortawesome/free-solid-svg-icons';
import { showInfo, showSuccess } from '../../../helpers/Messages';

export default class EditOrganization extends Component {
  state = {
    errors: '',
    organization: {
      name: '',
      email: '',
    },
  };

  componentDidMount() {
    this.handleFetchOrganization();
  }

  dashboardPath = () => {
    return (
      <div className="float-right">
        <FontAwesomeIcon icon={faHome} />{' '}
        <span>
          <Link className="col-on-primary" to="/">
            Home
          </Link>
        </span>{' '}
        {`>`}{' '}
        <span>
          <Link className="col-on-primary" to="/dashboard">
            Dashboard
          </Link>
        </span>{' '}
        {`>`}{' '}
        <span>
          <Link className="col-on-primary" to="/dashboard/organizations">
            Organizations
          </Link>
        </span>{' '}
        {`>`} <span>Edit</span>
      </div>
    );
  };

  deleteOrganizationAPI() {
    const { organization } = this.state;

    deleteOrganization(organization.id).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      showInfo('Organization successfully removed');
      this.props.history.push('/dashboard/organizations');
    });
  }

  handleFetchOrganization() {
    let orgId = this.props.match.params.id;

    fetchOrganization(orgId).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      this.setState({
        organization: response.organization,
      });
    });
  }

  handleOnChange = (event) => {
    const { organization } = this.state;

    let org = organization;
    org[event.target.name] = event.target.value;

    this.setState({
      organization: org,
    });
  };

  handleSubmit = (event) => {
    const { organization } = this.state;

    updateOrganization(organization.id, {
      email: organization.email,
      name: organization.name,
    }).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      showSuccess(
        'Organization ' + organization.name + ' (' + organization.id + ') was successfully updated'
      );
      this.props.history.push('/dashboard/organizations');
    });

    event.preventDefault();
  };

  render() {
    const { errors, organization } = this.state;

    return (
      <DashboardContainer>
        {errors && (
          <AlertNotice
            message={errors}
            onClose={() =>
              this.setState({
                errors: '',
              })
            }
          />
        )}
        {this.dashboardPath()}

        <div className="card mt-5">
          <div className="card-header">
            <FontAwesomeIcon icon={faBuilding} />
            <span className="pl-2 subtitle">Organization {organization.name}</span>
            <button
              className="btn btn-dark float-right"
              title="Delete this organization"
              onClick={() => {
                this.deleteOrganizationAPI();
              }}
            >
              <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
            </button>
          </div>
          <div className="card-body">
            <>
              <div className="mandatory-fields-notice">
                <small className="form-text text-muted">
                  Fields with <span className="text-danger">*</span> are mandatory!
                </small>
              </div>

              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>
                    Name
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter the name for the organization"
                    value={organization.name}
                    onChange={(e) => this.handleOnChange(e)}
                    autoFocus
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Email
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter an email for the organization"
                    value={organization.email}
                    onChange={(e) => this.handleOnChange(e)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-dark">
                  Send
                </button>
              </form>
            </>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
