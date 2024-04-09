import TopNav from '../shared/TopNav';
import MappingForm from './MappingForm';
import MappingPreview from './MappingPreview';
import TopNavOptions from '../shared/TopNavOptions';
import AlertNotice from '../shared/AlertNotice';
import { unsetMappingFormErrors } from '../../actions/mappingform';
import { useDispatch, useSelector } from 'react-redux';

const Mapping = (props) => {
  const dispatch = useDispatch();
  /**
   * The errors in the mapping form accross different components
   */
  const mappingFormErrors = useSelector((state) => state.mappingFormErrors);

  /**
   * Here is where the route redirects when the user wants to map
   * a specification, so here is where we can handle redirections.
   */
  const handleRedirect = (path) => {
    props.history.push(path);
  };

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return (
      <TopNavOptions viewMappings={true} mapSpecification={true} stepper={true} stepperStep={1} />
    );
  };

  return (
    <div className="container-fluid">
      <TopNav centerContent={navCenterOptions} />
      {mappingFormErrors.length ? (
        <AlertNotice
          message={mappingFormErrors}
          onClose={() => dispatch(unsetMappingFormErrors())}
        />
      ) : (
        ''
      )}
      <div className="row">
        <MappingForm />
        <MappingPreview redirect={handleRedirect} />
      </div>
    </div>
  );
};

export default Mapping;
