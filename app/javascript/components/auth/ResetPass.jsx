import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import TopNav from '../shared/TopNav';
import resetPassword from '../../services/resetPassword';
import AlertNotice from '../shared/AlertNotice';
import TopNavOptions from '../shared/TopNavOptions';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import Loader from './../shared/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faCheck } from '@fortawesome/free-solid-svg-icons';
import { showSuccess } from '../../helpers/Messages';

const ResetPass = (props) => {
  /**
   * Represents the state of this component.
   */
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordIsValid] = useState(false);
  const [token, setToken] = useState('');
  const [errors, setErrors] = useState('');
  const [working, setWorking] = useState(false);

  /**
   * Controls the password and password confirmation matches
   */
  const handlePasswordBlur = () => {
    if (!isEmpty(password) && !isEmpty(passwordConfirmation) && password != passwordConfirmation) {
      setErrors("Passwords don't match");
      return;
    }

    setErrors('');
  };

  /**
   * Send the data prepared in the form to the API service, and expect
   * the result to be shown to the user
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    setWorking(true);

    resetPassword({ password: password }, token).then((response) => {
      /// Manage the errors
      if (response.error) {
        setErrors(response.error + '\n. We were not able to reset your password.');
        setWorking(false);
        return;
      }

      /// Reset the errors in state
      setErrors('');
      setWorking(false);

      /// Notify the user
      showSuccess('Your password was successfully updated! Please try signing in now.');

      /// Redirect the user to the sign in page
      props.history.push('/sign-in');
    });
  };

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  useEffect(() => {
    /// Get the token from the query string URL parameters
    let token = queryString.parse(props.location.search).token;

    setToken(token);
  }, []);

  return (
    <>
      <TopNav centerContent={navCenterOptions} />
      <div className="container-fluid desm-content">
        <div className="row mt-4">
          <div className="col-lg-6 mx-auto">
            {errors && <AlertNotice message={errors} onClose={() => setErrors('')} />}

            {isEmpty(token) ? (
              <AlertNotice message={'No token provided'} />
            ) : (
              <div className="card">
                <div className="card-header">
                  <FontAwesomeIcon icon={faKey} />
                  <span className="ps-2 subtitle">Set up your password</span>
                  <p>Please type a strong password below.</p>
                </div>
                <div className="card-body">
                  <PasswordStrengthInfo />
                  <form className="mb-3" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">
                        New Password
                        <span className="text-danger">*</span>
                      </label>
                      {passwordIsValid ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="form-control-feedback right-aligned col-success"
                        />
                      ) : (
                        ''
                      )}
                      <input
                        autoFocus
                        className="form-control"
                        name="password"
                        onBlur={handlePasswordBlur}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Please enter your password"
                        required
                        type="password"
                        value={password}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Password Confirmation
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        name="passwordConfirmation"
                        onBlur={handlePasswordBlur}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Please confirm your password"
                        required
                        type="password"
                        value={passwordConfirmation}
                      />
                    </div>

                    <button type="submit" className="btn btn-dark">
                      {working ? <Loader noPadding={true} smallSpinner={true} /> : 'Set Password'}
                    </button>
                  </form>
                  <Link className="col-primary" to={'/sign-in'}>
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const PasswordStrengthInfo = () => {
  return (
    <div className="alert alert-dismissible alert-info">
      <h4>
        <strong>Important</strong>
      </h4>
      <p>We require secure passwords. You can try a combination of the following suggestions:</p>
      <ul>
        <li>Include uppercase letter/s</li>
        <li>Include lowercase letter/s</li>
        <li>Include numbers</li>
        <li>Include symbols</li>
        <li>{'Make its length as minimum ' + minPasswordLength}</li>
      </ul>
      <button type="button" className="btn-close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

/**
 * The miminum acceptable password length
 */
// TODO: check if it'll work the same way if to move from webpacker
const minPasswordLength = process.env.MIN_PASSWORD_LENGTH || 7; // eslint-disable-line no-undef

export default ResetPass;
