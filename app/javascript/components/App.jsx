import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home/Home";
import SignIn from "../components/auth/SignIn";
import Mapping from "../components/mapping/Mapping";
import MainDashboard from "../components/dashboard/MainDashboard";
import axios from "axios";

class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      user: {},
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.setState({
      loggedIn: false,
      user: {},
    });
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

          <Route
            exact
            path={"/dashboard"}
            render={(props) => (
              <MainDashboard
                {...props}
                loggedIn={this.state.loggedIn}
              />
            )}
          />

        </Switch>
      </Router>
    );
  }
}

export default App;
