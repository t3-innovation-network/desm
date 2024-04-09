import { Link } from 'react-router-dom';

/**
 * Message to show when the selected domain does not have a spine uploaded
 */
const NoSpineAlert = () => {
  return (
    <div className="card text-center mt-5">
      <div className="card-header bg-col-on-primary-highlight">
        <h1>There&apos;s no spine defined for the selected domain.</h1>
      </div>
      <div className="card-body bg-col-on-primary-highlight">
        <Link to="/new-mapping" className="btn bg-col-primary col-background">
          Map a specification
        </Link>
      </div>
    </div>
  );
};

export default NoSpineAlert;
