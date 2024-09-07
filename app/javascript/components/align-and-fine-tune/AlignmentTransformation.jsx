import { useLocalStore } from 'easy-peasy';
import Modal from 'react-modal';
import updateAlignment from '../../services/updateAlignment';
import AlertNotice from '../shared/AlertNotice';
import ModalStyles from '../shared/ModalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { transformationAlignmentStore } from './stores/transformationAlignmentStore';
import useDidMountEffect from '../../helpers/useDidMountEffect';
import { i18n } from 'utils/i18n';

const AlignmentTransformation = (props) => {
  Modal.setAppElement('body');

  const { alignment, isOpen, onUpdate, onClose } = props;
  const [state, actions] = useLocalStore(() =>
    transformationAlignmentStore({
      transformation: alignment?.transformation || {},
      initialData: alignment?.transformation || {},
    })
  );
  const { transformation, withChanges } = state;

  const handleToChange = (e) => actions.handleChange({ to: e.target.value });
  const handleFromChange = (e) => actions.handleChange({ from: e.target.value });

  const handleSave = async () => {
    actions.setLoading(true);
    try {
      let response = await updateAlignment({
        id: alignment.id,
        transformation,
      });

      if (response.error) {
        actions.setError(response.error);
        return;
      }

      onUpdate({ saved: true, transformation });
    } finally {
      actions.setLoading(false);
    }
  };

  useDidMountEffect(() => {
    if (isOpen) actions.setTransformation(alignment?.transformation);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={i18n.t('ui.mapping.transformation.title')}
      style={ModalStyles}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
    >
      <div className="card">
        <div className="card-header">
          <FontAwesomeIcon icon={faLeftRight} className="col-primary" />
          <a className="float-right cursor-pointer" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </a>
        </div>
        <div className="card-body">
          {state.hasErrors && <AlertNotice message={state.errors} onClose={actions.clearErrors} />}
          <div className="row">
            <div className="col col-12 form-group">
              <label>{i18n.t('ui.mapping.transformation.form.to.label')}</label>
              <input
                type="text"
                className="form-control"
                placeholder={i18n.t('ui.mapping.transformation.form.to.placeholder')}
                value={transformation.to || ''}
                onChange={handleToChange}
                autoFocus
              />
            </div>
            <div className="col col-12 form-group">
              <label>{i18n.t('ui.mapping.transformation.form.from.label')}</label>
              <input
                type="text"
                className="form-control"
                placeholder={i18n.t('ui.mapping.transformation.form.from.placeholder')}
                value={transformation.from || ''}
                onChange={handleFromChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <button
                className="btn btn-dark mt-3 mr-3"
                onClick={handleSave}
                disabled={!withChanges || state.loading}
              >
                {i18n.t('ui.mapping.transformation.form.save')}
              </button>
              <button
                className="btn btn-link mt-3 col-primary"
                onClick={onClose}
                disabled={state.loading}
              >
                {i18n.t('ui.buttons.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AlignmentTransformation;
