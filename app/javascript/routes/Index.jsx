import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "../components/home/Main";
import Mapping from "../components/mapping/Main";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Main} />
      <Route path="/mapping/new" exact component={Mapping} />
    </Switch>
  </Router>
);
