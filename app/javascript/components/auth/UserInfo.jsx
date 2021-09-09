import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserInfo = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);

  return (
    <React.Fragment>
      {isLoggedIn ? (
        <React.Fragment>
          <Link to="#" className="nav-link col-on-primary">
            <i className="fas fa-user mr-2"></i>
            {user && (
              <span>
                {_.capitalize(user.fullname) +
                  (user.organization ? " - " + user.organization?.name : "")}
              </span>
            )}
          </Link>
        </React.Fragment>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default UserInfo;
