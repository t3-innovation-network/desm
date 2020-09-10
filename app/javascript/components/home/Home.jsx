import React from "react";
import TopNav from "../shared/TopNav";
import LeftSideHome from "./LeftCol";
import RightSideHome from "./RightCol";
import TopNavOptions from "../shared/TopNavOptions";

const Home = () => {
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
            <LeftSideHome />
            <RightSideHome />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Home;