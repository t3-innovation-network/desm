import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserInfo = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);

  return (
    <React.Fragment>
    {
      isLoggedIn ?
        <React.Fragment>
          <li>
            <Link to='#' className="nav-link">
              <i className="fas fa-user mr-2"></i>
              {user.fullname}
            </Link>
          </li>
        </React.Fragment>
      : ""
    }
    </React.Fragment>
  );
}

export default UserInfo;