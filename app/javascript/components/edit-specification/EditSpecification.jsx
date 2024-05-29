import { TERMS_MODE } from './stores/termsStore';
import EditProperties from './EditProperties';

const EditSpineHeader = ({ parentItem }) => {
  return (
    <>
      Spine for <strong className="col-primary">{parentItem.pref_label}</strong>
    </>
  );
};

const EditSpecification = (props) => {
  return <EditProperties mode={TERMS_MODE.SPINE} HeaderComponent={EditSpineHeader} {...props} />;
};

export default EditSpecification;
