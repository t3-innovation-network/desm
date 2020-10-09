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
import rawTerm from "./rawTerm";
import AlertNotice from "../shared/AlertNotice";

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
     * Manages the errors on this view
     */
    error: null,
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
   * Domain change
   */
  handleDomainChange = (val) => {
    // @todo: implement domain change logic
  };

  /**
   * Vocabulary change
   */
  handleVocabularyChange = (val) => {
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
      if (response.error) {
        this.setState({ error: response.error });
      }
      this.props.onRemoveTerm(this.state.term);
      this.props.onRequestClose();
      toast.info("Term removed: " + this.state.term.name);
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
                  {this.state.error ? (
                    <AlertNotice message={this.state.error} />
                  ) : (
                    ""
                  )}

                  {/* LEFT COLUMN */}
                  <div
                    className={
                      (this.state.uploadingVocabulary
                        ? "disabled-container "
                        : "") + "col-6"
                    }
                  >
                    <div className="card">
                      <div className="card-body">
                        <h5>
                          <strong>Element/Property</strong>
                        </h5>

                        <div className="form-group row">
                          <div className="col-3">
                            <label>
                              <strong>Property URI</strong>
                            </label>
                          </div>
                          <div className="col-9">
                            <input
                              type="text"
                              className="form-control"
                              name="uri"
                              placeholder="Property URI"
                              value={this.state.term.property.uri}
                              onChange={(e) => this.handlePropertyChange(e)}
                              disabled={this.state.uploadingVocabulary}
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-3">
                            <label>
                              <strong>Source URI</strong>
                            </label>
                          </div>
                          <div className="col-9">
                            <input
                              type="text"
                              className="form-control"
                              name="source_uri"
                              placeholder="Source URI"
                              value={this.state.term.property.source_uri || ""}
                              onChange={(e) => this.handlePropertyChange(e)}
                              disabled={this.state.uploadingVocabulary}
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-3">
                            <label>
                              <strong>Property label</strong>
                            </label>
                          </div>
                          <div className="col-9">
                            <input
                              type="text"
                              className="form-control"
                              name="label"
                              placeholder="Porperty Label"
                              value={this.state.term.property.label}
                              onChange={(e) => this.handlePropertyChange(e)}
                              disabled={this.state.uploadingVocabulary}
                            />
                          </div>
                        </div>
                      </div>
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
                      <label>Domain</label>
                      <div className="card mb-2 has-scrollbar scrollbar desm-check-container-sm">
                        <div className="card-body">
                          <div className="desm-radio">
                            {this.state.term.property.domain &&
                              this.state.term.property.domain.map((dom) => {
                                return (
                                  <div
                                    className={"desm-radio-primary"}
                                    key={dom}
                                  >
                                    <input
                                      type="checkbox"
                                      value={dom}
                                      id={dom}
                                      name="vocabularies[]"
                                      onChange={(e) =>
                                        this.handleDomainChange(e.target.value)
                                      }
                                      disabled={true}
                                    />
                                    <label htmlFor={dom}>{dom}</label>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Range</label>
                      <input
                        type="text"
                        className="form-control"
                        name="range"
                        value={this.state.term.property.range || ""}
                        onChange={(e) => this.handlePropertyChange(e)}
                        placeholder="Datatype"
                      />
                    </div>

                    <div className="form-group">
                      <label>XPath/JSON Path (optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="path"
                        placeholder="XPath or JSON Path"
                        value={this.state.term.property.path || ""}
                        onChange={(e) => this.handlePropertyChange(e)}
                        disabled={this.state.uploadingVocabulary}
                      ></input>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}

                  <div className="col-6">
                    {!this.state.uploadingVocabulary && (
                      <div className="form-group">
                        <label>Vocabulary (optional)</label>
                        <div className="card mb-2 has-scrollbar scrollbar desm-check-container-sm">
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
                                    <label htmlFor={vocab.id}>
                                      {vocab.name}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            {!this.state.uploadingVocabulary && (
                              <a
                                className="col-on-primary cursor-pointer float-right"
                                onClick={() =>
                                  this.setState({ uploadingVocabulary: true })
                                }
                              >
                                Add Vocabulary
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

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
                        <div style={{ height: "78%" }}>
                          <label>
                            <strong>Raw</strong>
                          </label>
                          <CodeMirror
                            value={JSON.stringify(
                              rawTerm(this.state.term),
                              null,
                              2
                            )}
                            options={{ lineNumbers: true }}
                            disabled={this.state.uploadingVocabulary}
                          />
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>

                <div className="row ">
                  <div className="col">
                    {!this.state.uploadingVocabulary && (
                      <React.Fragment>
                        <button
                          className="btn btn-outline-secondary ml-2 float-right"
                          onClick={this.handleRemoveTerm}
                        >
                          Remove Term
                        </button>
                        <button
                          className="btn btn-dark float-right"
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
