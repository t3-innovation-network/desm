import { useLocalStore } from 'easy-peasy';
import Modal from 'react-modal';
import updateAlignment from '../../services/updateAlignment';
import AlertNotice from '../shared/AlertNotice';
import ModalStyles from '../shared/ModalStyles';
import PredicateOptions from '../shared/PredicateOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTimes } from '@fortawesome/free-solid-svg-icons';
import { editAlignmentStore } from './stores/editAlignmentStore';
import useDidMountEffect from '../../helpers/useDidMountEffect';

const EditAlignment = (props) => {
  Modal.setAppElement('body');

  const {
    alignment,
    modalIsOpen,
    mode,
    onCommentUpdated,
    onPredicateUpdated,
    onRequestClose,
    predicate,
    predicates,
    spineTerm,
  } = props;

  const [state, actions] = useLocalStore(() =>
    editAlignmentStore({
      comment: alignment?.comment,
      selectedPredicate: predicate,
      currentMode: mode,
    })
  );
  const { comment, commentChanged, currentMode, predicateChanged, selectedPredicate } = state;

  const handleCommentChange = (e) => actions.handleCommentChange(e.target.value);

  const handleSaveComment = async () => {
    let response = await updateAlignment({
      id: alignment.id,
      comment: comment,
    });

    if (response.error) {
      actions.setError(response.error);
      return;
    }

    onCommentUpdated({ saved: true, comment: comment });
  };

  const handleSaveAlignment = async () => {
    // let response = await updateAlignment({
    //   id: alignment.id,
    //   predicateId: selectedPredicate.id,
    // });

    // if (response.error) {
    //   actions.setError(response.error);
    //   return;
    // }

    onPredicateUpdated({
      saved: true,
      term: alignment,
      predicate: selectedPredicate,
    });
  };

  useDidMountEffect(() => {
    if (modalIsOpen) actions.setCurrentMode(mode);
  }, [modalIsOpen]);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={onRequestClose}
      contentLabel="Comment"
      style={ModalStyles}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className="card">
        <div className="card-header">
          <FontAwesomeIcon icon={faComment} className="col-primary" />
          <a className="float-right cursor-pointer" onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} />
          </a>
        </div>
        <div className="card-body">
          {state.hasErrors && <AlertNotice message={state.errors} onClose={actions.clearErrors} />}
          <div className="row">
            <div className="col-4">
              <div className="card">
                <div className="card-header">{spineTerm.name}</div>
              </div>
            </div>
            <div className="col-4">
              {currentMode === 'comment' ? (
                <div className="card">
                  <div className="card-header">{predicate.pref_label}</div>
                </div>
              ) : (
                <PredicateOptions
                  predicates={predicates}
                  onPredicateSelected={actions.handlePredicateSelected}
                  predicate={predicate.pref_label}
                />
              )}
            </div>
            <div className="col-4">
              {state.selectedNoMatchPredicate
                ? null
                : alignment.mappedTerms.map((mTerm) => {
                    return (
                      <div key={mTerm.id} className="card mb-3">
                        <div className="card-header">{mTerm.name}</div>
                      </div>
                    );
                  })}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col form-group">
              {currentMode === 'comment' ? (
                <textarea
                  className="form-control"
                  placeholder="add a comment about this alignment"
                  value={comment || ''}
                  onChange={handleCommentChange}
                />
              ) : (
                comment
              )}
            </div>
          </div>
          <div className="row">
            <div className="col">
              {currentMode === 'comment' ? (
                <button
                  className="btn btn-dark mt-3 mr-3"
                  onClick={handleSaveComment}
                  disabled={!commentChanged}
                >
                  Save Comment
                </button>
              ) : (
                <button
                  className="btn btn-dark mt-3 mr-3"
                  onClick={handleSaveAlignment}
                  disabled={!predicateChanged}
                >
                  Change Predicate
                </button>
              )}
              {currentMode === 'comment' ? (
                <a
                  className="btn col-primary cursor-pointer mt-3"
                  onClick={() => actions.setCurrentMode('edit')}
                >
                  Edit
                </a>
              ) : (
                <a
                  className="btn col-primary cursor-pointer mt-3"
                  onClick={() => actions.setCurrentMode('comment')}
                >
                  Comment
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditAlignment;
