import { useEffect } from 'react';
import { useLocalStore } from 'easy-peasy';
import TopNav from '../shared/TopNav';
import MappingForm from './MappingForm';
import MappingPreview from './MappingPreview';
import TopNavOptions from '../shared/TopNavOptions';
import AlertNotice from '../shared/AlertNotice';
import { unsetMappingFormErrors } from '../../actions/mappingform';
import { useDispatch, useSelector } from 'react-redux';
import { mappingUploadStore } from './stores/mappingUploadStore';

const Mapping = (props) => {
  const dispatch = useDispatch();
  const [state, actions] = useLocalStore(() =>
    mappingUploadStore({ mapping: { id: props.match.params.id || null } })
  );
  /**
   * The errors in the mapping form accross different components
   */
  const mappingFormErrors = useSelector((state) => state.mappingFormErrors);

  useEffect(() => {
    if (props.match.params.id) {
      actions.fetchDataFromAPI({ mappingId: props.match.params.id });
    }
  }, []);

  /**
   * Here is where the route redirects when the user wants to map
   * a specification, so here is where we can handle redirections.
   */
  const handleRedirect = (path) => props.history.push(path);

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return (
      <TopNavOptions
        viewMappings={true}
        mapSpecification={true}
        stepper={true}
        stepperStep={1}
        mapping={state.mapping}
      />
    );
  };

  return (
    <>
      <TopNav centerContent={navCenterOptions} />
      <div className="container-fluid desm-content">
        {state.hasErrors ? (
          <AlertNotice message={state.errors} onClose={actions.clearErrors} />
        ) : null}
        {mappingFormErrors.length ? (
          <AlertNotice
            message={mappingFormErrors}
            onClose={() => dispatch(unsetMappingFormErrors())}
          />
        ) : (
          ''
        )}
        <div className="row">
          <MappingForm mapping={state.mapping} />
          <MappingPreview mapping={state.mapping} redirect={handleRedirect} />
        </div>
      </div>
    </>
  );
};

export default Mapping;
