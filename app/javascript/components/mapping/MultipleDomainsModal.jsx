import React from "react";
import Modal from "react-modal";
import ModalStyles from '../shared/ModalStyles';

const MultipleDomainsModal = (props) => {
  Modal.setAppElement("body");

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.onRequestClose}
      contentLabel="Multiple Domains Found"
      style={ModalStyles}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <div className="card" style={{maxHeight: "45rem"}}>
        <div className="card-header">
          <div className="row">
            <div className="col-10">
              <h5 className="col-primary"><strong>{props.domains.length}</strong> domains found</h5>
            </div>
            <div className="col-2">
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
              <strong>Please select a domain from the list to begin mapping</strong>
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback"></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name"
                  value={props.inputValue}
                  onChange={props.filterOnChange}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-body has-scrollbar scrollbar">
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
