import { Component } from 'react';
import TopNav from '../shared/TopNav';
import forgotPassword from '../../services/forgotPassword';
import AlertNotice from '../shared/AlertNotice';
import TopNavOptions from '../shared/TopNavOptions';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import Loader from '../shared/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

class ForgotPass extends Component {
  /**
   * Represents the state of this component.
   */
  state = {
    email: '',
    errors: '',
    sending: false,
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
   * Send the data prepared in the form to the API service, and expect
   * the result to be shown to the user
   */
  handleSubmit = (event) => {
    const { email } = this.state;

    event.preventDefault();

    this.setState({ sending: true });

    forgotPassword(email).then((response) => {
      /// Manage the errors
      if (response.error) {
        this.setState({
          errors: response.error + '\n. We were not able to reset your password.',
          sending: false,
        });
        return;
      }

      /// Reset the errors in state
      this.setState({
        errors: '',
        sending: false,
      });

      /// Notify the user
      toastr.success('We sent you an email with instructions on how to reset your password');

      /// Redirect the user to home
      this.props.history.push('/');
    });
  };

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  render() {
    /**
     * Elements from state
     */
    const { email, errors, sending } = this.state;

    return (
      <>
        <TopNav centerContent={this.navCenterOptions} />
        <div className="container-fluid desm-content">
          <div className="row mt-4">
            <div className="col-lg-6 mx-auto">
              {errors && (
                <AlertNotice message={errors} onClose={() => this.setState({ errors: '' })} />
              )}

              <div className="card">
                <div className="card-header">
                  <FontAwesomeIcon icon={faKey} />
                  <span className="ps-2 subtitle">Reset Password</span>
                  <p>
                    Please type your email, and we will send you an email with instructions on how
                    to reset your password.
                  </p>
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
                        value={email}
                        onChange={this.handleOnChange}
                        required
                        autoFocus
                      />
                    </div>

                    <button type="submit" className="btn btn-dark">
                      {sending ? <Loader noPadding={true} smallSpinner={true} /> : 'Send'}
                    </button>
                  </form>
                  <Link className="col-primary" to={'/sign-in'}>
                    Login
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

export default ForgotPass;
