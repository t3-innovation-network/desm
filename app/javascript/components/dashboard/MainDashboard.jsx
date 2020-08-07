import React from "react";
import DashboardContainer from "./DashboardContainer";

const MainDashboard = () => {
  return (
    <DashboardContainer>
      <div className="col-lg-6 mx-auto">
        <div className="card mt-5">
          <div className="card-header">
            <i className="fa fa-book"></i>
            <strong className="pl-2">Dashboard</strong>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default MainDashboard;
