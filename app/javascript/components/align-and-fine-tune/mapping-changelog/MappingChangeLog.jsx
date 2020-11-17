import React, { useEffect, useState } from "react";
import Collapsible from "../../shared/Collapsible";
import ChangeDetails from "./ChangeDetails";

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

  /**
   * Use effect with an emtpy array as second parameter, will trigger the action of fetching the changes
   * at the 'mounted' event of this functional component (It's not actually mounted, but
   * it mimics the same action).
   */
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

  return (
    <Collapsible
      cardStyle={"mb-3 alert-danger"}
      cardHeaderStyle={"borderless"}
      bodyContent={changelog}
      headerContent={<h4>Changelog</h4>}
    />
  );
};

export default MappingChangeLog;
