import React from "react";
import Modal from "react-modal";
import ModalStyles from "../shared/ModalStyles";

const EditTerm = (props) => {
  Modal.setAppElement("body");

  /**
   * Example vocabularies to manage dynamic content.
   * @todo: Replace when implementing final vocabularies
   */
  const vocabularies = [
    {
      name: "vocabulary1",
      value: "example vocab 1",
    },
    {
      name: "vocabulary2",
      value: "example vocab 2",
    },
  ];

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={props.onRequestClose}
      contentLabel="Edit Term"
      style={ModalStyles}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <div className="card ">
        <div className="card-header">
          <div className="row">
            <div className="col-6">
              <h4>Edit Term</h4>
            </div>
            <div className="col-6">
              <a
                className="float-right cursor-pointer"
                onClick={props.onRequestClose}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            {/* LEFT COLUMN */}

            <div className="col-6">
              <div className="form-group">
                <label>Class/Type</label>
                <input
                  type="text"
                  className="form-control"
                  name="type"
                  placeholder="Class/Type"
                  value={props.term.name}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Element/Property</label>
                <input type="text" className="form-control" name="element" />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" name="description" />
              </div>

              <div className="form-group">
                <label>Path (optional)</label>
                <textarea className="form-control" name="description" />
              </div>

              <div className="form-group">
                <label>Vocabulary (optional)</label>
                {vocabularies.map((vocabulary) => {
                  return (
                    <div className="row">
                      <div className="col-10">
                        <input
                          type="text"
                          className="form-control mb-2"
                          name="vocabulary-1"
                        />
                      </div>
                      <div className="col">
                        <button className="btn">
                          <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN */}

            <div className="col-6">
              <div className="form-group">
                <label>Datatype</label>
                <input
                  type="text"
                  className="form-control"
                  name="type"
                  placeholder="Datatype"
                />
              </div>

              <div className="form-group" style={{ height: "75%" }}>
                <label>Raw</label>
                <textarea
                  className="form-control"
                  name="raw"
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="row float-right">
            <div className="col">
              <button className="btn btn-outline-secondary mr-2">
                Remove Term
              </button>
              <button className="btn btn-dark">Save and Exit</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditTerm;
