import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardBtn = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);

  if (isLoggedIn && user.roles !== undefined && user.roles[0].name == "admin") {
    return (
      <li className="nav-item">
        <Link
          to="/dashboard"
          className="mt-0 mb-1 ml-0 ml-lg-3 mr-0 btn btn-dark"
        >
          Dashboard
        </Link>
      </li>
    );
  }
  return null
}

export default DashboardBtn;