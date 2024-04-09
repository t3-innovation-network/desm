import { Component, useState } from 'react';
import DashboardContainer from '../DashboardContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import AlertNotice from '../../shared/AlertNotice';
import { downloadFile } from '../../../helpers/Export';
import fetchValidSchema from '../../../services/fetchValidSchema';
import { CenteredRoundedCard } from './utils';
import UploadConfigurationProfileForm from './UploadConfigurationProfileForm';

const UploadByUrlForm = () => {
  return (
    <div className="col">
      <h2>Upload a file from a URL</h2>
    </div>
  );
};

const UploadZone = () => {
  const [mode, setMode] = useState('upload');

  const uploadForm = () => <UploadConfigurationProfileForm />;

  return (
    <div className="col mr-3">
      <div className="row">{uploadForm()}</div>
    </div>
  );
};

class UploadConfigurationProfile extends Component {
  state = {
    errors: [],
  };

  anyError(response, errorsList = this.state.errors) {
    if (response.error) {
      this.setState({
        errors: [...errorsList, response.error],
      });
    }
    return !_.isUndefined(response.error);
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
        {`>`} <span>Configuration Profiles</span> {`>`} <span>New</span>
      </div>
    );
  };

  handleDownloadSchema = async () => {
    let response = await fetchValidSchema();

    if (!this.anyError(response)) {
      downloadFile(response.validSchema);
    }
  };

  cardSubtitle = () => {
    return (
      <p className="text-center" style={{ fontStyle: 'italic' }}>
        Upload a previously exported configuration profile.
      </p>
    );
  };

  render() {
    const { errors } = this.state;

    return (
      <DashboardContainer>
        {this.dashboardPath()}

        <div className="col">
          {errors.length ? (
            <AlertNotice message={errors} onClose={() => this.setState({ errors: [] })} />
          ) : (
            ''
          )}
          <div className="row h-50 justify-content-center">
            <CenteredRoundedCard
              title="Import a configuration profile"
              subtitle={this.cardSubtitle()}
            >
              <UploadZone />
            </CenteredRoundedCard>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}

export default UploadConfigurationProfile;
