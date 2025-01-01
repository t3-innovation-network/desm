import { useLocalStore } from 'easy-peasy';
import Modal from 'react-modal';
import HoverableText from '../shared/HoverableText';
import ModalStyles from '../shared/ModalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import Pluralize from 'pluralize';
import { domainsStore } from './stores/domainsStore';
import useDidMountEffect from '../../helpers/useDidMountEffect';

/**
 * Props:
 * @param {array} domains The collection of domains to display
 * @param {String} inputValue The value entered by the user in the search bar
 * @param {Boolean} modalIsOpen Whether to show or not the modal window
 * @param {Function} onFilterChange The actions to perform when the filter input changes
 * @param {Function} onRequestClose Actions to perform on closing
 * @param {Function} onSubmit The actions to perform when the user submits the form with
 *   the selected domains
 */
const MultipleDomainsModal = (props) => {
  Modal.setAppElement('body');

  const { inputValue, onFilterChange, modalIsOpen, onRequestClose } = props;
  const [state, actions] = useLocalStore(() => domainsStore({ domainsList: props.domains }));
  // `rdfs:Resource` is a dummy domain assigned to properties without a real one
  const [absentDomains, domains] = state.partitionDomains;

  useDidMountEffect(() => actions.updateDomains(props.domains), [props.domains]);
  useDidMountEffect(() => {
    if (!modalIsOpen) actions.resetData();
  }, [modalIsOpen]);

  /**
   * Selects all the domains if there are unselected among them. Otherwise, deselects all the domains.
   */
  const handleToggleSelectAll = () => actions.toggleSelectAll(!state.allSelected);
  /**
   * Actions to take when submitting the selection of the domains. We manage here to pass
   * over the selected domain ids as an array.
   */
  const handleSubmit = () => props.onSubmit(state.selectedDomainsUris);

  const renderDomain = (domain) => {
    const id = `chk-${domain.id}`;
    const isRDFS = domain.uri === 'rdfs:Resource';
    const primaryContent = isRDFS ? 'None' : domain.label;
    const secondaryContent = isRDFS ? 'properties with no domain declared' : domain.uri;

    return (
      <div className="desm-radio-primary" key={domain.id}>
        <input
          id={id}
          checked={domain.selected}
          name="domain-options"
          onChange={() => actions.toggleDomain(domain.id)}
          tabIndex={0}
          type="checkbox"
        />
        <HoverableText
          forComponent={id}
          primaryContent={primaryContent}
          secondaryContent={secondaryContent}
        />
      </div>
    );
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={onRequestClose}
      contentLabel="Multiple Domains Found"
      style={ModalStyles}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <div className="card" style={{ maxHeight: '45rem' }}>
        <div className="card-header">
          <div className="row">
            <div className="col-10">
              <h5 className="col-primary">
                <strong>{domains.length}</strong> {Pluralize('domain', domains.length)} found
              </h5>
            </div>
            <div className="col-2">
              <a className="float-end cursor-pointer" onClick={onRequestClose}>
                <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label className="form-label float-start">
                {Pluralize('domain', state.selectedDomainsSize, true)} selected
              </label>

              <button
                className="btn btn-dark float-end"
                onClick={handleSubmit}
                disabled={!state.selectedDomainsSize}
              >
                Done Selecting
              </button>

              <button className="btn btn-link float-end" onClick={handleToggleSelectAll}>
                {state.allSelected ? 'Deselect' : 'Select'} All
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label className="form-label">
                <strong>Please select one or more domains from the list to begin mapping</strong>
              </label>
              <div className="form-group input-group-has-icon">
                <FontAwesomeIcon icon={faSearch} className="form-control-feedback" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name"
                  value={inputValue}
                  onChange={onFilterChange}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-body has-scrollbar scrollbar">
          <div className="desm-radio">
            {absentDomains.map((d) => renderDomain(d))}
            {state.selectedFilteredDomains.map((d) => renderDomain(d))}
            {domains.map((d) => renderDomain(d))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MultipleDomainsModal;
