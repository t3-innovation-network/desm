import { Component } from 'react';
import DashboardContainer from '../dashboard/DashboardContainer';
import fetchOrganizations from '../../services/fetchOrganizations';
import fetchRoles from '../../services/fetchRoles';
import AlertNotice from '../shared/AlertNotice';
import createUser from '../../services/createUser';
import { Link } from 'react-router-dom';
import Loader from '../shared/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faHome } from '@fortawesome/free-solid-svg-icons';
import { showSuccess } from '../../helpers/Messages';

class Registration extends Component {
  state = {
    email: '',
    fullname: '',
    organization_id: '',
    role_id: '',
    organizations: [],
    roles: [],
    errors: '',
    loading: true,
  };

  componentDidMount() {
    this.fetchOrganizationsAPI();
    this.fetchRolesAPI();
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
          <Link className="col-on-primary" to="/dashboard/users">
            Users
          </Link>
        </span>{' '}
        {`>`} <span>Create</span>
      </div>
    );
  };

  fetchOrganizationsAPI() {
    this.setState({ loading: true });
    fetchOrganizations().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
          loading: false,
        });
        return;
      }
      this.setState({
        organizations: response.organizations,
        organization_id: response.organizations[0].id,
        loading: false,
      });
    });
  }

  fetchRolesAPI() {
    this.setState({ loading: true });
    fetchRoles().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
          loading: false,
        });
        return;
      }
      this.setState({
        loading: false,
        roles: response.roles,
        role_id: response.roles[0].id,
      });
    });
  }

  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    const { email, fullname, organization_id, role_id } = this.state;

    createUser(fullname, email, organization_id, role_id).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
      }
      showSuccess('User ' + fullname + ' was successfully created');
      this.props.history.push('/dashboard/users');
    });

    event.preventDefault();
  };

  render() {
    const {
      email,
      errors,
      fullname,
      loading,
      organizations,
      organization_id,
      roles,
      role_id,
    } = this.state;

    return (
      <>
        <DashboardContainer>
          {errors && <AlertNotice message={errors} onClose={() => this.setState({ errors: '' })} />}
          {this.dashboardPath()}

          {loading ? (
            <Loader />
          ) : (
            <div className="card mt-5">
              <div className="card-header">
                <FontAwesomeIcon icon={faUsers} />
                <span className="pl-2 subtitle">Create User</span>
              </div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label>
                      Fullname
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullname"
                      placeholder="Enter the fullname for the user"
                      value={fullname}
                      onChange={this.handleOnChange}
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
                      placeholder="Enter the email for the user"
                      value={email}
                      onChange={this.handleOnChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Organization
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="organization_id"
                      className="form-control"
                      required
                      value={organization_id}
                      onChange={this.handleOnChange}
                    >
                      {organizations.map(function (org) {
                        return (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      Role
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="role_id"
                      className="form-control"
                      required
                      value={role_id}
                      onChange={this.handleOnChange}
                    >
                      {roles.map(function (role) {
                        return (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <button type="submit" className="btn btn-dark">
                    Create
                  </button>
                </form>
              </div>
            </div>
          )}
        </DashboardContainer>
      </>
    );
  }
}

export default Registration;
