import React, { useState } from 'react';
import Collapsible from '../shared/Collapsible.jsx';
import Loader from '../shared/Loader.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * @prop {Function} onClick Actions when the user clicks on it
 * @prop {Boolean} disableClick Whether we allow to click on this card. If true, it wil trigger onClick
 * @prop {Object} term The term object
 * @prop {String} origin The name of the organization that created the term specification
 * @prop {Boolean} alwaysEnabled Whether after dragged it remains available to drag again
 * @prop {Function} isMapped The logic to determine whether this term is or not mapped
 * @prop {Boolean} editEnabled Show/Hide the edit option
 * @prop {Function} onEditClick The logic to execute when the user click "edit"
 * @prop {Function} onRevertMapping The logic to execute when click on the option to revert a term from being mapped
 */

const TermCard = ({ term, editEnabled, disableClick, ...props }) => {
  const [reverting, setReverting] = useState(false);
  // callback to the parent component, don't mutate the term object
  const handleTermClick = () => props.onClick({ ...term, selected: !term.selected });
  // Manage to execute the revert action on this term using the function passesd in props
  const handleOnRevertMapping = async () => {
    setReverting(true);
    try {
      await props.onRevertMapping(term.id);
    } finally {
      setReverting(false);
    }
  };

  /**
   * After dragging a term card, if it's not meant to be "always enabled" (multiple times draggable),
   * it becomes disabled.
   */
  const disabledTermCard = () => (
    <div className="card term-card with-shadow mb-2 disabled-container not-draggable">
      <div className="card-header no-color-header">
        {reverting ? (
          <Loader noPadding={true} smallSpinner={true} />
        ) : (
          <div className="row">
            <div
              className="col-1 cursor-pointer"
              title="Revert selecting this term"
              onClick={handleOnRevertMapping}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
            <div className="col-7 non-selectable">{term.name}</div>
            <div className="col-4">
              <div className="float-right">
                <FontAwesomeIcon icon={faCheck} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // The content of the header (The component when it's shrinked)
  const termHeaderContent = () => (
    <div className="row">
      <div className={'col-8 mb-3' + (disableClick || term.selected ? '' : ' cursor-pointer')}>
        <strong>{term.name}</strong>
      </div>
      <div className="col-4">
        <div className="float-right">
          {editEnabled && (
            <button onClick={() => props.onEditClick(term)} className="btn">
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return props.isMapped(term) && !props.alwaysEnabled ? (
    disabledTermCard()
  ) : (
    <Collapsible
      expanded={props.expanded === undefined ? true : props.expanded}
      cardStyle={
        'term-card with-shadow draggable mb-2' + (term.selected ? ' draggable term-selected' : '')
      }
      cardHeaderStyle={'no-color-header pb-0'}
      cardHeaderColStyle={disableClick ? '' : term.selected ? '' : 'cursor-pointer'}
      handleOnClick={disableClick ? null : handleTermClick}
      headerContent={termHeaderContent()}
      bodyContent={
        <>
          <h6 className="card-subtitle mb-2 text-muted">
            Name: <strong>{term.sourceUri.split(/[/:]/).pop()}</strong>
          </h6>
          <p className="card-text">{term.property.comment}</p>
          <p className="card-text">{'ID: ' + term.sourceUri}</p>
        </>
      }
    />
  );
};

export default TermCard;
