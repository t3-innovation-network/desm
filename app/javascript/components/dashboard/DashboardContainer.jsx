import React from "react";
import TopNav from "../shared/TopNav";
import SideBar from "../dashboard/SideBar";
import TopNavOptions from "../shared/TopNavOptions";

const DashboardContainer = (props) => {
  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  return (
    <React.Fragment>
      <TopNav centerContent={navCenterOptions} />
      <div className="container-fluid container-wrapper">
        <div className="row">
          <div className="col-sm-6 col-md-3 col-lg-2 bg-dashboard-background no-sides-padding">
            <SideBar />
          </div>
          <div className="col-sm-6 col-md-9 col-lg-10 bg-dashboard-background-light pt-3">
            {props.children}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardContainer;
