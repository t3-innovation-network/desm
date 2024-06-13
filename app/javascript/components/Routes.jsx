import AgentsIndex from './dashboard/agents/AgentsIndex';
import UsersIndex from './dashboard/users/UsersIndex';
import EditUser from './dashboard/users/EditUser';
import Registration from './auth/Registration';
import OrganizationsIndex from './dashboard/organizations/OrganizationsIndex';
import EditOrganization from './dashboard/organizations/EditOrganization';
import CreateOrganization from './dashboard/organizations/CreateOrganization';
import Home from './home/Home';
import SignIn from './auth/SignIn';
import RouteWithTitle from './auth/RouteWithTitle';
import ProtectedRoute from './auth/ProtectedRoute';
import Mapping from './mapping/Mapping';
import MainDashboard from './dashboard/MainDashboard';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import SpecsList from './specifications-list/SpecsList';
import AlignAndFineTune from './align-and-fine-tune/AlignAndFineTune';
import MappingToDomains from './mapping-to-domains/MappingToDomains';
import EditSpecification from './edit-specification/EditSpecification';
import EditMappingProperties from './edit-specification/EditMappingProperties';
import PropertyMappingList from './property-mapping-list/PropertyMappingList';
import ForgotPass from './auth/ForgotPass';
import ResetPass from './auth/ResetPass';
import ConfigurationProfilesIndex from './dashboard/configuration-profiles/ConfigurationProfilesIndex';
import EditConfigurationProfile from './dashboard/configuration-profiles/edit/EditConfigurationProfile';
import UploadConfigurationProfile from './dashboard/configuration-profiles/UploadConfigurationProfile';
import SelectConfigurationProfile from './auth/SelectConfigurationProfile';
import EditProfile from './auth/EditProfile';
import Admins from '../components/dashboard/admins/Admins';

// TODO: check if it'll work the same way if to move from webpacker
const adminRoleName = process.env.ADMIN_ROLE_NAME || 'Super Admin'; // eslint-disable-line no-undef
const allRoles = [adminRoleName, 'Mapper', 'DSO Admin', 'Profile Admin'];
const onlySuperAdmin = [adminRoleName];
const onlyMappers = ['Mapper'];
export const MAPPING_PATH_BY_STATUS = {
  ready_to_upload: 'upload',
  uploaded: 'map',
  in_progress: 'align',
};

const Routes = (props) => {
  const { handleLogin } = props;

  return (
    <Router>
      <Switch>
        <RouteWithTitle exact path={'/'} component={Home} />

        <RouteWithTitle
          exact
          path={'/sign-in'}
          pageType="sign-in"
          render={(props) => <SignIn {...props} handleLogin={handleLogin} />}
        />

        <RouteWithTitle
          exact
          path={'/forgot-password'}
          render={(props) => <ForgotPass {...props} handleLogin={handleLogin} />}
        />

        <RouteWithTitle
          exact
          path={'/reset-password'}
          render={(props) => <ResetPass {...props} handleLogin={handleLogin} />}
        />

        <RouteWithTitle
          exact
          path={'/mappings-list'}
          pageType="mappings-list"
          render={(props) => <PropertyMappingList {...props} handleLogin={handleLogin} />}
        />

        <ProtectedRoute
          exact
          path="/mappings"
          allowedRoles={onlyMappers}
          pageType="mappings"
          component={SpecsList}
        />

        <ProtectedRoute
          exact
          path="/specifications/:id"
          allowedRoles={allRoles}
          pageType="spine-properties"
          component={EditSpecification}
        />

        <ProtectedRoute
          exact
          path="/new-mapping"
          allowedRoles={onlyMappers}
          pageType="mapping-new"
          component={Mapping}
        />

        <ProtectedRoute
          exact
          path={`/mappings/:id/${MAPPING_PATH_BY_STATUS['ready_to_upload']}`}
          allowedRoles={onlyMappers}
          pageType="mapping-ready-to-upload"
          component={Mapping}
        />

        <ProtectedRoute
          exact
          path={`/mappings/:id/${MAPPING_PATH_BY_STATUS['uploaded']}`}
          allowedRoles={onlyMappers}
          pageType="mapping-to-domains"
          component={MappingToDomains}
        />

        <ProtectedRoute
          exact
          path={`/mappings/:id/${MAPPING_PATH_BY_STATUS['in_progress']}`}
          allowedRoles={onlyMappers}
          pageType="mapping-align"
          component={AlignAndFineTune}
        />

        <ProtectedRoute
          exact
          path="/mappings/:id/properties"
          allowedRoles={onlyMappers}
          pageType="mapping-properties"
          component={EditMappingProperties}
        />

        <ProtectedRoute
          exact
          path="/dashboard"
          component={MainDashboard}
          allowedRoles={onlySuperAdmin}
        />

        <ProtectedRoute
          allowedRoles={onlySuperAdmin}
          component={Admins}
          exact
          path="/dashboard/admins"
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
          path="/dashboard/agents"
          component={AgentsIndex}
          allowedRoles={onlySuperAdmin}
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

        <ProtectedRoute
          allowedRoles={allRoles}
          component={SelectConfigurationProfile}
          exact
          path="/select-configuration-profile"
        />

        <ProtectedRoute
          allowedRoles={allRoles}
          component={EditProfile}
          exact
          path="/edit-profile"
        />
      </Switch>
    </Router>
  );
};

export default Routes;
