import TopNav from '../shared/TopNav';
import ConfigurationProfileSelect from '../shared/ConfigurationProfileSelect';

const SelectConfigurationProfile = ({ history }) => (
  <div className="container-fluid">
    <TopNav centerContent={() => null} />
    <div className="row mt-4">
      <div className="col-lg-6 mx-auto">
        <ConfigurationProfileSelect onChange={() => history.push('/')} />
      </div>
    </div>
  </div>
);

export default SelectConfigurationProfile;
