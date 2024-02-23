import React, { Component } from 'react';
import DashboardContainer from '../DashboardContainer';
import fetchOrganizations from '../../../services/fetchOrganizations';
import fetchRoles from '../../../services/fetchRoles';
import AlertNotice from '../../shared/AlertNotice';
import fetchUser from '../../../services/fetchUser';
import deleteUser from '../../../services/deleteUser';
import updateUser from '../../../services/updateUser';
import { toastr as toast } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import Loader from '../../shared/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faHome } from '@fortawesome/free-solid-svg-icons';

export default class EditUser extends Component {
  state = {
    fullname: '',
    email: '',
    organization_id: '',
    role_id: '',
    user_id: this.props.match.params.id,
    organizations: [],
    roles: [],
    errors: '',
    loading: true,
  };

  componentDidMount() {
    this.fetchUserAPI();
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
        {`>`} <span>Edit</span>
      </div>
    );
  };

  deleteUserAPI() {
    deleteUser(this.state.user_id)
      .then((response) => {
        if (response.error) {
          this.setState({
            errors: response.error,
          });
          return;
        }

        toast.info('User successfully removed');
        this.props.history.push('/dashboard/users');
      })
      .catch((error) => {});
  }

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
        roles: response.roles,
        loading: false,
      });
    });
  }

  fetchUserAPI() {
    this.setState({ loading: true });
    fetchUser(this.state.user_id).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
          loading: false,
        });
        return;
      }

      this.setState({
        fullname: response.user.fullname,
        email: response.user.email,
        organization_id: response.user.organization_id,
        role_id: response.user.role_id,
        loading: false,
      });
    });
  }

  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    const { email, fullname, organization_id, role_id, user_id } = this.state;

    updateUser(user_id, email, fullname, organization_id, role_id).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      toast.success('User ' + fullname + ' (' + user_id + ') was successfully updated');
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
        {loading ? (
          <Loader />
        ) : (
          <div className="card mt-5">
            <div className="card-header">
              <FontAwesomeIcon icon={faUser} />
              <span className="pl-2 subtitle">User {fullname}</span>
              <button
                className="btn btn-dark float-right"
                title="Delete this user"
                onClick={() => {
                  this.deleteUserAPI();
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="card-body">
              <React.Fragment>
                <div className="mandatory-fields-notice">
                  <small className="form-text text-muted">
                    Fields with <span className="text-danger">*</span> are mandatory!
                  </small>
                </div>

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
                      placeholder="Enter the email for the user"
                      value={email}
                      onChange={(e) => this.handleOnChange(e)}
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
                    Send
                  </button>
                </form>
              </React.Fragment>
            </div>
          </div>
        )}
      </DashboardContainer>
    );
  }
}
