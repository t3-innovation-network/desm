import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home/Home";
import SignIn from "../components/auth/SignIn";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Mapping from "../components/mapping/Mapping";
import MainDashboard from "../components/dashboard/MainDashboard";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UsersIndex from '../components/dashboard/users/UsersIndex';

class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      user: {},
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

  checkLoginStatus() {
    axios
      .get("http://localhost:3000/session_status", { withCredentials: true })
      .then((response) => {
        /// If we have no session cookie and the api tells us that the user is authenticated,
        /// let's update that information
        if (response.data.logged_in & !this.state.loggedIn) {
          this.setState({
            loggedIn: true,
            user: response.data.user,
          });
          /// If we have a session cookie, but the api responds us telling that there's no user
          /// authenticated, let's update that information according too
        } else if (!response.data.logged_in & this.state.loggedIn) {
          this.setState({
            loggedIn: false,
            user: {},
          });
        }
      })
      /// Process any server errors
      .catch((response) => {
        console.log("session error: ", error);
      });
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  render() {
    return (
      <React.Fragment>
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

          </Switch>
        </Router>
        <ToastContainer />
      </React.Fragment>
    );
  }
}

export default App;
