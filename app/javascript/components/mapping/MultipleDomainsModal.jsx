import { Component } from 'react';
import Modal from 'react-modal';
import HoverableText from '../shared/HoverableText';
import ModalStyles from '../shared/ModalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { partition } from 'lodash';
import Pluralize from 'pluralize';

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
export default class MultipleDomainsModal extends Component {
  /**
   * Representation of the state of this component
   */
  state = {
    /**
     * The complete list of available domains.
     */
    domainsList: this.props.domains,
  };

  /**
   * The list of selected domains. The ones the user selects
   */
  selectedDomains = () => this.state.domainsList.filter((domain) => domain.selected);

  allSelected = () => this.selectedDomains().length === this.props.domains.length;

  /**
   * Actions to execute when a domain is clicked
   *
   * @param {Integer} domId
   */
  handleDomainClick = (domId) => {
    const { domainsList } = this.state;

    let dom = domainsList.find((d) => d.id == domId);
    dom.selected = !dom.selected;

    this.setState({ domainsList: domainsList });
  };

  /**
   * Actions to take when submitting the selection of the domains. We manage here to pass
   * over the selected domain ids as an array.
   */
  handleSubmit = () => {
    const { onSubmit } = this.props;

    onSubmit(this.selectedDomains().map((domain) => domain.uri));
  };

  /**
   * Selects all the domains if there are unselected among them. Otherwise, deselects all the domains.
   */
  handleToggleSelectAll = () => {
    const { domainsList } = this.state;
    const selected = !this.allSelected();
    this.setState({ domainsList: domainsList.map((d) => ({ ...d, selected })) });
  };

  /**
   * Tasks when mounting this component
   */
  componentDidMount() {
    Modal.setAppElement('body');
  }

  /**
   * Update the list of domains in the state
   *
   * @param {Array} prevProps
   */
  componentDidUpdate(prevProps) {
    if (this.props.domains !== prevProps.domains) {
      this.setState({ domainsList: this.props.domains.map((d) => ({ ...d, selected: false })) });
    }
  }

  renderDomain(domain, primaryContent, secondaryContent) {
    const id = `chk-${domain.id}`;

    return (
      <div className="desm-radio-primary" key={domain.id}>
        <input
          id={id}
          checked={domain.selected}
          name="domain-options"
          onChange={() => this.handleDomainClick(domain.id)}
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
  }

  render() {
    /**
     * Elements from props
     */
    const { inputValue, onFilterChange, modalIsOpen, onRequestClose } = this.props;
    // `rdfs:Resource` is a dummy domain assigned to properties without a real one
    const [absentDomains, domains] = partition(
      this.state.domainsList,
      (d) => d.uri === 'rdfs:Resource'
    );

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
                  <strong>{domains.length}</strong> domains found
                </h5>
              </div>
              <div className="col-2">
                <a className="float-right cursor-pointer" onClick={onRequestClose}>
                  <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <label className="float-left">
                  {Pluralize('domain', this.selectedDomains().length, true)} selected
                </label>

                <button
                  className="btn btn-dark float-right"
                  onClick={() => this.handleSubmit()}
                  disabled={!this.selectedDomains().length}
                >
                  Done Selecting
                </button>

                <button
                  className="btn btn-link float-right"
                  onClick={() => this.handleToggleSelectAll()}
                >
                  {this.allSelected() ? 'Deselect' : 'Select'} All
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <strong>Please select one or more domains from the list to begin mapping</strong>
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
              {absentDomains.map((d) =>
                this.renderDomain(d, 'None', 'properties with no domain declared')
              )}
              {domains.map((d) => this.renderDomain(d, d.label, d.uri))}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
