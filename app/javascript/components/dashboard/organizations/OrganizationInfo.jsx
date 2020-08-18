import React from 'react';

const OrganizationInfo = (props) => {
  return (
    <div className="col-xl-3 col-sm-6 py-2">
      <div className="card mt-2 h-100">
        <div className="card-header">
          <i className="fa fa-building"></i>
          <span className="pl-2 subtitle">{props.organization.name}</span>
        </div>
        <div className="card-body text-center">
          <h1>{props.organization.users.length}</h1>
          <h5 className="text-uppercase">Users</h5>
        </div>
      </div>
    </div>
  );
}

export default OrganizationInfo;