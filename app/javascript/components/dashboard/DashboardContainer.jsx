import React from "react";
import TopNav from "../shared/TopNav";
import SideBar from "../dashboard/SideBar";
import TopNavOptions from "../shared/TopNavOptions";

const DashboardContainer = (props) => {
  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return (
      <TopNavOptions 
        viewMappings={true}
        mapSpecification={true}
      />
    )
  }
  
  return (
    <React.Fragment>
      <div className="wrapper">
        <TopNav centerContent={navCenterOptions} />
        <div className="container-fluid container-wrapper">
          <div className="row">
            <SideBar />
            {props.children}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardContainer;
