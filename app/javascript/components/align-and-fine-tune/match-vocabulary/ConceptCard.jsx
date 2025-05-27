import { useState } from 'react';
import Collapsible from '../../shared/Collapsible';

/**
 * Structure of a concept of the mapped term vocabulary
 *
 * @param {Object} concept
 * @param {Function} onClick
 * @param {String} origin
 */
function ConceptCard({ concept, onClick, origin }) {
  const [selected, setSelected] = useState(concept.selected);

  const handleClick = () => {
    setSelected((prev) => {
      const newSelected = !prev;
      if (onClick) onClick(concept);
      return newSelected;
    });
  };

  return (
    <Collapsible
      headerContent={<strong>{concept.name}</strong>}
      cardStyle={'with-shadow mb-2' + (selected ? ' draggable term-selected' : '')}
      cardHeaderColStyle={selected ? '' : 'cursor-pointer'}
      observeOutside={false}
      handleOnClick={handleClick}
      bodyContent={
        <>
          <p>{concept.definition}</p>
          <p>
            Origin:
            <span className="col-primary">{' ' + origin}</span>
          </p>
        </>
      }
    />
  );
}

export default ConceptCard;
