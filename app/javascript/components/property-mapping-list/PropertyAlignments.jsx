import React, { Component } from "react";
import fetchAlignmentsForSpineTerm from "../../services/fetchAlignmentsForSpineTerm";
import Loader from "../shared/Loader";

/**
 * @description A list of alignments with information like predicate, comment, and more.
 *   The alignments are built in form of separate cards.
 *
 * Props:
 * @param {Object} spineTerm The term of the spine to look for alignments
 */
export default class PropertyAlignments extends Component {
  /**
   * Representation of the state of this component
   */
  state = {
    /**
     * Representation of an errors on this page process
     */
    errors: [],
    /**
     * Whether the page is loading results or not
     */
    loading: true,
    /**
     * List of alignments being shown
     */
    alignments: [],
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  anyError(response) {
    const { errors } = this.state;

    if (response.error) {
      let tempErrors = errors;
      tempErrors.push(response.error);
      this.setState({ errors: tempErrors });
    }
    /// It will return a truthy value (depending no the existence
    /// of the error on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Use the service to get all the available alignments of a spine specification term
   */
  handleFetchAlignmentsForSpineTerm = async (spineTermId) => {
    let response = await fetchAlignmentsForSpineTerm(spineTermId);

    if (!this.anyError(response)) {
      this.setState({
        alignments: response.alignments.filter(
          (alignment) => alignment.predicateId
        ),
      });
    }
  };

  /**
   * Use the service to get all the necessary data
   */
  fetchData = () => {
    const { errors } = this.state;
    const { spineTerm } = this.props;
    this.setState({ loading: true });

    this.handleFetchAlignmentsForSpineTerm(spineTerm.id).then(() => {
      if (!errors.length) {
        this.setState({ loading: false });
      }
    });
  };

  /**
   * Tasks when the component mount
   */
  componentDidMount() {
    this.fetchData();
  }

  render() {
    /**
     * Elements from state
     */
    const { alignments } = this.state;
    /**
     * Elements from props
     */
    const { loading } = this.props;

    return loading ? (
      <Loader />
    ) : (
      alignments.map((alignment) => {
        return <AlignmentCard alignment={alignment} key={alignment.id} />;
      })
    );
  }
}

/**
 * Props:
 * @param {Object} alignment
 */
const AlignmentCard = (props) => {
  /**
   * Elements from props
   */
  const { alignment } = props;

  return (
    <div className="card borderless">
      <div className="card-header desm-rounded bottom-borderless bg-col-background">
        <div className="row">
          <div className="col-2">
            <small className="mt-3 col-on-primary-light">Organization</small>
            <h3></h3>

            <small className="mt-3 col-on-primary-light">Schema</small>
            <h3></h3>
          </div>
          <div className="col-2">
            <small className="mt-3 col-on-primary-light">
              Element/Property
            </small>
            <h3></h3>

            <small className="mt-3 col-on-primary-light">Class/Type</small>
            <h3></h3>
          </div>
          <div className="col-6">
            <small className="mt-3 col-on-primary-light">Definition</small>
            <h3></h3>
          </div>
          <div className="col-2">
            <div className="card borderless">
              <div className="card-hader text-center bg-col-primary col-background desm-rounded p-3">
                <strong>
                  {alignment.predicate ? alignment.predicate.prefLabel : ""}
                </strong>
              </div>
            </div>
            <label className="non-selectable float-right mt-3 col-primary cursor-pointer">
              Alignment Notes
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
