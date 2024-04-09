import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

const OrganizationInfo = (props) => {
  return (
    <div className="col-xl-3 col-sm-6 py-2">
      <div className="card mt-2 h-100">
        <Link
          to={'/dashboard/organizations/' + props.organization.id}
          className="card-header bg-dashboard-background col-background"
        >
          <FontAwesomeIcon icon={faBuilding} />
          <span className="pl-2 subtitle">{props.organization.name}</span>
        </Link>
        <div className="card-body text-center">
          <h1>{props.organization.users.length}</h1>
          <h5 className="text-uppercase">Users</h5>
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfo;
