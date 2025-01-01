import { Component } from 'react';
import DashboardContainer from '../DashboardContainer';
import { Link } from 'react-router-dom';
import fetchUsers from '../../../services/fetchUsers';
import AlertNotice from '../../shared/AlertNotice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlusCircle, faPencilAlt, faHome } from '@fortawesome/free-solid-svg-icons';

export default class UsersIndex extends Component {
  state = {
    users: [],
    errors: '',
  };

  componentDidMount() {
    this.fetchUsersAPI();
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
        {`>`} <span>Users</span>
      </div>
    );
  };

  fetchUsersAPI() {
    fetchUsers().then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      this.setState({
        users: response.users,
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
            <FontAwesomeIcon icon={faUsers} />
            <span className="ps-2 subtitle">Users</span>
            <Link to="/dashboard/users/new" className="float-end btn btn-dark btn-sm">
              <FontAwesomeIcon icon={faPlusCircle} />
              <span className="ps-2">Add User</span>
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Fullname</th>
                    <th>Email</th>
                    <th>Organization</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.users.map(function (user) {
                    return (
                      <tr key={user.id}>
                        <td>{user.fullname}</td>
                        <td>{user.email}</td>
                        <td>{user.organization?.name}</td>
                        <td>
                          <Link to={'/dashboard/users/' + user.id} className="btn btn-dark">
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
