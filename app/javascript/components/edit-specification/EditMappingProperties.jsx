import { TERMS_MODE } from './stores/termsStore';
import EditProperties from './EditProperties';

const EditMappingHeader = ({ parentItem }) => (
  <>
    Properties for{' '}
    <strong className="col-primary">
      {parentItem.title} ({parentItem.specification.name})
    </strong>
  </>
);

const EditMappingProperties = (props) => {
  return (
    <EditProperties mode={TERMS_MODE.MAPPING} HeaderComponent={EditMappingHeader} {...props} />
  );
};

export default EditMappingProperties;
