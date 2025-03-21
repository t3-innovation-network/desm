import TopNav from '../shared/TopNav';
import ConfigurationProfileSelect from '../shared/ConfigurationProfileSelect';

const SelectConfigurationProfile = ({ history }) => (
  <>
    <TopNav centerContent={() => null} />
    <div className="container-fluid desm-content" role="main">
      <div className="row mt-4">
        <div className="col-12 mx-auto">
          <ConfigurationProfileSelect
            requestType="indexForUser"
            onChange={() => history.push('/')}
          />
        </div>
      </div>
    </div>
  </>
);

export default SelectConfigurationProfile;
