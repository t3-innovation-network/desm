import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "../components/home/Main";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Main} />
    </Switch>
  </Router>
);
