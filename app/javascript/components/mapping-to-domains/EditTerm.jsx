import React, { Component } from "react";
import Modal from "react-modal";
import fetchTerm from "../../services/fetchTerm";
import updateTerm from "../../services/updateTerm";
import Loader from "../shared/Loader";
import ModalStyles from "../shared/ModalStyles";
import { toastr as toast } from "react-redux-toastr";
import deleteTerm from "../../services/deleteTerm";
import { Controlled as CodeMirror } from "react-codemirror2";

export default class EditTerm extends Component {
  /**
   * Declare and have an initial state for the term
   */
  state = {
    term: {
      name: "",
      property: {},
    },
    loading: true,
    /**
     * Example vocabularies to manage dynamic content.
     * @todo: Replace when implementing final vocabularies
     */
    vocabularies: [
      {
        name: "vocabulary1",
        value: "example vocab 1",
      },
      {
        name: "vocabulary2",
        value: "example vocab 2",
      },
    ],
  };

  /**
   * Vocabulary change method
   */
  handleVocabularyChange = () => {
    // @todo implement vocabulary change logic
  };

  /**
   * Get the mapping from the service
   */
  handlePropertyChange = (event) => {
    this.state.term.property[event.target.name] = event.target.value;
    this.setState({ term: this.state.term });
  };

  /**
   * Get the mapping from the service
   */
  handleSaveTerm = () => {
    updateTerm(this.state.term).then((response) => {
      if (response.success) {
        this.props.onRequestClose();
        toast.success("Changes Saved to  " + this.state.term.name);
      }
    });
  };

  /**
   * Remove the term from our records
   */
  handleRemoveTerm = () => {
    deleteTerm(this.state.term.id).then((response) => {
      if (response.removed) {
        this.props.onRemoveTerm(this.state.term);
        this.props.onRequestClose();
        toast.info("Term removed: " + this.state.term.name);
      }
    });
  };

  /**
   * Get the mapping from the service
   */
  goForTheTerm = () => {
    if (this.props.termId) {
      fetchTerm(this.props.termId).then((response) => {
        this.setState({
          term: response,
          loading: false,
        });
      });
    }
  };

  /**
   * Tasks on close
   */
  closeRequested = () => {
    this.setState({ loading: true });
    this.props.onRequestClose();
  };

  /**
   * Tasks before mount
   */
  componentDidMount() {
    Modal.setAppElement("body");
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.closeRequested}
        onAfterOpen={this.goForTheTerm}
        contentLabel="Edit Term"
        style={ModalStyles}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={false}
      >
        <div className="card ">
          <div className="card-header no-color-header">
            <div className="row">
              <div className="col-6">
                <h4>Editing Term <span className="col-primary">{this.state.term.name}</span></h4>
              </div>
              <div className="col-6">
                <a
                  className="float-right cursor-pointer"
                  onClick={this.props.onRequestClose}
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="card-body">
            {this.state.loading ? (
              <Loader />
            ) : (
              <React.Fragment>
                <div className="row">
                  {/* LEFT COLUMN */}

                  <div className="col-6">
                    <div className="form-group">
                      <label>Class/Type</label>
                      <input
                        type="text"
                        className="form-control"
                        name="classtype"
                        placeholder="Class/Type"
                        value={this.state.term.property.classtype}
                        onChange={(e) => this.handlePropertyChange(e)}
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <label>Element/Property</label>
                      <input
                        type="text"
                        className="form-control"
                        name="element"
                        placeholder="Element/Property"
                        value={this.state.term.property.element}
                        onChange={(e) => this.handlePropertyChange(e)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Definition</label>
                      <textarea
                        className="form-control"
                        name="comment"
                        value={this.state.term.property.comment}
                        onChange={(e) => this.handlePropertyChange(e)}
                        />
                    </div>

                    <div className="form-group">
                      <label>Path (optional)</label>
                      <textarea
                        className="form-control"
                        name="source_path"
                        value={this.state.term.property.source_path || ""}
                        onChange={(e) => this.handlePropertyChange(e)}
                      >
                        {this.state.term.property.source_path || ""}
                      </textarea>
                    </div>

                    <div className="form-group">
                      <label>Vocabulary (optional)</label>
                      {this.state.vocabularies.map((vocab) => {
                        return (
                          <div className="row" key={vocab.name}>
                            <div className="col-10">
                              <input
                                type="text"
                                className="form-control mb-2"
                                name={vocab.name}
                                value={vocab.value}
                                onChange={this.handleVocabularyChange}
                              />
                            </div>
                            <div className="col">
                              <button className="btn">
                                <i
                                  className="fa fa-times"
                                  aria-hidden="true"
                                ></i>
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
                        name="datatype"
                        value={this.state.term.property.datatype || ""}
                        onChange={(e) => this.handlePropertyChange(e)}
                        placeholder="Datatype"
                      />
                    </div>

                    <div style={{ height: "75%" }}>
                      <label>Raw</label>
                      <CodeMirror
                        value={JSON.stringify(this.state.term, null, 2)}
                        options={{ lineNumbers: true }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row float-right">
                  <div className="col">
                    <button
                      className="btn btn-outline-secondary mr-2"
                      onClick={this.handleRemoveTerm}
                    >
                      Remove Term
                    </button>
                    <button
                      className="btn btn-dark"
                      onClick={this.handleSaveTerm}
                    >
                      Save and Exit
                    </button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
