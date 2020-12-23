import React, { Component } from "react";
import TopNav from "../shared/TopNav";
import resetPassword from "../../services/resetPassword";
import AlertNotice from "../shared/AlertNotice";
import TopNavOptions from "../shared/TopNavOptions";
import { Link } from "react-router-dom";
import { toastr as toast } from "react-redux-toastr";
import queryString from "query-string";
import Loader from "./../shared/Loader";
import passwordStrength from "../../services/passwordStrength";
import { encode } from "../../helpers/Encoder";

class ResetPass extends Component {
  /**
   * Represents the state of this component.
   */
  state = {
    password: "",
    passwordConfirmation: "",
    passwordIsValid: false,
    token: "",
    errors: "",
    working: false,
  };

  /**
   * Controls the password and password confirmation matches
   */
  handlePasswordBlur = () => {
    const { password, passwordConfirmation } = this.state;

    if (
      !_.isEmpty(password) &&
      !_.isEmpty(passwordConfirmation) &&
      password != passwordConfirmation
    ) {
      this.setState({ errors: "Passwords don't match" });
      return;
    }

    this.setState({ errors: "" });
  };

  /**
   * Update the component state on every change in the input control in the form
   */
  handleOnChange = (event) => {
    const { password } = this.state;

    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      async () => {
        /**
         * The miminum acceptable password length
         */
        if (password.length - 1 > minPasswordLength) {
          let response = await passwordStrength(encode({password: password}));

          /// Manage the errors
          if (response.error) {
            this.setState({
              errors: response.error,
              working: false,
            });
            return;
          }

          /// Reset the errors in state
          this.setState({
            errors: "",
            passwordIsValid: response.valid,
          });
        }
      }
    );
  };

  /**
   * Send the data prepared in the form to the API service, and expect
   * the result to be shown to the user
   */
  handleSubmit = (event) => {
    const { password, token } = this.state;

    event.preventDefault();

    this.setState({ working: true });

    resetPassword(encode({password: password}), token).then((response) => {
      /// Manage the errors
      if (response.error) {
        this.setState({
          errors:
            response.error + "\n. We were not able to reset your password.",
          working: false,
        });
        return;
      }

      /// Reset the errors in state
      this.setState({
        errors: "",
        working: false,
      });

      /// Notify the user
      toast.success(
        "Your password was successfully updated! Please try signing in now."
      );

      /// Redirect the user to the sign in page
      this.props.history.push("/sign-in");
    });
  };

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  componentDidMount() {
    /// Get the token from the query string URL parameters
    let token = queryString.parse(this.props.location.search).token;

    this.setState({ token: token });
  }

  render() {
    /**
     * Elements from state
     */
    const {
      errors,
      password,
      passwordConfirmation,
      passwordIsValid,
      token,
      working,
    } = this.state;

    return (
      <React.Fragment>
        <div className="wrapper">
          <TopNav centerContent={this.navCenterOptions} />
          <div className="container-fluid container-wrapper">
            <div className="row mt-5">
              <div className="col-lg-6 mx-auto">
                {errors && <AlertNotice message={errors} />}

                {_.isEmpty(token) ? (
                  <AlertNotice message={"No token provided"} />
                ) : (
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-key"></i>
                      <span className="pl-2 subtitle">Reset your password</span>
                      <p>Please type a strong password below.</p>
                    </div>
                    <div className="card-body">
                      <PasswordStrengthInfo />
                      <form className="mb-3" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                          <label>
                            New Password
                            <span className="text-danger">*</span>
                          </label>
                          {passwordIsValid ? (
                            <span className="fa fa-check form-control-feedback right-aligned col-success"></span>
                          ) : (
                            ""
                          )}
                          <input
                            autoFocus
                            className="form-control"
                            name="password"
                            onBlur={this.handlePasswordBlur}
                            onChange={this.handleOnChange}
                            placeholder="Please enter your password"
                            required
                            type="password"
                            value={password}
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            Password Confirmation
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            name="passwordConfirmation"
                            onBlur={this.handlePasswordBlur}
                            onChange={this.handleOnChange}
                            placeholder="Please confirm your password"
                            required
                            type="password"
                            value={passwordConfirmation}
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-dark"
                          disabled={
                            !_.isEmpty(errors) ||
                            !passwordIsValid ||
                            _.isEmpty(password) ||
                            _.isEmpty(passwordConfirmation)
                          }
                        >
                          {working ? (
                            <Loader noPadding={true} smallSpinner={true} />
                          ) : (
                            "Reset Password"
                          )}
                        </button>
                      </form>
                      <Link className="col-primary" to={"/sign-in"}>
                        Login
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const PasswordStrengthInfo = () => {
  return (
    <div className="alert alert-dismissible alert-info">
      <h4>
        <strong>Important</strong>
      </h4>
      <p>
        We validate the password based on its deductibility. You can try a
        combination of the following suggestions:
      </p>
      <ul>
        <li>Include uppercase letter/s</li>
        <li>Include lowercase letter/s</li>
        <li>Include numbers</li>
        <li>Include symbols</li>
        <li>{"Make its length as minimum" + minPasswordLength}</li>
      </ul>
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

/**
 * The miminum acceptable password length
 */
const minPasswordLength = process.env.MIN_PASSWORD_LENGTH || 7;

export default ResetPass;
