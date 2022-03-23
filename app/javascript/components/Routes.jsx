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
import SpecsList from "./specifications-list/SpecsList";
import AlignAndFineTune from "./align-and-fine-tune/AlignAndFineTune";
import MappingToDomains from "./mapping-to-domains/MappingToDomains";
import EditSpecification from "./edit-specification/EditSpecification";
import PropertyMappingList from "./property-mapping-list/PropertyMappingList";
import ForgotPass from "./auth/ForgotPass";
import ResetPass from "./auth/ResetPass";
import ConfigurationProfilesIndex from "./dashboard/configuration-profiles/ConfigurationProfilesIndex";
import EditConfigurationProfile from "./dashboard/configuration-profiles/edit/EditConfigurationProfile";
import UploadConfigurationProfile from "./dashboard/configuration-profiles/UploadConfigurationProfile";

const adminRoleName = process.env.ADMIN_ROLE_NAME || "Super Admin";
const allRoles = [adminRoleName, "Mapper", "DSO Admin", "Profile Admin"];
const onlySuperAdmin = [adminRoleName];
const onlyMappers = ["Mapper"];

const Routes = (props) => {
  const { handleLogin } = props;

  return (
    <Router>
      <Switch>
        <Route exact path={"/"} component={Home} />

        <Route
          exact
          path={"/sign-in"}
          render={(props) => <SignIn {...props} handleLogin={handleLogin} />}
        />

        <Route
          exact
          path={"/forgot-password"}
          render={(props) => (
            <ForgotPass {...props} handleLogin={handleLogin} />
          )}
        />

        <Route
          exact
          path={"/reset-password"}
          render={(props) => <ResetPass {...props} handleLogin={handleLogin} />}
        />

        <Route
          exact
          path={"/mappings-list"}
          render={(props) => (
            <PropertyMappingList {...props} handleLogin={handleLogin} />
          )}
        />

        <ProtectedRoute
          exact
          path="/mappings"
          allowedRoles={allRoles}
          component={SpecsList}
        />

        <ProtectedRoute
          exact
          path="/specifications/:id"
          allowedRoles={allRoles}
          component={EditSpecification}
        />

        <ProtectedRoute
          exact
          path="/new-mapping"
          allowedRoles={onlyMappers}
          component={Mapping}
        />

        <ProtectedRoute
          exact
          path="/mappings/:id"
          allowedRoles={onlyMappers}
          component={MappingToDomains}
        />

        <ProtectedRoute
          exact
          path="/mappings/:id/align"
          allowedRoles={onlyMappers}
          component={AlignAndFineTune}
        />

        <ProtectedRoute
          exact
          path="/dashboard"
          component={MainDashboard}
          allowedRoles={onlySuperAdmin}
        />

        <ProtectedRoute
          exact
          path="/dashboard/configuration-profiles"
          allowedRoles={onlySuperAdmin}
          component={ConfigurationProfilesIndex}
        />

        <ProtectedRoute
          exact
          path="/dashboard/configuration-profiles/new"
          allowedRoles={onlySuperAdmin}
          component={UploadConfigurationProfile}
        />

        <ProtectedRoute
          exact
          path="/dashboard/configuration-profiles/:id"
          allowedRoles={onlySuperAdmin}
          component={EditConfigurationProfile}
        />

        <ProtectedRoute
          exact
          path="/dashboard/users"
          component={UsersIndex}
          allowedRoles={onlySuperAdmin}
        />

        <ProtectedRoute
          exact
          path="/dashboard/users/new"
          allowedRoles={onlySuperAdmin}
          component={Registration}
        />

        <ProtectedRoute
          exact
          path="/dashboard/users/:id"
          allowedRoles={onlySuperAdmin}
          component={EditUser}
        />

        <ProtectedRoute
          exact
          path="/dashboard/organizations"
          allowedRoles={onlySuperAdmin}
          component={OrganizationsIndex}
        />

        <ProtectedRoute
          exact
          path="/dashboard/organizations/new"
          allowedRoles={onlySuperAdmin}
          component={CreateOrganization}
        />

        <ProtectedRoute
          exact
          path="/dashboard/organizations/:id"
          allowedRoles={onlySuperAdmin}
          component={EditOrganization}
        />
      </Switch>
    </Router>
  );
};

export default Routes;
