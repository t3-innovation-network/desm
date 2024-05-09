import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { SlideInDown } from './Animations.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader.jsx';

/**
 * @prop {Function} onConfirm
 * @prop {Function} onRequestClose
 * @prop {Boolean} visible
 */
const ConfirmDialog = (props) => {
  Modal.setAppElement('body');

  /**
   * Elements from props
   */
  const { visible, onRequestClose, onConfirm, children } = props;

  const [waiting, setWaiting] = useState(false);

  const handleConfirm = () => {
    setWaiting(true);
    onConfirm();
  };

  useEffect(() => setWaiting(false), [visible]);

  return (
    <Modal
      isOpen={visible}
      onRequestClose={onRequestClose}
      contentLabel="Please Confirm"
      className={'fit-content-height centered-width'}
      style={{ marginLeft: '50%', marginRight: '50%' }}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <SlideInDown>
        <div className="card" style={{ maxHeight: '45rem' }}>
          <div className="card-header">
            <div className="row">
              <div className="col-10">
                <h3 className="col-primary">Please Confirm</h3>
              </div>
              <div className="col-2">
                <a
                  className="float-right cursor-pointer"
                  onClick={() => !waiting && onRequestClose()}
                >
                  <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="card-body has-scrollbar scrollbar">
            <div className="row">
              <div className="col">{children}</div>
            </div>
            <div className="row">
              <div className="col">
                <button
                  className="btn btn-dark float-right ml-3"
                  disabled={waiting}
                  onClick={handleConfirm}
                >
                  {waiting ? <Loader noPadding smallSpinner /> : 'Confirm'}
                </button>
                <button
                  className="btn btn-dark float-right ml-3"
                  disabled={waiting}
                  onClick={onRequestClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </SlideInDown>
    </Modal>
  );
};

export default ConfirmDialog;
