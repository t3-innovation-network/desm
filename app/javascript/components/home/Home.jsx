import React from "react";
import TopNav from "../shared/TopNav";
import LeftSideHome from "./LeftCol";
import RightSideHome from "./RightCol";

const Home = () => {
  return (
    <React.Fragment>
      <div className="wrapper">
        <TopNav/>
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