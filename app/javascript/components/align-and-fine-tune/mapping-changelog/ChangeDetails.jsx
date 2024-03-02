const ChangeDetails = (props) => {
  /**
   * Elements from props
   */
  const { change, predicates, spineTerm } = props;

  /**
   * Returns the name of the predicate to be printed
   *
   * @param {Integer} predicateId
   */
  const predicateLabel = (predicateId) => {
    return predicates.find((predicate) => predicate.id == predicateId).pref_label;
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
      case 'predicate_id':
        return value ? predicateLabel(value) : 'not defined';
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
      case 'predicate_id':
        return 'Property';
      case 'spine_term_id':
        return 'Spine Term';
      default:
        return _.capitalize(property);
    }
  };

  let changeRows = [];
  for (let property in change.audited_changes) {
    changeRows.push(
      <div className="row" key={changeRows.length}>
        <p>
          For <strong>{`${spineTerm?.name || 'Unknown Spine'}, `}</strong>
          {' ' + printProperty(property)}
          {
            /// We are fetching only audits with action: "update". It implies that the auditable
            /// changes comes as an array, being the first index for the old value, and the second
            /// index, for the new value, like this: [old_value, new_value]
            _.isArray(change.audited_changes[property])
              ? ' was ' +
                printChangeValue(property, change.audited_changes[property][0]) +
                ' - changed to: '
              : ''
          }
          <strong>
            {_.isArray(change.audited_changes[property])
              ? printChangeValue(property, change.audited_changes[property][1])
              : ''}
          </strong>
        </p>
      </div>
    );
  }

  return changeRows;
};

export default ChangeDetails;
