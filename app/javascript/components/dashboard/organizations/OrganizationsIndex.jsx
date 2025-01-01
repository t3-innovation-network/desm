import { Component } from 'react';
import DashboardContainer from '../DashboardContainer';
import { Link } from 'react-router-dom';
import fetchOrganizations from '../../../services/fetchOrganizations';
import AlertNotice from '../../shared/AlertNotice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faPlusCircle, faPencilAlt, faHome } from '@fortawesome/free-solid-svg-icons';

export default class OrganizationsIndex extends Component {
  state = {
    organizations: [],
    errors: '',
  };

  componentDidMount() {
    this.fetchOrganizationsAPI();
  }

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
        {`>`} <span>Organizations</span>
      </div>
    );
  };

  fetchOrganizationsAPI() {
    fetchOrganizations().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
        });
        return;
      }
      this.setState({
        organizations: response.organizations,
      });
    });
  }

  render() {
    return (
      <DashboardContainer>
        {this.state.errors && (
          <AlertNotice
            message={this.state.errors}
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
            <span className="ps-2 subtitle">Organizations</span>
            <Link to="/dashboard/organizations/new" className="float-end btn btn-dark btn-sm">
              <FontAwesomeIcon icon={faPlusCircle} />
              <span className="ps-2">Add Organization</span>
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.organizations.map(function (organization) {
                    return (
                      <tr key={organization.id}>
                        <td>{organization.name}</td>
                        <td>{organization.email}</td>
                        <td>
                          <Link
                            to={'/dashboard/organizations/' + organization.id}
                            className="btn btn-dark"
                          >
                            <FontAwesomeIcon icon={faPencilAlt} aria-hidden="true" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
