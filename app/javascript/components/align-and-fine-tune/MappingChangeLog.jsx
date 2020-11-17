import React, { useEffect, useState } from "react";
import AlertNotice from "../shared/AlertNotice";

/**
 * @description Renders a card with information about the changes in the mapping provided
 *   in props. The information is fetched from the api service.
 *
 * Props:
 * @param {Object} mapping
 * @param {Array} predicates
 */
const MappingChangeLog = (props) => {
  /**
   * Elements from props
   */
  const { mapping, predicates } = props;
  /**
   * The changes to show in the box
   */
  const [changelog, setChangelog] = useState([]);

  useEffect(() => {
    /// @todo: replace with api service request
    let changes = [
      {
        created_at: "2020-11-15 05:14:47",
        action: "create",
        audited_changes: { predicate_id: [null, 6] },
        user: "User 2",
      },
      {
        created_at: "2020-11-16 20:42:06",
        audited_changes: { comment: [null, "testing comment"] },
        action: "update",
        user: "User 2",
      },
    ];

    let tempChangelog = changes.map((change, i) => {
      return (
        <div className="ml-3" key={i}>
          <div className="row">
            <strong>{change.created_at}</strong>
          </div>
          <ChangeDetails change={change} predicates={predicates} />
        </div>
      );
    });

    setChangelog(tempChangelog);
  }, []);

  return <AlertNotice message={changelog} title={"Changelog"} />;
};

/**
 * ************* ADDITIONAL COMPONENTS *************
 */

/**
 * Props
 * @param {Object} change
 * @param {Array} predicates
 */
const ChangeDetails = (props) => {
  /**
   * Elements from props
   */
  const { change, predicates } = props;

  /**
   * Returns the name of the predicate to be printed
   *
   * @param {Integer} predicateId
   */
  const predicateLabel = (predicateId) => {
    return predicates.find((predicate) => predicate.id == predicateId)
      .pref_label;
  };

  /**
   * Prints the value of the change in a human readable format.
   * This is necessary since there might be changes on predicate_ids, spine_term_ids
   * as integers, probably causing confusion to the user .
   *
   * @param {String} property
   * @param {String|undefined} value
   */
  const printChangeValue = (property, value) => {
    switch (property) {
      case "predicate_id":
        return value ? predicateLabel(value) : "not defined";
      default:
        return value;
    }
  };

  /**
   * Prints the property that was changed in a human readable format.
   * the possible values for it might be:
   * - predicate_id
   * - spine_term_id
   * So we need the user to see the relation names, not the table attribute names
   *
   * @param {String} property
   */
  const printProperty = (property) => {
    switch (property) {
      case "predicate_id":
        return "Property";
      case "spine_term_id":
        return "Spine Term";
      default:
        return _.capitalize(property);
    }
  };

  let changeRows = [];
  for (let property in change.audited_changes) {
    changeRows.push(
      <div className="row" key={changeRows.length}>
        <p>
          <strong>{printProperty(property)}</strong>
          {
            /// We are fetching only audits with action: "update". It implies that the auditable
            /// changes comes as an array, being the first index for the old value, and the second
            /// index, for the new value, like this: [old_value, new_value]
            _.isArray(change.audited_changes[property])
              ? " was " +
                printChangeValue(
                  property,
                  change.audited_changes[property][0]
                ) +
                " - changed to: "
              : ""
          }
          <strong>
            {_.isArray(change.audited_changes[property])
              ? printChangeValue(property, change.audited_changes[property][1])
              : ""}
          </strong>
        </p>
      </div>
    );
  }

  return changeRows;
};

export default MappingChangeLog;
