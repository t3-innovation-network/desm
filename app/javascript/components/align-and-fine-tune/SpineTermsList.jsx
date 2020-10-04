import React from "react";
import SpineTermCard from "./SpineTermCard";

const SpineTermsList = (props) => {
  return (
    <React.Fragment>
      {props.terms.map((term) => {
        return (
          <div className="row mb-2" key={term.id}>
            <div className="col-5">
              <SpineTermCard term={term} />
            </div>

            <div className="col-2">
              <select
                style={{
                  fontSize: "16px",
                  height: "calc(1.5em + 1.8rem + 2px)",
                }}
                name="predicate_id"
                className="form-control form-control-lg"
                required
              >
                {props.predicates.map(function (predicate) {
                  return (
                    <option key={predicate.id} value={predicate.id}>
                      {predicate.pref_label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-5">
              <div className="card with-shadow mb-2">
                <div className="card-header">Drag a matching element here</div>
              </div>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default SpineTermsList;
