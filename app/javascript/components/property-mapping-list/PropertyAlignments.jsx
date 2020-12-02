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
     * List of alignments being shown
     */
    alignments: [],
    /**
     * Representation of an errors on this page process
     */
    errors: [],
    /**
     * Whether the page is loading results or not
     */
    loading: true,
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
class AlignmentCard extends Component {
  state = {
    /**
     * Whether we are rendering the alignment comment
     */
    showingAlignmentComment: false,
  };

  /**
   * Since there could be more than only 1 term mapped to a spine term,
   * this method will merge the desired property among all the mapped terms.
   *
   * It's usually only 1, but there may be cases when more than 1 term is mapped
   * to a spine term.
   *
   * @param {String} propertyName The name of the property to look after
   */
  printMappedTermProperty = (propertyName) => {
    const { alignment } = this.props;

    return alignment.mappedTerms
      .reduce((a, b) => a + (b[propertyName] + ", "), "")
      .slice(0, -2);
  };

  /**
   * Since there could be more than only 1 term mapped to a spine term,
   * this method will merge the desired property among all the mapped term
   * properties. It is, the property attributes of each mapped term.
   *
   * It's usually only 1, but there may be cases when more than 1 term is mapped
   * to a spine term.
   *
   * @param {String} propertyName The name of the property to look after
   */
  printMappedProperty = (propertyName) => {
    const { alignment } = this.props;

    return alignment.mappedTerms
      .reduce((a, b) => a + (b.property[propertyName] + ", "), "")
      .slice(0, -2);
  };

  render() {
    /**
     * Elements from props
     */
    const { alignment } = this.props;
    /**
     * Elements from state
     */
    const { showingAlignmentComment } = this.state;

    return (
      <div className="card borderless mb-3">
        <div className="card-header desm-rounded bottom-borderless bg-col-secondary">
          <div className="row">
            <div className="col-2">
              <small className="mt-3 col-on-primary-light">Organization</small>
              <h5>{alignment.origin}</h5>

              <small className="mt-3 col-on-primary-light">Schema</small>
              <h5>{alignment.origin}</h5>
            </div>
            <div className="col-2">
              <small className="mt-3 col-on-primary-light">
                Element/Property
              </small>
              <h5>{this.printMappedTermProperty("name")}</h5>

              <small className="mt-3 col-on-primary-light">Class/Type</small>
              <h5>{this.printMappedTermProperty("uri")}</h5>
            </div>
            <div className="col-6">
              <small className="mt-3 col-on-primary-light">Definition</small>
              <h5>{this.printMappedProperty("comment")}</h5>
            </div>
            <div className="col-2">
              <div className="card borderless">
                <div className="card-hader text-center bg-col-success col-background desm-rounded p-3">
                  <strong>
                    {alignment.predicate ? alignment.predicate.prefLabel : ""}
                  </strong>
                </div>
              </div>
              {alignment.comment && (
                <label
                  className="non-selectable float-right mt-3 col-primary cursor-pointer"
                  onClick={() =>
                    this.setState({
                      showingAlignmentComment: !showingAlignmentComment,
                    })
                  }
                >
                  {showingAlignmentComment
                    ? "Hide Alignment Notes"
                    : "Alignment Notes"}
                </label>
              )}
            </div>
          </div>

          {showingAlignmentComment && (
            <div className="row">
              <div className="col">
                <div className="card borderless">
                  <div className="card-body">
                    <h6 className="col-on-primary">Alingment Note</h6>
                    {alignment.comment}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
