import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home/Home";
import Mapping from "../components/mapping/Mapping";

export default (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/new-mapping" component={Mapping} />
    </Switch>
  </Router>
);
