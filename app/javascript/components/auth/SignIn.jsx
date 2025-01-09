import { Component } from 'react';
import TopNav from '../shared/TopNav';
import signIn from '../../services/signIn';
import AlertNotice from '../shared/AlertNotice';
import TopNavOptions from '../shared/TopNavOptions';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { isAdmin } from '../../helpers/Auth';

class SignIn extends Component {
  /**
   * Represents the state of this component. It contains all the fields that are
   * going to be sent to the API service in order to create a session
   */
  state = {
    email: '',
    password: '',
    errors: '',
  };

  /**
   * On a successfull response from the service, we go and update the store,
   * then redirect the user to home
   */
  handleSuccessfullAuth(user) {
    this.props.handleLogin(user);
    this.props.history.push(isAdmin(user) ? '/' : '/select-configuration-profile');
  }

  /**
   * Send the data prepared in the form to the API service, and expect
   * the result to be shown to the user
   */
  handleSubmit = (event) => {
    const { email, password } = this.state;

    signIn(email, password).then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error + '\nWe were not able to sign you in.',
        });
        return;
      }
      this.handleSuccessfullAuth(response.user);
    });

    event.preventDefault();
  };

  /**
   * Update the component state on every change in the input control in the form
   */
  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  render() {
    return (
      <>
        <TopNav centerContent={this.navCenterOptions} />
        <div className="container-fluid desm-content">
          <div className="row mt-4">
            <div className="col-lg-6 mx-auto">
              {this.state.errors && (
                <AlertNotice
                  message={this.state.errors}
                  onClose={() => this.setState({ errors: '' })}
                />
              )}

              <div className="card">
                <div className="card-header">
                  <FontAwesomeIcon icon={faUsers} />
                  <span className="ps-2 subtitle">Sign In</span>
                </div>
                <div className="card-body">
                  <form className="mb-3" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">
                        Email
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter your email"
                        value={this.state.email}
                        onChange={this.handleOnChange}
                        required
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Password
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Enter your password"
                        value={this.state.password}
                        onChange={this.handleOnChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-dark">
                      Sign In
                    </button>
                  </form>
                  <Link className="col-primary" to={'forgot-password'}>
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SignIn;
