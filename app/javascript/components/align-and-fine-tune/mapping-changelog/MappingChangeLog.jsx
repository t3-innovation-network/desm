import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import fetchAudits from '../../../services/fetchAudits';
import Collapsible from '../../shared/Collapsible';
import ChangeDetails from './ChangeDetails';
import { dateTimeLongFormat } from '../../../utils/dateFormatting';

/**
 * @description Renders a card with information about the changes in the mapping provided
 *   in props. The information is fetched from the api service.
 *
 * Props:
 * @prop {Array} alignments
 * @prop {Array} spineTerms
 * @prop {Array} predicates
 * @prop {String} dateMapped
 */
const MappingChangeLog = (props) => {
  /**
   * Elements from props
   */
  const { alignments, spineTerms, predicates, dateMapped } = props;
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
      className: 'Alignment',
      instanceIds: alignments.map((mt) => mt.id),
      auditAction: 'update',
      dateFrom: dateMapped,
    });

    setChanges(response.audits);
  };

  /**
   * Find the spine term related to a mapping term
   *
   * @param {Integer} alignmentId The id of the mapping term
   */
  const spineTermForAlignment = (alignmentId) => {
    let alignment = alignments.find((alignment) => alignment.id === alignmentId);

    return spineTerms.find((sTerm) => sTerm.id === alignment.spineTermId);
  };

  /**
   * Use effect with an empty array as second parameter, will trigger the action of fetching the changes
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
              <div className="ms-3">
                <div className="row">
                  <strong>{dateTimeLongFormat(change.created_at)}</strong>
                </div>
                <ChangeDetails
                  spineTerm={spineTermForAlignment(change.auditable_id)}
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
   * Returns a collapsible element, with the title being "Changelog and the content a specifically structured
   * list of changes".
   *
   * Render taking care of having changes present.
   */
  return !isEmpty(changes) ? (
    <Collapsible
      cardStyle={'mb-3 alert-info'}
      cardHeaderStyle={'bottom-borderless'}
      bodyContent={<ChangelogStruct />}
      headerContent={<h4>Changelog</h4>}
    />
  ) : (
    ''
  );
};

export default MappingChangeLog;
