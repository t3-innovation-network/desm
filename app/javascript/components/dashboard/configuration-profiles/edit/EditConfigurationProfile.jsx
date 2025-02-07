import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { isNull, capitalize } from 'lodash';
import fetchConfigurationProfile from '../../../../services/fetchConfigurationProfile';
import AlertNotice from '../../../shared/AlertNotice';
import Loader from '../../../shared/Loader';
import DashboardContainer from '../../DashboardContainer';
import { stateStyle } from '../utils';
import StepsAside from './StepsAside';
import CPMetaData from './CPMetaData';
import MappingPredicates from './MappingPredicates';
import AbstractClasses from './AbstractClasses';
import DSOsInfo from './DSOsInfo';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setStep,
} from '../../../../actions/configurationProfiles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import useDidMountEffect from '../../../../helpers/useDidMountEffect';
import CompleteStructureValidationErrors from './CompleteStructureValidationErrors';
import classNames from 'classnames';

const EditConfigurationProfile = (props) => {
  const [loading, setLoading] = useState(true);
  const errors = useSelector((state) => state.editCPErrors);

  const dashboardPath = () => {
    return (
      <div className="float-end">
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
        {`>`}{' '}
        <span>
          <Link className="col-on-primary" to="/dashboard/configuration-profiles">
            Configuration Profiles
          </Link>
        </span>{' '}
        {`>`} <span>Edit</span>
      </div>
    );
  };

  const dispatch = useDispatch();

  const fetchCP = () => {
    fetchConfigurationProfile(props.match.params.id).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        setLoading(false);
        return;
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      setLoading(false);
    });
  };

  useEffect(() => {
    dispatch(setEditCPErrors(null));
    dispatch(setStep(1));
    fetchCP();
  }, []);

  return (
    <DashboardContainer>
      {dashboardPath()}
      {loading ? (
        <Loader />
      ) : (
        <div className="col mt-5">
          <div className="row cp-container justify-content-center h-100">
            <div className="col-12">
              {errors && (
                <AlertNotice
                  message={errors}
                  withScroll={true}
                  onClose={() => dispatch(setEditCPErrors(null))}
                />
              )}
            </div>
            <div className="col-3">
              <div className="row justify-content-center h-100">
                <div className="col">
                  <StepsAside />
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="card border-top-dashboard-highlight h-100">
                <div className="card-body d-flex flex-column">
                  <div className="row justify-content-center">
                    <CPCardHeader />
                  </div>
                  <div className="row justify-content-center mb-3">
                    <PageStepRenderer />
                  </div>
                  <div className="row mt-auto ms-auto">
                    <PrevNextButtons />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardContainer>
  );
};

const CPCardHeader = () => {
  const configurationProfile = useSelector((state) => state.currentCP);
  const savingCP = useSelector((state) => state.savingCP);
  const [showChangesSaved, setShowChangesSaved] = useState(false);
  const dispatch = useDispatch();

  const timeoutId = useRef();

  useDidMountEffect(() => {
    if (savingCP) {
      setShowChangesSaved(true);

      timeoutId.current = setTimeout(() => {
        setShowChangesSaved(false);
        timeoutId.current = undefined;
      }, 3000);
    } else {
      if (!isNull(savingCP)) {
        dispatch(setEditCPErrors(null));
        // showSuccess('All changes saved');
      }
    }
  }, [savingCP]);

  useEffect(() => {
    return () => timeoutId.current && clearTimeout(timeoutId.current);
  }, []);

  const clsMessage = classNames('text-center', {
    'col-on-primary-light': savingCP,
    'col-success': savingCP === false,
    'text-danger': isNull(savingCP),
  });
  return (
    <>
      <div className="col-4">
        <h3 className="float-start">{configurationProfile.name}</h3>
      </div>
      <div className="col-4">
        {showChangesSaved && (
          <p className={clsMessage}>
            {savingCP
              ? 'Saving ...'
              : isNull(savingCP)
                ? 'Changes were not saved'
                : 'All changes saved'}
          </p>
        )}
      </div>
      <div className="col-4">
        <p className="float-end" style={stateStyle(configurationProfile.state)}>
          {capitalize(configurationProfile.state)}
        </p>
      </div>
      <CompleteStructureValidationErrors />
    </>
  );
};

const PageStepRenderer = () => {
  const currentStep = useSelector((state) => state.cpStep);

  switch (currentStep) {
    case 1:
      return <CPMetaData />;
    case 2:
      return <MappingPredicates />;
    case 3:
      return <AbstractClasses />;
    case 4:
      return <DSOsInfo />;
    default:
      return <CPMetaData />;
  }
};

const PrevNextButtons = () => {
  const currentStep = useSelector((state) => state.cpStep);
  const dispatch = useDispatch();

  return (
    <>
      {currentStep !== 1 && currentStep !== 4 && (
        <button
          className="btn btn-dark me-3"
          style={{ width: '10rem' }}
          onClick={() => {
            dispatch(setStep(currentStep - 1));
          }}
        >
          Previous
        </button>
      )}
      {currentStep !== 4 && (
        <button
          className="btn btn-dark me-3"
          style={{ width: '10rem' }}
          onClick={() => {
            dispatch(setStep(currentStep + 1));
          }}
        >
          Next
        </button>
      )}
    </>
  );
};

export default EditConfigurationProfile;
