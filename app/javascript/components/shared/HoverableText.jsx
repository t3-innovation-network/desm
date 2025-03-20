import { useState } from 'react';

/**
 * Props:
 * @param {String} forComponent attribute to use as "for" in the label tag
 * @param {JSX} primaryContent The content that's always visible
 * @param {JSX} secondaryContent The content that only appears when the mouse is over the label
 */
const HoverableText = ({ forComponent, primaryContent, secondaryContent, clsContent = '' }) => {
  const [hovering, setHovering] = useState(false);

  return (
    <label
      className="form-label"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      htmlFor={forComponent}
    >
      <p className={`mb-0 ${clsContent}`}>
        <span>{primaryContent}</span>
        {hovering ? (
          <span className="text-break" style={{ color: 'grey' }}>
            {' - ' + secondaryContent}
          </span>
        ) : null}
      </p>
    </label>
  );
};

export default HoverableText;
