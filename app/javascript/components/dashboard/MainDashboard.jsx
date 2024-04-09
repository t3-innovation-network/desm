import { Component } from 'react';
import DashboardContainer from './DashboardContainer';
import AlertNotice from '../shared/AlertNotice';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import fetchConfigurationProfiles from '../../services/fetchConfigurationProfiles';
import fetchMappings from '../../services/fetchMappings';

export default class MainDashboard extends Component {
  state = {
    configurationProfiles: [],
    errors: '',
    filterOptions: [
      { id: 1, name: 'All' },
      { id: 2, name: 'Incomplete' },
      { id: 3, name: 'Complete' },
      { id: 4, name: 'Active' },
      { id: 5, name: 'Deactivated' },
    ],
    mappings: [],
    selectedOptionId: 1,
  };

  dashboardPath = () => {
    return (
      <div className="float-right">
        <FontAwesomeIcon icon={faHome} className="mr-2" />{' '}
        <span>
          <Link className="col-on-primary" to="/">
            Home
          </Link>
        </span>{' '}
        {`>`} <span>Dashboard</span>
      </div>
    );
  };

  fetchConfigurationProfilesAPI() {
    fetchConfigurationProfiles().then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      this.setState({
        configurationProfiles: response.configurationProfiles,
      });
    });
  }

  fetchMappingsAPI() {
    fetchMappings().then((response) => {
      if (response.error) {
        this.setState({
          errors: response.error,
        });
        return;
      }
      this.setState({
        mappings: response.mappings,
      });
    });
  }

  fetchData() {
    this.fetchConfigurationProfilesAPI();
    this.fetchMappingsAPI();
  }

  componentDidMount() {
    this.fetchData();
  }

  filteredCps = () => {
    switch (this.state.selectedOptionId) {
      case '1':
        return this.state.configurationProfiles;
      case '2':
        return this.state.configurationProfiles.filter((cp) => cp.state === 'incomplete');
      case '3':
        return this.state.configurationProfiles.filter((cp) => cp.state === 'complete');
      case '4':
        return this.state.configurationProfiles.filter((cp) => cp.state === 'active');
      case '5':
        return this.state.configurationProfiles.filter((cp) => cp.state === 'deactivated');
      default:
        return this.state.configurationProfiles;
    }
  };

  dsosCount = () =>
    this.filteredCps()
      .map((cp) => cp.structure.standardsOrganizations?.length || 0)
      .reduce((a, b) => a + b, 0);

  cpsCount = () => this.filteredCps().length;

  agentsCount = () =>
    this.filteredCps()
      .map((cp) =>
        (cp.structure.standardsOrganizations || [])
          .map((dso) => dso.dsoAgents?.length || 0)
          .reduce((a, b) => a + b, 0)
      )
      .reduce((a, b) => a + b, 0);

  activeMappingsCount = () =>
    this.state.mappings.filter((mapping) => mapping['in_progress?']).length;

  schemesCount = () =>
    this.filteredCps()
      .map((cp) =>
        (cp.structure.standardsOrganizations || [])
          .map((dso) => dso.associatedSchemas?.length || 0)
          .reduce((a, b) => a + b, 0)
      )
      .reduce((a, b) => a + b, 0);

  render() {
    const { errors, filterOptions } = this.state;

    return (
      <DashboardContainer>
        {this.dashboardPath()}
        <div className="col col-md-10 mt-5">
          <div className="row h-50 ml-5">
            <div className="col-3 py-3">
              <div
                className="form-group"
                onChange={(e) => {
                  this.setState({ selectedOptionId: e.target.value });
                }}
              >
                {filterOptions.map(function (opt) {
                  return (
                    <div key={opt.id}>
                      <input
                        type="radio"
                        value={opt.id}
                        name="filterOption"
                        id={`filterOption-${opt.id}`}
                        required={true}
                        defaultChecked={opt.id === 1}
                      />
                      <label className="ml-2 cursor-pointer" htmlFor={`filterOption-${opt.id}`}>
                        {opt.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-9">
              {errors && (
                <AlertNotice message={errors} onClose={() => this.setState({ errors: '' })} />
              )}

              <div className="row">
                <div className="col-xl-3 col-sm-6 py-2">
                  <InfoBox count={this.cpsCount()} text={'Configuration Profiles'} />
                </div>

                <div className="col-xl-3 col-sm-6 py-2">
                  <InfoBox count={this.dsosCount()} text={'Data Standards Organizations'} />
                </div>

                <div className="col-xl-3 col-sm-6 py-2">
                  <InfoBox count={this.agentsCount()} text={'Agents'} />
                </div>

                <div className="col-xl-3 col-sm-6 py-2">
                  <InfoBox count={this.activeMappingsCount()} text={'Active Mappings'} />
                </div>

                <div className="col-xl-3 col-sm-6 py-2">
                  <InfoBox count={this.schemesCount()} text={'Schemes'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardContainer>
    );
  }
}

const InfoBox = (props) => {
  const { count, text } = props;

  return (
    <div className="card" style={{ height: '8rem' }}>
      <div className="card-body rounded bg-dashboard-background col-background text-center">
        <h2>{count}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
};
