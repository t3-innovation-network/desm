import { Component } from 'react';
import DashboardContainer from '../DashboardContainer';
import { Link } from 'react-router-dom';
import AlertNotice from '../../shared/AlertNotice';
import fetchConfigurationProfiles from '../../../services/fetchConfigurationProfiles';
import ConfigurationProfileBox from './ConfigurationProfileBox';
import { camelizeKeys } from 'humps';
import createCP from '../../../services/createCP';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import NewConfigurationProfile from './NewConfigurationProfile';

export default class ConfigurationProfilesIndex extends Component {
  state = {
    configurationProfiles: [],
    errors: '',
  };

  componentDidMount() {
    this.fetchConfigurationProfilesAPI();
  }

  dashboardPath = () => {
    return (
      <div className="float-right">
        <FontAwesomeIcon icon={faHome} />{' '}
        <span>
          <Link className="col-on-primary" to="/">
            Home
          </Link>
        </span>{' '}
        {`>`}{' '}
        <span>
          <Link className="col-on-primary" to="/dashboard">
            Dashboard
          </Link>
        </span>{' '}
        {`>`} <span>Configuration Profiles</span>
      </div>
    );
  };

  fetchConfigurationProfilesAPI() {
    fetchConfigurationProfiles().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
        });
        return;
      }
      this.setState({
        configurationProfiles: response.configurationProfiles,
      });
    });
  }

  handleCreate = () => {
    createCP().then((response) => {
      if (response.errors) {
        this.setState({
          errors: response.errors,
        });
        return;
      }

      this.props.history.push(
        `/dashboard/configuration-profiles/${response.configurationProfile.id}`
      );
    });
  };

  handleErrors = (errors) => this.setState({ errors });

  render() {
    const { configurationProfiles, errors } = this.state;

    return (
      <DashboardContainer>
        {this.dashboardPath()}

        <div className="col mt-5">
          {errors && (
            <AlertNotice message={errors} onClose={() => this.setState({ errors: null })} />
          )}
          <div className="row h-50 ml-5">
            {configurationProfiles.map((cp) => (
              <ConfigurationProfileBox
                configurationProfile={camelizeKeys(cp)}
                key={cp.id}
                onErrors={this.handleErrors}
              />
            ))}

            <NewConfigurationProfile handleCreate={this.handleCreate} />
          </div>
        </div>
      </DashboardContainer>
    );
  }
}
