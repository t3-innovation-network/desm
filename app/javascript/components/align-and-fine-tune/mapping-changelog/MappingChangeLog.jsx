import React, { useEffect, useState } from "react";
import fetchAudits from "../../../services/fetchAudits";
import Collapsible from "../../shared/Collapsible";
import ChangeDetails from "./ChangeDetails";
import Moment from "moment";

/**
 * @description Renders a card with information about the changes in the mapping provided
 *   in props. The information is fetched from the api service.
 *
 * Props:
 * @param {Array} mappingTerms
 * @param {Array} spineTerms
 * @param {Array} predicates
 * @param {String} dateMapped
 */
const MappingChangeLog = (props) => {
  /**
   * Elements from props
   */
  const { mappingTerms, spineTerms, predicates, dateMapped } = props;
  /**
   * The changes data (JSON)
   */
  const [changes, setChanges] = useState([]);

  /**
   * Manage to get the changes from the api service
   */
  const handleFetchChanges = async () => {
    // Get changes from the api service
    let response = await fetchAudits({
      className: "MappingTerm",
      instanceIds: mappingTerms.map((mt) => mt.id),
      auditAction: "update",
      dateFrom: dateMapped,
    });

    setChanges(response.audits);
  };

  /**
   * Find the spine term related to a mapping term
   *
   * @param {Integer} mTermId The id of the mappng term
   */
  const spineTermForMappingTerm = (mTermId) => {
    let mTerm = mappingTerms.find((mt) => mt.id == mTermId);

    return spineTerms.find((sTerm) => sTerm.id == mTerm.spine_term_id);
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the action of fetching the changes
   * at the 'mounted' event of this functional component (It's not actually mounted, but
   * it mimics the same action).
   */
  useEffect(() => {
    handleFetchChanges();
  }, []);

  /**
   * Presentation of the changes when fetched
   */
  const ChangelogStruct = () => {
    return (
      <ul>
        {changes.map((change, i) => {
          return (
            <li key={i}>
              <div className="ml-3">
                <div className="row">
                  {/* <strong>{change.created_at}</strong> */}
                  <strong>
                    {Moment(change.created_at).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </strong>
                </div>
                <ChangeDetails
                  spineTerm={spineTermForMappingTerm(change.auditable_id)}
                  change={change}
                  predicates={predicates}
                />
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  /**
   * Returns a collapsible element, with the title being "Changelog and the content a specically structured
   * list of changes".
   *
   * Render taking care of having changes present.
   */
  return !_.isEmpty(changes) ? (
    <Collapsible
      cardStyle={"mb-3 alert-info"}
      cardHeaderStyle={"borderless"}
      bodyContent={<ChangelogStruct />}
      headerContent={<h4>Changelog</h4>}
    />
  ) : (
    ""
  );
};

export default MappingChangeLog;
