import React from "react";
import Modal from "react-modal";

const MultipleDomainsModal = (props) => {
  Modal.setAppElement("body");

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "none",
    },
  };

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.onRequestClose}
      contentLabel="Multiple Domains Found"
      style={customStyles}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <div className="card multiple-domains-modal">
        <div className="card-header">
          <div className="row">
            <div className="col">
              <a
                className="float-right cursor-pointer"
                onClick={props.onRequestClose}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4>
                Please, pick one of the following domains found in the file to
                begin mapping
              </h4>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="desm-radio">
            {props.domains.map(function (dom) {
              return (
                <div className="desm-radio-primary" key={"radio-" + dom.id}>
                  <input
                    type="radio"
                    name="domain-options"
                    id={"radio-" + dom.id}
                    onClick={() => props.onSelectDomain(dom.uri)}
                  />
                  <label htmlFor={"radio-" + dom.id}>{dom.label}</label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MultipleDomainsModal;
