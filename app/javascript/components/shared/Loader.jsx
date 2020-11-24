import React from "react";

/**
 * Props:
 * @param {String} message
 * @param {Boolean} noPadding
 * @param {Boolean} smallSpinner
 */
const Loader = (props) => {
  /**
   * Elements from props
   */
  const { message, noPadding, smallSpinner } = props;

  return (
    <div className={"container text-center" + (noPadding ? "" : " p-5")}>
      <div
        className={"spinner-grow" + (smallSpinner ? " spinner-grow-sm" : "")}
        role="status"
      ></div>
      {props.message ? (
        <div className="card mt-5">
          <div className="card-body">
            <h3>{message}</h3>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Loader;
