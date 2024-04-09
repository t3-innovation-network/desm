import { Link } from 'react-router-dom';

const LeftSideHome = () => (
  <div className="col-lg-4 p-lg-5 pt-5">
    <section>
      <h6 className="subtitle">View Specification</h6>
      <p>To see crosswalks currently in process.</p>
      <Link
        to="/mappings-list"
        className="btn wide-btn btn-dark"
        title="See all the finished mappings to a specification (or a specific domain)"
      >
        View Shared Mappings
      </Link>
    </section>
    <section>
      <h6 className="subtitle">Map your schema:</h6>
    </section>
    <section>
      <ol className="usage-explanation">
        <li>Upload your schema</li>
        <li>Map the schema&apos;s properties and concepts</li>
        <li>Review and download the completed mappings</li>
      </ol>
    </section>
    <section>
      <Link
        to="/new-mapping"
        className="btn wide-btn btn-dark"
        title="Create a mapping between 2 specifications"
      >
        New Mapping
      </Link>
    </section>
  </div>
);

export default LeftSideHome;
