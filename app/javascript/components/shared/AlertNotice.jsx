import { isArray, isEmpty } from 'lodash';
import { useEffect, useRef } from 'react';

/**
 * @description Renders an Alert box with a title and a message
 *
 * Props:
 * @param {String} cssClass The class that will determine the color of the box. By default it's
 *   "alert-danger", which will render a red box.
 * @param {String} title The first and bolded word to remark. By default it's "Attention".
 * @param {String|Array} message The message to show in the box. It can be both a string message
 *   or an array of strings representing the multiple error messages
 */
const AlertNotice = (props) => {
  /**
   * Elements from props
   */
  const { cssClass, title, message, onClose, withScroll = false, withTitle = true } = props;
  const myRef = useRef(null);
  useEffect(() => {
    if (withScroll && !isEmpty(message) && myRef.current) {
      myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [message]);

  if (isEmpty(message)) return null;

  const renderError = () => {
    if (isArray(message) && message.length > 1) {
      return (
        <ul className="mb-0">
          {message.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      );
    } else {
      return <p className="mb-0">{isArray(message) ? message[0] : message}</p>;
    }
  };

  return (
    <div
      ref={myRef}
      className={'alert alert-dismissible ' + (cssClass ? cssClass : 'alert-danger')}
    >
      {withTitle && (
        <h4>
          <strong>{title ? title : 'Attention!'}</strong>
        </h4>
      )}
      {renderError()}
      {onClose && (
        <button type="button" className="close" aria-label="Close" onClick={onClose}>
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
};

export default AlertNotice;
