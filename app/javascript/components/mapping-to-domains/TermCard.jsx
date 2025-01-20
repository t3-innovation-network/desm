import { useState } from 'react';
import Collapsible from '../shared/Collapsible.jsx';
import Loader from '../shared/Loader.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faTimes,
  faCheck,
  faUpDownLeftRight,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { intersection } from 'lodash';

/**
 * @prop {Function} onClick Actions when the user clicks on it
 * @prop {Boolean} disableClick Whether we allow to click on this card. If true, it will trigger onClick
 * @prop {Object} term The term object
 * @prop {String} origin The name of the organization that created the term specification
 * @prop {Boolean} alwaysEnabled Whether after dragged it remains available to drag again
 * @prop {Function} isMapped The logic to determine whether this term is or not mapped
 * @prop {Boolean} editEnabled Show/Hide the edit option
 * @prop {Function} onEditClick The logic to execute when the user click "edit"
 * @prop {Function} onRevertMapping The logic to execute when click on the option to revert a term from being mapped
 * @prop {Array} compactDomains The compact versions of the domains selected during upload
 */

const TermCard = ({ term, editEnabled, disableClick, compactDomains, ...props }) => {
  const [reverting, setReverting] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
              <div className="float-end">
                <FontAwesomeIcon icon={faCheck} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const headerCls = classNames({ 'cursor-pointer': !disableClick });

  // The content of the header (The component when it's shrinked)
  const termHeaderContent = () => (
    <div className={headerCls}>
      {!disableClick && <FontAwesomeIcon className="me-2" icon={faUpDownLeftRight} />}
      <strong>{term.name}</strong>
      {editEnabled && (
        <span onClick={() => props.onEditClick(term)} className="ms-3 cursor-pointer">
          <FontAwesomeIcon icon={faPencilAlt} />
        </span>
      )}
    </div>
  );

  const cardCls = classNames('term-card with-shadow mb-2', {
    'term-selected': term.selected,
    draggable: !disableClick,
  });
  const cardHeaderCls = classNames({ 'cursor-pointer': !disableClick && !term.selected });

  return props.isMapped(term) && !props.alwaysEnabled ? (
    disabledTermCard()
  ) : (
    <Collapsible
      expanded={props.expanded === undefined ? true : props.expanded}
      cardStyle={cardCls}
      cardHeaderStyle={'no-color-header'}
      cardHeaderColStyle={cardHeaderCls}
      handleOnClick={disableClick ? null : handleTermClick}
      headerContent={props.headerContent || termHeaderContent()}
      bodyContent={
        <>
          <h6 className="card-subtitle text-body-secondary">
            Name: <strong>{term.title}</strong>
          </h6>
          <p className="card-text">{term.property.comment}</p>
          <p className="card-text">{'ID: ' + term.sourceUri}</p>
          {Boolean(compactDomains) && (
            <>
              <button className="btn btn-link p-0" onClick={() => setExpanded(!expanded)}>
                {expanded ? 'Collapse' : 'Expand'}
              </button>
              {expanded ? (
                <div className="mt-2">
                  <p className="card-text">
                    Domains: <span>{intersection(compactDomains, term.compactDomains)}</span>
                  </p>
                  <p className="card-text">
                    Ranges: <span>{term.compactRanges}</span>
                  </p>
                </div>
              ) : null}
            </>
          )}
        </>
      }
    />
  );
};

export default TermCard;
