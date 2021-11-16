import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const UserInfo = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);

  return (
    <React.Fragment>
      {isLoggedIn ? (
        <React.Fragment>
          <Link to="#" className="nav-link col-on-primary">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
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
