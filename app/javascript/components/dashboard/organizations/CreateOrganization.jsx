import { Component } from 'react';
import DashboardContainer from '../DashboardContainer';
import createOrganization from '../../../services/createOrganization';
import AlertNotice from '../../shared/AlertNotice';
import { Link } from 'react-router-dom';
import { faBuilding, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { showSuccess } from '../../../helpers/Messages';

export default class CreateOrganization extends Component {
  state = {
    errors: '',
    organization: {
      name: '',
      email: '',
    },
  };

  dashboardPath = () => {
    return (
      <div className="float-end">
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
        {`>`} <span>Create</span>
      </div>
    );
  };

  handleSubmit = async (event) => {
    const { organization } = this.state;

    event.preventDefault();

    let response = await createOrganization(organization);

    if (response.error) {
      this.setState({
        errors: response.error,
      });
      return;
    }

    if (response.success) {
      showSuccess('Organization ' + organization.name + ' was successfully created');
      this.props.history.push('/dashboard/organizations');
      return;
    }
  };

  handleOnChange = (event) => {
    const { organization } = this.state;

    let org = organization;
    org[event.target.name] = event.target.value;

    this.setState({
      organization: org,
    });
  };

  render() {
    const { errors, organization } = this.state;

    return (
      <>
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
              <span className="ps-2 subtitle">Create Organization</span>
            </div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Name
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter a name for this organization"
                    value={organization.name}
                    onChange={this.handleOnChange}
                    autoFocus
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
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
                  Create
                </button>
              </form>
            </div>
          </div>
        </DashboardContainer>
      </>
    );
  }
}
