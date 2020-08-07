import React from 'react';

const OrganizationInfo = (props) => {
  return (
    <div className="card mt-2">
      <div className="card-header">
        <i className="fa fa-building"></i>
        <span className="pl-2 subtitle">{props.organization.name}</span>
      </div>
      <div className="card-body">
        {
          props.organization.users.map((user) => {
            return (
              <React.Fragment key={user.id}>
                <p>{user.fullname}</p>
                <p>{user.email}</p>
              </React.Fragment>
            );
          })
        }
      </div>
    </div>
  );
}

export default OrganizationInfo;