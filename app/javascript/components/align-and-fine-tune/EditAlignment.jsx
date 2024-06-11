import { useLocalStore } from 'easy-peasy';
import Modal from 'react-modal';
import updateAlignment from '../../services/updateAlignment';
import AlertNotice from '../shared/AlertNotice';
import ModalStyles from '../shared/ModalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTimes } from '@fortawesome/free-solid-svg-icons';
import { editAlignmentStore } from './stores/editAlignmentStore';
import { noMatchPredicate } from './stores/mappingStore';
import useDidMountEffect from '../../helpers/useDidMountEffect';

const EditAlignment = (props) => {
  Modal.setAppElement('body');

  const { alignment, modalIsOpen, onCommentUpdated, onRequestClose, predicate, spineTerm } = props;
  const [state, actions] = useLocalStore(() => editAlignmentStore({ comment: alignment?.comment }));
  const { comment, commentChanged } = state;

  const handleCommentChange = (e) => actions.handleCommentChange(e.target.value);

  const handleSaveComment = async () => {
    actions.setLoading(true);
    try {
      let response = await updateAlignment({
        id: alignment.id,
        comment: comment,
      });

      if (response.error) {
        actions.setError(response.error);
        return;
      }

      onCommentUpdated({ saved: true, comment: comment });
    } finally {
      actions.setLoading(false);
    }
  };

  useDidMountEffect(() => {
    if (modalIsOpen) actions.setComment(alignment?.comment);
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
              <div className="card">
                <div className="card-header">{predicate?.pref_label}</div>
              </div>
            </div>
            <div className="col-4">
              {predicate && noMatchPredicate(predicate)
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
              <textarea
                className="form-control"
                placeholder="add a comment about this alignment"
                value={comment || ''}
                onChange={handleCommentChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <button
                className="btn btn-dark mt-3 mr-3"
                onClick={handleSaveComment}
                disabled={!commentChanged || state.loading}
              >
                Save Comment
              </button>
              <button
                className="btn btn-link mt-3 col-primary"
                onClick={onRequestClose}
                disabled={state.loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditAlignment;
