import React from "react";
import UsersIndex from "./dashboard/users/UsersIndex";
import EditUser from "./dashboard/users/EditUser";
import Registration from "./auth/Registration";
import OrganizationsIndex from "./dashboard/organizations/OrganizationsIndex";
import EditOrganization from "./dashboard/organizations/EditOrganization";
import CreateOrganization from "./dashboard/organizations/CreateOrganization";
import Home from "./home/Home";
import SignIn from "./auth/SignIn";
import ProtectedRoute from "./auth/ProtectedRoute";
import Mapping from "./mapping/Mapping";
import MainDashboard from "./dashboard/MainDashboard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SpecList from "./specifications-list/SpecList";
import MappingToDomains from "./mapping/MappingToDomain";

const Routes = (props) => {
  let manageLogin = props.handleLogin;

  return (
    <Router>
      <Switch>
        <Route
          exact
          path={"/"}
          component={Home} />

        <Route
          exact
          path={"/sign-in"}
          render={(props) => <SignIn {...props} handleLogin={manageLogin}/>}
        />

        <ProtectedRoute
          exact
          path="/specifications"
          allowNonAdmins={true}
          component={SpecList} />

        <ProtectedRoute
          exact
          path="/new-mapping"
          allowNonAdmins={true}
          component={Mapping} />

        <ProtectedRoute
          exact
          path="/mappings/:id"
          allowNonAdmins={true}
          component={MappingToDomains} />

        <ProtectedRoute
          exact
          path="/dashboard"
          component={MainDashboard} />

        <ProtectedRoute
          exact
          path="/dashboard/users"
          component={UsersIndex} />

        <ProtectedRoute
          exact
          path="/dashboard/users/new"
          component={Registration}
        />

        <ProtectedRoute
          exact
          path="/dashboard/users/:id"
          component={EditUser}
        />

        <ProtectedRoute
          exact
          path="/dashboard/organizations"
          component={OrganizationsIndex}
        />

        <ProtectedRoute
          exact
          path="/dashboard/organizations/new"
          component={CreateOrganization}
        />

        <ProtectedRoute
          exact
          path="/dashboard/organizations/:id"
          component={EditOrganization}
        />
      </Switch>
    </Router>
  );
};

export default Routes;
