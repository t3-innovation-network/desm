import { Component } from 'react';
import Modal from 'react-modal';
import fetchTerm from '../../services/fetchTerm';
import updateTerm from '../../services/updateTerm';
import Loader from '../shared/Loader';
import ModalStyles from '../shared/ModalStyles';
import UploadVocabulary from './UploadVocabulary';
import deleteTerm from '../../services/deleteTerm';
import { Controlled as CodeMirror } from 'react-codemirror2';
import fetchVocabularies from '../../services/fetchVocabularies';
import rawTerm from './rawTerm';
import AlertNotice from '../shared/AlertNotice';
import ExpandableOptions from '../shared/ExpandableOptions';
import createVocabulary from '../../services/createVocabulary';
import { readNodeAttribute, vocabName } from './../../helpers/Vocabularies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import extractVocabularies from '../../services/extractVocabularies';
import _ from 'lodash';
import { showInfo, showSuccess } from '../../helpers/Messages';

export default class EditTerm extends Component {
  /**
   * Declare and have an initial state for the term
   */
  state = {
    term: {
      name: '',
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
   * Prepare the domains of a term to be listed as options for the expandable component
   *
   * @param {Array} domains
   */
  domainsAsOptions = (domains) => {
    if (!_.isArray(domains)) {
      domains = [domains];
    }

    return domains
      ? domains.map((domain, i) => {
          return {
            id: i,
            name: readNodeAttribute(domain, '@id'),
          };
        })
      : [];
  };

  /**
   * Prepare the domains of a term to be listed as options for the expandable component
   *
   * @param {Array} domains
   */
  rangeAsOptions = (range) => {
    if (!_.isArray(range)) {
      range = [range];
    }

    return range
      ? range.map((rng, i) => {
          return {
            id: i,
            name: readNodeAttribute(rng, '@id'),
          };
        })
      : [];
  };

  /**
   * Domain change
   */
  handleDomainChange = (val) => {
    let tempTerm = this.state.term;
    tempTerm.property.selectedDomain = val;
    this.setState({ term: tempTerm });
  };

  /**
   * Range change
   */
  handleRangeChange = (val) => {
    let tempTerm = this.state.term;
    tempTerm.property.selectedRange = val;
    this.setState({ term: tempTerm });
  };

  /**
   * Vocabulary change
   */
  handleVocabularyChange = (val) => {
    let tempTerm = { ...this.state.term };
    if (tempTerm.vocabularies.find((vocab) => vocab.id == val)) {
      tempTerm.vocabularies = tempTerm.vocabularies.filter((vocab) => vocab.id != val);
    } else {
      tempTerm.vocabularies.push(this.state.vocabularies.find((vocab) => vocab.id == val));
    }

    this.setState({ term: tempTerm });
  };

  /**
   * Get the mapping from the service
   */
  handlePropertyChange = (event) => {
    let term = { ...this.state.term };
    term.property[event.target.name] = event.target.value;
    this.setState({ term: term });
  };

  /**
   * Get the mapping from the service
   */
  handleSaveTerm = () => {
    updateTerm(this.state.term).then((response) => {
      if (response.error) {
        this.setState({ error: response.error });
        return;
      }
      if (this.props.onUpdateTerm) this.props.onUpdateTerm(response);
      this.closeRequested();
      showSuccess('Changes Saved to  ' + this.state.term.name);
    });
  };

  /**
   * Remove the term from our records
   */
  handleRemoveTerm = () => {
    deleteTerm(this.state.term.id).then((response) => {
      if (response.error) {
        this.setState({ error: response.error });
        return;
      }
      this.props.onRemoveTerm(this.state.term);
      this.closeRequested();
      showInfo('Term removed: ' + this.state.term.name);
    });
  };

  /**
   * Add the new vocabulary to our editing term
   *
   * @param {Object} vocab
   */
  handleVocabularyAdded = async (data) => {
    document.body.classList.add('waiting');

    const { vocabularies } = await extractVocabularies(data.vocabulary.content);

    const newVocabs = await Promise.all(
      vocabularies.map(async (content) => {
        try {
          const name = vocabName(content['@graph']);

          if (!name) {
            return;
          }

          const { vocabulary } = await createVocabulary({ vocabulary: { content, name } });
          return vocabulary;
        } catch {
          return null;
        }
      })
    );

    const { term } = this.state;
    const newVocabOptions = newVocabs.filter(Boolean).map((v) => ({ id: v.id, name: v.name }));

    this.setState({
      vocabularies: _.uniqBy([...this.state.vocabularies, ...newVocabOptions], (v) => v.name),
    });

    term.vocabularies = _.uniqBy([...term.vocabularies, ...newVocabOptions], (v) => v.name);

    this.setState({ term });
    document.body.classList.remove('waiting');
  };

  /**
   * Get the mapping from the service
   */
  fetchTermFromApi = () => {
    if (this.props.termId) {
      fetchTerm(this.props.termId, { withMapping: true }).then((response) => {
        if (response.error) {
          this.setState({ error: response.error });
          return;
        }
        this.setState({
          term: response.term,
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
    this.setState({ error: null });
    this.props.onRequestClose();
  };

  getVocabularies = () => {
    fetchVocabularies().then((response) => {
      if (response.error) {
        this.setState({ error: response.error });
        return;
      }
      this.setState({ vocabularies: response.vocabularies });
    });
  };

  /**
   * Tasks before mount
   */
  componentDidMount() {
    Modal.setAppElement('body');
    this.getVocabularies();
  }

  render() {
    /**
     * Elements from state
     */
    const { term, error, loading, uploadingVocabulary, vocabularies } = this.state;

    /**
     * Elements from props
     */
    const { modalIsOpen } = this.props;

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={this.closeRequested}
        onAfterOpen={this.fetchTermFromApi}
        contentLabel="Edit Term"
        style={{ ...ModalStyles }}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
      >
        <div className="card ">
          <div className="card-header no-color-header">
            <div className="row">
              <div className="col-6">
                <h4>
                  Editing Term <span className="col-primary">{term.name}</span>
                </h4>
              </div>
              <div className="col-6">
                <a className="float-right cursor-pointer" onClick={this.closeRequested}>
                  <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="card-body scrollbar has-scrollbar">
            {error ? (
              <AlertNotice
                message={error}
                onClose={() =>
                  this.setState({
                    error: null,
                  })
                }
              />
            ) : (
              ''
            )}
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="row">
                  {/* LEFT COLUMN */}
                  <div className={(uploadingVocabulary ? 'disabled-container ' : '') + 'col-6'}>
                    <div className="card">
                      <div className="card-body">
                        <h5>
                          <strong>Property name</strong>
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
                              value={term.property.uri}
                              onChange={this.handlePropertyChange}
                              disabled={uploadingVocabulary}
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
                              name="sourceUri"
                              placeholder="Source URI"
                              value={term.property.sourceUri || ''}
                              onChange={this.handlePropertyChange}
                              disabled={uploadingVocabulary}
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
                              placeholder="Property Label"
                              value={term.property.label}
                              onChange={this.handlePropertyChange}
                              disabled={uploadingVocabulary}
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-3">
                            <label>
                              <strong>Scheme</strong>
                            </label>
                          </div>
                          <div className="col-9">
                            <input
                              type="text"
                              className="form-control"
                              name="scheme"
                              placeholder="Property Scheme"
                              value={term.property.scheme || ''}
                              onChange={this.handlePropertyChange}
                              disabled={uploadingVocabulary}
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
                        value={term.property.comment}
                        onChange={this.handlePropertyChange}
                        disabled={uploadingVocabulary}
                      />
                    </div>

                    <div className="form-group">
                      <label>Selected Domain</label>

                      <ExpandableOptions
                        options={this.domainsAsOptions(term.property.domain)}
                        selectedOption={term.property.selectedDomain}
                        onClose={(domain) => this.handleDomainChange(domain.name)}
                        cardCssClass={'with-shadow'}
                      />
                    </div>

                    <div className="form-group">
                      <label>Selected Range</label>

                      <ExpandableOptions
                        options={this.rangeAsOptions(term.property.range)}
                        selectedOption={term.property.selectedRange}
                        onClose={(range) => this.handleRangeChange(range.name)}
                        cardCssClass={'with-shadow'}
                      />
                    </div>

                    <div className="form-group">
                      <label>XPath/JSON Path (optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="path"
                        placeholder="XPath or JSON Path"
                        value={term.property.path || ''}
                        onChange={this.handlePropertyChange}
                        disabled={uploadingVocabulary}
                      ></input>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}

                  <div className="col-6">
                    {!uploadingVocabulary && (
                      <div className="form-group">
                        <label>Vocabulary (optional)</label>
                        <div className="card mb-2 has-scrollbar scrollbar desm-check-container-sm">
                          <div className="card-body">
                            <div className="desm-radio">
                              {vocabularies.map((vocab) => {
                                return (
                                  <div className={'desm-radio-primary'} key={vocab.id}>
                                    <input
                                      type="checkbox"
                                      value={vocab.id}
                                      id={vocab.id}
                                      name="vocabularies[]"
                                      onChange={(e) => this.handleVocabularyChange(e.target.value)}
                                      checked={term.vocabularies.some((v) => v.id == vocab.id)}
                                      disabled={uploadingVocabulary}
                                    />
                                    <label htmlFor={vocab.id}>{vocab.name}</label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            {!uploadingVocabulary && (
                              <a
                                className="col-on-primary cursor-pointer float-right"
                                onClick={() => this.setState({ uploadingVocabulary: true })}
                              >
                                Add Vocabulary
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {uploadingVocabulary ? (
                      <UploadVocabulary
                        onVocabularyAdded={this.handleVocabularyAdded}
                        onRequestClose={() =>
                          this.setState({
                            uploadingVocabulary: false,
                          })
                        }
                      />
                    ) : (
                      <>
                        <div style={{ height: '78%' }}>
                          <label>
                            <strong>Raw</strong>
                          </label>
                          <CodeMirror
                            value={JSON.stringify(rawTerm(term), null, 2)}
                            options={{ lineNumbers: true }}
                            disabled={uploadingVocabulary}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="row ">
                  <div className="col">
                    {!uploadingVocabulary && (
                      <>
                        <button
                          className="btn btn-outline-secondary ml-2 float-right"
                          onClick={this.handleRemoveTerm}
                        >
                          Remove Term
                        </button>
                        <button className="btn btn-dark float-right" onClick={this.handleSaveTerm}>
                          Save and Exit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
