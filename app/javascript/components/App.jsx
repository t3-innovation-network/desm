import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home/Home";
import SignIn from "../components/auth/SignIn";
import Mapping from "../components/mapping/Mapping";
import MainDashboard from "../components/dashboard/MainDashboard";

class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedIn: "NOT_NOT_LOGGED_IN",
      user: {}
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path={"/"} component={Home} />
          <Route exact path={"/sign-in"} component={SignIn} />
          <Route
            exact
            path={"/new-mapping"}
            render={ props => (
              <Mapping {...props} loggedIn={this.state.loggedIn} />
            )}
          />
          <Route
            exact
            path={"/dashboard"}
            render={ props => (
              <MainDashboard {...props} loggedIn={this.state.loggedIn} />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
