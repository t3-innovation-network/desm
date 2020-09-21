import { checkPropTypes } from "prop-types";
import React from "react";

const Loader = (props) => {
  return (
    <div className="container text-center p-5">
      <div className="spinner-grow" role="status"></div>
      {props.message ? (
        <div className="card mt-5">
          <div className="card-body">
            <h3>{props.message}</h3>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Loader;
