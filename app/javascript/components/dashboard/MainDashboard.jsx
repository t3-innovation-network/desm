import { useEffect } from 'react';
import DashboardContainer from './DashboardContainer';
import AlertNotice from '../shared/AlertNotice';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useLocalStore } from 'easy-peasy';
import { dashboardStore } from './stores/dashboardStore';
import { pageRoutes } from '../../services/pageRoutes';
import classNames from 'classnames';

const InfoBox = (props) => {
  const { count, text, link = null } = props;
  const cssCard = classNames('card bg-dashboard-background', { 'card--link': !!link });
  const cardBody = () => (
    <div className="card-body rounded col-background text-center">
      <h2>{count}</h2>
      <p>{text}</p>
    </div>
  );

  return link ? (
    <Link className={cssCard} style={{ height: '8rem' }} to={link}>
      {cardBody()}
    </Link>
  ) : (
    <div className={cssCard} style={{ height: '8rem' }}>
      {cardBody()}
    </div>
  );
};

const MainDashboard = (_props = {}) => {
  const [state, actions] = useLocalStore(() => dashboardStore());

  useEffect(() => actions.fetchData(), []);

  const dashboardPath = () => {
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

  return (
    <DashboardContainer>
      {dashboardPath()}
      <div className="col col-md-10 mt-5">
        <div className="row h-50 ml-5">
          <div className="col-3 py-3">
            <div
              className="form-group"
              onChange={(e) => actions.setSelectedOptionId(e.target.value)}
            >
              {state.filterOptions.map(function (opt) {
                return (
                  <div key={opt.id}>
                    <input
                      type="radio"
                      value={opt.id}
                      name="filterOption"
                      id={`filterOption-${opt.id}`}
                      required={true}
                      defaultChecked={opt.id === 'all'}
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
            {state.hasErrors ? (
              <AlertNotice message={state.errors} onClose={actions.clearErrors} />
            ) : null}

            <div className="row">
              <div className="col-xl-3 col-sm-6 py-2">
                <InfoBox count={state.cpsCount} text={'Configuration Profiles'} />
              </div>

              <div className="col-xl-3 col-sm-6 py-2">
                <InfoBox count={state.dsosCount} text={'Data Standards Organizations'} />
              </div>

              <div className="col-xl-3 col-sm-6 py-2">
                <InfoBox count={state.agentsCount} text={'Agents'} link={pageRoutes.agents()} />
              </div>

              <div className="col-xl-3 col-sm-6 py-2">
                <InfoBox count={state.activeMappingsCount} text={'Active Mappings'} />
              </div>

              <div className="col-xl-3 col-sm-6 py-2">
                <InfoBox count={state.schemesCount} text={'Schemes'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default MainDashboard;
