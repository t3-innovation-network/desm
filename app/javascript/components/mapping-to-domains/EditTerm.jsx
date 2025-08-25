import { useEffect } from 'react';
import { useLocalStore } from 'easy-peasy';
import { flatMap } from 'lodash';
import Modal from 'react-modal';
import Loader from '../shared/Loader';
import ModalStyles from '../shared/ModalStyles';
import UploadVocabulary from './UploadVocabulary';
import { Controlled as CodeMirror } from 'react-codemirror2';
import rawTerm from './rawTerm';
import AlertNotice from '../shared/AlertNotice';
import ExpandableOptions from '../shared/ExpandableOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { showInfo, showSuccess } from '../../helpers/Messages';
import { editTermStore } from './stores/editTermStore';

function EditTerm(props) {
  const [state, actions] = useLocalStore(() => editTermStore());
  const {
    domainsAsOptions,
    rangeAsOptions,
    term,
    vocabularies,
    uploadingVocabulary,
    loading,
    expanded,
  } = state;
  const {
    handleVocabularyChange,
    handleRangeChange,
    handleDomainChange,
    handleVocabularyAdded,
    setUploadingVocabulary,
  } = actions;
  /**
   * Elements from props
   */
  const { modalIsOpen, isSpineTerm } = props;

  const handleChange = (event) => {
    const { name, value } = event.target;
    actions.handlePropertyChange({ name, value });
  };

  const handleSaveTerm = async () => {
    const response = await actions.handleSaveTerm();
    if (!response.error) {
      if (props.onUpdateTerm) props.onUpdateTerm(response);
      closeRequested();
      showSuccess('Changes Saved to  ' + term.name);
    }
  };

  const handleRemoveTerm = async () => {
    const response = await actions.handleRemoveTerm();
    if (!response.error) {
      props.onRemoveTerm(term);
      closeRequested();
      showInfo('Term removed: ' + term.name);
    }
  };

  const fetchInitialData = () => {
    if (props.termId) actions.fetchTermFromApi({ termId: props.termId, vocabularyConcepts: true });
  };

  const closeRequested = () => {
    actions.resetState();
    props.onRequestClose();
  };

  useEffect(() => {
    Modal.setAppElement('body');
    actions.getVocabularies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftColumn = () => (
    <div className={(uploadingVocabulary ? 'disabled-container ' : '') + 'col-6'}>
      <div className="card">
        <div className="card-body">
          <h5>
            <strong>Property/Element name</strong>
          </h5>

          <div className="form-group row">
            <div className="col-3">
              <label className="form-label">
                <strong>Property/Element URI</strong>
              </label>
            </div>
            <div className="col-9">
              <input
                type="text"
                className="form-control"
                name="uri"
                placeholder="Property/Element URI"
                value={term.property.uri || ''}
                onChange={handleChange}
                disabled={uploadingVocabulary}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-3">
              <label className="form-label">
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
                onChange={handleChange}
                disabled={uploadingVocabulary}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-3">
              <label className="form-label">
                <strong>Property/Element label</strong>
              </label>
            </div>
            <div className="col-9">
              <input
                type="text"
                className="form-control"
                name="label"
                placeholder="Property/Element Label"
                value={term.property.label || ''}
                onChange={handleChange}
                disabled={uploadingVocabulary}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-3">
              <label className="form-label">
                <strong>Scheme</strong>
              </label>
            </div>
            <div className="col-9">
              <input
                type="text"
                className="form-control"
                name="scheme"
                placeholder="Property/Element Scheme"
                value={term.property.scheme || ''}
                onChange={handleChange}
                disabled={uploadingVocabulary}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Definition</label>
        <textarea
          className="form-control"
          name="comment"
          value={term.property.comment || ''}
          onChange={handleChange}
          disabled={uploadingVocabulary}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Used on class(es)</label>
        <ExpandableOptions
          options={domainsAsOptions}
          selectedOption={term.property.selectedDomain}
          onClose={handleDomainChange}
          cardCssClass={'with-shadow w-100'}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Expected value type(s)</label>

        <ExpandableOptions
          options={rangeAsOptions}
          selectedOption={term.property.selectedRange}
          onClose={handleRangeChange}
          cardCssClass={'with-shadow w-100'}
        />
      </div>
      <div className="form-group">
        <label className="form-label">XPath/JSON Path (optional)</label>
        <input
          type="text"
          className="form-control"
          name="path"
          placeholder="XPath or JSON Path"
          value={term.property.path || ''}
          onChange={handleChange}
          disabled={uploadingVocabulary}
        ></input>
      </div>
      <div className="form-group">
        <button
          className="btn btn-link p-0 link-red"
          onClick={() => actions.setExpanded(!expanded)}
        >
          {expanded ? 'Hide Raw Data' : 'Show Raw Data'}
        </button>
        {expanded ? (
          <div style={{ height: '300px' }}>
            <CodeMirror
              value={JSON.stringify(rawTerm(term), null, 2)}
              options={{ lineNumbers: true }}
              disabled={uploadingVocabulary}
            />
          </div>
        ) : null}
      </div>
    </div>
  );

  const vocabuliesList = () => {
    if (isSpineTerm) {
      const concepts = flatMap(term.vocabularyConcepts.map((vc) => vc.concepts));
      return concepts.map((concept) => <div key={concept.id}>{concept.name}</div>);
    }

    return vocabularies.map((vocab) => {
      return (
        <div className={'desm-radio-primary'} key={vocab.id}>
          <input
            type="checkbox"
            value={vocab.id}
            id={vocab.id}
            name="vocabularies[]"
            onChange={(e) => handleVocabularyChange(e.target.value)}
            checked={term.vocabularies.some((v) => v.id == vocab.id)}
            disabled={uploadingVocabulary || isSpineTerm}
          />
          <label className="form-label" htmlFor={vocab.id}>
            {vocab.name_with_version || vocab.name}
          </label>
        </div>
      );
    });
  };

  const rightColumn = () => (
    <div className="col-6 d-flex flex-column" style={{ maxHeight: '45rem' }}>
      {!uploadingVocabulary && (
        <>
          <div className="row justify-content-between">
            <div className="col">
              <label className="form-label">
                {isSpineTerm ? 'Vocabulary Spine Terms' : 'Controlled Vocabulary (optional)'}
              </label>
            </div>
            {!isSpineTerm && (
              <div className="col">
                <a
                  className="link-red cursor-pointer float-end"
                  onClick={() => setUploadingVocabulary(true)}
                >
                  Add Controlled Vocabulary
                </a>
              </div>
            )}
          </div>
          <div className="card mb-3 scrollbar overflow-scroll h-100">
            <div className="card-body">
              <div className="desm-radio">{vocabuliesList()}</div>
            </div>
          </div>
        </>
      )}

      {uploadingVocabulary ? (
        <UploadVocabulary
          onVocabularyAdded={handleVocabularyAdded}
          onRequestClose={() => setUploadingVocabulary(false)}
        />
      ) : null}
    </div>
  );

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeRequested}
      onAfterOpen={fetchInitialData}
      contentLabel="Edit Term"
      style={{ content: { ...ModalStyles.content, maxHeight: '95vh' }, ...ModalStyles.overlay }}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <div className="card">
        <div className="card-header no-color-header">
          <div className="row">
            <div className="col-6">
              <h4>
                Editing Term <span className="col-primary">{term.name}</span>
              </h4>
            </div>
            <div className="col-6">
              <a className="float-end cursor-pointer" onClick={closeRequested}>
                <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="card-body scrollbar overflow-scroll">
          {state.hasErrors ? (
            <AlertNotice message={state.errors} onClose={actions.clearErrors} />
          ) : null}
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="row">
                {/* LEFT COLUMN */}
                {leftColumn()}
                {/* RIGHT COLUMN */}
                {rightColumn()}
              </div>
              {/* ACTIONS */}
              <div className="row ">
                <div className="col">
                  {!uploadingVocabulary && (
                    <>
                      {handleRemoveTerm && (
                        <button
                          className="btn btn-outline-secondary ms-2 float-end"
                          onClick={handleRemoveTerm}
                        >
                          Remove Term
                        </button>
                      )}
                      <button className="btn btn-dark float-end" onClick={handleSaveTerm}>
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

export default EditTerm;
