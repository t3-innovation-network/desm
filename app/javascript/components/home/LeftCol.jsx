import React from "react";
import { Link } from "react-router-dom";

class LeftSideHome extends React.Component {
  render() {
    return (
      <div className="col-lg-6 p-lg-5 pt-5">
        <section>
          <h6 className="subtitle">View Specification</h6>
          <p>To see crosswalks currently in process.</p>
          <Link to="/mappings-list" className="btn wide-btn btn-dark">
            View Specifications
          </Link>
        </section>
        <section>
          <h6 className="subtitle">Map your specification to a base schema</h6>
        </section>
        <section>
          <ol className="usage-explanation">
            <li>Upload Your Specification</li>
            <li>Coarse Grain Mapping</li>
            <li>Fine Grain Mapping and Tunning</li>
            <li>Download Mapping</li>
          </ol>
        </section>
        <section>
          <Link to="/new-mapping" className="btn wide-btn btn-dark">
            Start Mapping
          </Link>
        </section>
      </div>
    );
  }
}
export default LeftSideHome;
