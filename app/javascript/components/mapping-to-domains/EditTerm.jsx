import React, { Component } from "react";
import Modal from "react-modal";
import fetchTerm from "../../services/fetchTerm";
import updateTerm from "../../services/updateTerm";
import Loader from "../shared/Loader";
import ModalStyles from "../shared/ModalStyles";
import UploadVocabulary from "./UploadVocabulary";
import { toastr as toast } from "react-redux-toastr";
import deleteTerm from "../../services/deleteTerm";
import { Controlled as CodeMirror } from "react-codemirror2";
import fetchVocabularies from "../../services/fetchVocabularies";

export default class EditTerm extends Component {
  /**
   * Declare and have an initial state for the term
   */
  state = {
    term: {
      name: "",
      property: {},
      vocabularies: [],
    },
    /**
     * Whether the page is loading or not
     */
    loading: true,
    /**
     * To upload a vocabulary, we need to show a different form. It will manage the
     * switch between one form and the other
     */
    uploadingVocabulary: false,
    /**
     * The list of vocabularies that can be related to this term
     */
    vocabularies: [],
  };

  /**
   * Vocabulary change method
   */
  handleVocabularyChange = (val) => {
    // @todo implement vocabulary change logic
    let tempTerm = this.state.term;
    if (tempTerm.vocabularies.find((vocab) => vocab.id == val)) {
      tempTerm.vocabularies = tempTerm.vocabularies.filter(
        (vocab) => vocab.id != val
      );
    } else {
      tempTerm.vocabularies.push(
        this.state.vocabularies.find((vocab) => vocab.id == val)
      );
    }

    this.setState({ term: tempTerm });
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
   * Add the new vocabulary to our editing term
   *
   * @param {Object} vocab
   */
  handleVocabularyAdded = (vocab) => {
    let tempTerm = this.state.term;
    /// Add new vocabulary to the list of available ones
    this.state.vocabularies.push({
      id: vocab.id,
      name: vocab.name,
    });
    /// Add new vocabulary to the term selected vocabularies
    tempTerm.vocabularies.push({
      id: vocab.id,
      name: vocab.name,
    });
    this.setState({ term: tempTerm });
  };

  /**
   * Get the mapping from the service
   */
  fetchTermFromApi = () => {
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

  getVocabularies = () => {
    fetchVocabularies().then((response) => {
      this.setState({ vocabularies: response });
    });
  };

  /**
   * Tasks before mount
   */
  componentDidMount() {
    Modal.setAppElement("body");
    this.getVocabularies();
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.closeRequested}
        onAfterOpen={this.fetchTermFromApi}
        contentLabel="Edit Term"
        style={ModalStyles}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <div className="card ">
          <div className="card-header no-color-header">
            <div className="row">
              <div className="col-6">
                <h4>
                  Editing Term{" "}
                  <span className="col-primary">{this.state.term.name}</span>
                </h4>
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

                  <div
                    className={
                      (this.state.uploadingVocabulary
                        ? "disabled-container "
                        : "") + "col-6"
                    }
                  >
                    <div className="form-group">
                      <label>Class/Type</label>
                      <input
                        type="text"
                        className="form-control"
                        name="classtype"
                        placeholder="Class/Type"
                        value={this.state.term.property.classtype}
                        onChange={(e) => this.handlePropertyChange(e)}
                        disabled={this.state.uploadingVocabulary}
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
                        disabled={this.state.uploadingVocabulary}
                      />
                    </div>

                    <div className="form-group">
                      <label>Definition</label>
                      <textarea
                        className="form-control"
                        name="comment"
                        value={this.state.term.property.comment}
                        onChange={(e) => this.handlePropertyChange(e)}
                        disabled={this.state.uploadingVocabulary}
                      />
                    </div>

                    <div className="form-group">
                      <label>Path (optional)</label>
                      <textarea
                        className="form-control"
                        name="source_path"
                        value={this.state.term.property.source_path || ""}
                        onChange={(e) => this.handlePropertyChange(e)}
                        disabled={this.state.uploadingVocabulary}
                      >
                        {this.state.term.property.source_path || ""}
                      </textarea>
                    </div>

                    <div className="form-group">
                      <label>Vocabulary (optional)</label>
                      <div
                        className="card mt-2 mb-2 has-scrollbar scrollbar"
                        style={{ maxHeight: "10rem" }}
                      >
                        <div className="card-body">
                          <div className="desm-radio">
                            {this.state.vocabularies.map((vocab) => {
                              return (
                                <div
                                  className={"desm-radio-primary"}
                                  key={vocab.id}
                                >
                                  <input
                                    type="checkbox"
                                    value={vocab.id}
                                    id={vocab.id}
                                    name="vocabularies[]"
                                    onChange={(e) =>
                                      this.handleVocabularyChange(
                                        e.target.value
                                      )
                                    }
                                    checked={this.state.term.vocabularies.some(
                                      (v) => v.id == vocab.id
                                    )}
                                    disabled={this.state.uploadingVocabulary}
                                  />
                                  <label htmlFor={vocab.id}>{vocab.name}</label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}

                  <div className="col-6">
                    {this.state.uploadingVocabulary ? (
                      <UploadVocabulary
                        term={this.state.term}
                        onVocabularyAdded={this.handleVocabularyAdded}
                        onRequestClose={() =>
                          this.setState({
                            uploadingVocabulary: false,
                          })
                        }
                      />
                    ) : (
                      <React.Fragment>
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

                        <div style={{ height: "78%" }}>
                          <label>Raw</label>
                          <CodeMirror
                            value={JSON.stringify(this.state.term, null, 2)}
                            options={{ lineNumbers: true }}
                            disabled={this.state.uploadingVocabulary}
                          />
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>

                <div className="row ">
                  <div className="col float-left">
                    {!this.state.uploadingVocabulary && (
                      <button
                        className="btn btn-dark"
                        onClick={() =>
                          this.setState({ uploadingVocabulary: true })
                        }
                      >
                        Add Vocabulary
                      </button>
                    )}
                  </div>
                  <div className="col float-right">
                    {!this.state.uploadingVocabulary && (
                      <React.Fragment>
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
                      </React.Fragment>
                    )}
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