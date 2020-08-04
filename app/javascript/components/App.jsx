import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home/Home";
import SignIn from "../components/auth/SignIn";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Mapping from "../components/mapping/Mapping";
import MainDashboard from "../components/dashboard/MainDashboard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersIndex from '../components/dashboard/users/UsersIndex';
import EditUser from '../components/dashboard/users/EditUser';
import Registration from "./auth/Registration";
import OrganizationsIndex from '../components/dashboard/organizations/OrganizationsIndex';
import EditOrganization from '../components/dashboard/organizations/EditOrganization';
import CreateOrganization from '../components/dashboard/organizations/CreateOrganization';
import ErrorNotice from "../components/shared/ErrorNotice";
import checkLoginStatus from "./api/checkLoginStatus";
import ErrorMessage from "./helpers/errorMessage";

class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      user: {},
      errors: ""
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(data) {
    this.setState({
      loggedIn: true,
      user: data.user
    });
    toast.info("Signed In");
  }

  handleLogout() {
    this.setState({
      loggedIn: false,
      user: {},
    });
    toast.info("Signed Out");
  }

  checkLoginStatusAPI() {
    checkLoginStatus({loggedIn: this.state.loggedIn})
      .then((response) => {
        /// If we have something to change
        if (response !== undefined) {
          this.setState({
            loggedIn: response.loggedIn,
            user: response.user,
          })
        }
      })
      /// Process any server errors
      .catch((error) => {
        this.setState({
          errors: ErrorMessage(error)
        });
      });
  }

  componentDidMount() {
    this.checkLoginStatusAPI();
  }

  render() {
    return (
      <React.Fragment>
        {this.state.errors && <ErrorNotice message={this.state.errors} />}

        <Router>
          <Switch>

          <Route
              exact
              path={"/"}
              render={(props) => (
                <Home
                  {...props}
                  loggedIn={this.state.loggedIn}
                  handleLogout={this.handleLogout}
                />
              )}
            />

            <Route
              exact
              path={"/sign-in"}
              render={(props) => (
                <SignIn
                  {...props}
                  loggedIn={this.state.loggedIn}
                  handleLogin={this.handleLogin}
                  handleLogout={this.handleLogout}
                />
              )}
            />

            <Route
              exact
              path={"/new-mapping"}
              render={(props) => (
                <Mapping
                  {...props}
                  loggedIn={this.state.loggedIn}
                  handleLogout={this.handleLogout}
                />
              )}
            />

            <ProtectedRoute
              exact
              path='/dashboard'
              loggedIn={this.state.loggedIn}
              handleLogout={this.handleLogout}
              auth={this.state.loggedIn}
              component={MainDashboard}
            />

            <ProtectedRoute
              exact
              path='/dashboard/users'
              loggedIn={this.state.loggedIn}
              handleLogout={this.handleLogout}
              auth={this.state.loggedIn}
              component={UsersIndex}
            />

            <ProtectedRoute
              exact
              path='/dashboard/users/new'
              loggedIn={this.state.loggedIn}
              handleLogout={this.handleLogout}
              auth={this.state.loggedIn}
              component={Registration}
            />

            <ProtectedRoute
              exact
              path='/dashboard/users/:id'
              loggedIn={this.state.loggedIn}
              handleLogout={this.handleLogout}
              auth={this.state.loggedIn}
              component={EditUser}
            />

            <ProtectedRoute
              exact
              path='/dashboard/organizations'
              loggedIn={this.state.loggedIn}
              handleLogout={this.handleLogout}
              auth={this.state.loggedIn}
              component={OrganizationsIndex}
            />

            <ProtectedRoute
              exact
              path='/dashboard/organizations/new'
              loggedIn={this.state.loggedIn}
              handleLogout={this.handleLogout}
              auth={this.state.loggedIn}
              component={CreateOrganization}
            />

            <ProtectedRoute
              exact
              path='/dashboard/organizations/:id'
              loggedIn={this.state.loggedIn}
              handleLogout={this.handleLogout}
              auth={this.state.loggedIn}
              component={EditOrganization}
            />

          </Switch>
        </Router>
        <ToastContainer />
      </React.Fragment>
    );
  }
}

export default App;
