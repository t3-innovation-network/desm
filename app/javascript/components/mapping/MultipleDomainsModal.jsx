import React, { Component } from "react";
import Modal from "react-modal";
import HoverableText from "../shared/HoverableText";
import ModalStyles from "../shared/ModalStyles";

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
  selectedDomains = () =>
    this.state.domainsList.filter((domain) => domain.selected);

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
   * Tasks when mounting this component
   */
  componentDidMount() {
    Modal.setAppElement("body");
  }

  /**
   * Update the list of domains in the state
   *
   * @param {Array} prevProps
   */
  componentDidUpdate(prevProps) {
    if (this.props.domains !== prevProps.domains) {
      this.setState({ domainsList: this.props.domains });
    }
  }

  render() {
    /**
     * Elements from props
     */
    const {
      domains,
      inputValue,
      onFilterChange,
      modalIsOpen,
      onRequestClose,
    } = this.props;

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onRequestClose}
        contentLabel="Multiple Domains Found"
        style={ModalStyles}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
      >
        <div className="card" style={{ maxHeight: "45rem" }}>
          <div className="card-header">
            <div className="row">
              <div className="col-10">
                <h5 className="col-primary">
                  <strong>{domains.length}</strong> domains found
                </h5>
              </div>
              <div className="col-2">
                <a
                  className="float-right cursor-pointer"
                  onClick={onRequestClose}
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
                </a>
              </div>
            </div>

            <div className="row">
              <div className="col-10">
                <label>
                  {this.selectedDomains().length + " domains selected"}
                </label>
              </div>
              <div className="col-2">
                <button
                  className="btn btn-block btn-dark"
                  onClick={() => this.handleSubmit()}
                  disabled={!this.selectedDomains().length}
                >
                  Done Selection
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <strong>
                  Please select one or more domains from the list to begin
                  mapping
                </strong>
                <div className="form-group input-group-has-icon">
                  <span className="fa fa-search form-control-feedback"></span>
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
              {domains.map((dom) => {
                return (
                  <div className="desm-radio-primary" key={"radio-" + dom.id}>
                    <input
                      type="checkbox"
                      name="domain-options"
                      id={"chk-" + dom.id}
                      onClick={() => this.handleDomainClick(dom.id)}
                    />
                    <HoverableText
                      forComponent={"chk-" + dom.id}
                      primaryContent={dom.label}
                      secondaryContent={dom.uri}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
