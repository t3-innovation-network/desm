import Modal from "react-modal";
import React from "react";
import { SlideInDown } from "./Animations.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

/**
 * @prop {Function} onConfirm
 * @prop {Function} onRequestClose
 * @prop {Boolean} visible
 */
const ConfirmDialog = (props) => {
  Modal.setAppElement("body");

  /**
   * Elements from props
   */
  const { visible, onRequestClose, onConfirm, children } = props;

  return (
    <Modal
      isOpen={visible}
      onRequestClose={onRequestClose}
      contentLabel="Please Confirm"
      className={"fit-content-height m-5"}
      style={{ marginLeft: "50%", marginRight: "50%" }}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <SlideInDown>
        <div className="card centered-width" style={{ maxHeight: "45rem" }}>
          <div className="card-header">
            <div className="row">
              <div className="col-10">
                <h3 className="col-primary">Please Confirm</h3>
              </div>
              <div className="col-2">
                <a
                  className="float-right cursor-pointer"
                  onClick={onRequestClose}
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
                  onClick={onConfirm}
                >
                  Confirm
                </button>
                <button
                  className="btn btn-dark float-right ml-3"
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
