import { Component } from 'react';
import AlertNotice from '../shared/AlertNotice';
import Loader from '../shared/Loader';
import ProgressReportBar from '../shared/ProgressReportBar';

/**
 * Props:
 * @param {Function} onAlignmentScoreFetched
 * @param {Array} organizations
 * @param {Array} predicates
 * @param {Object} term
 * @param {Object} selectedDomain
 */
export default class PropertyCard extends Component {
  /**
   * Representation of the state of this component
   */
  state = {
    /**
     * The current mapping weight value for this term
     */
    currentMappingWeight: 0,
    /**
     * Representation of an errors on this page process
     */
    errors: [],
    /**
     * Whether the page is loading results or not
     */
    loading: true,
    /**
     * The maximum possible mapping weight value for this term
     */
    maxMappingWeight: 5,
  };

  /**
   * @description Performs the calculation for a given spine term of the mapping weight. This is
   * the sum of the weights of every predicate of a term mapped to it.
   * It also performs the calculation of the maximum possible value that the mapping weight can take.
   * It depends on the amount of organizations that mapped to the given term.
   */
  calculateMappingWeights = async () => {
    const { term } = this.props;

    this.setState({
      currentMappingWeight: this.calculateCurrentWeight(term.alignments),
      maxMappingWeight: term.maxMappingWeight,
    });
  };

  /**
   * Performs the sum of the weight of the predicates involved in the fetched alignments
   *
   * @param {Array} alignments
   */
  calculateCurrentWeight = (alignments) => {
    return alignments.reduce((a, b) => a + this.predicateWeight(b.predicateId), 0);
  };

  /**
   * Returns the weight of the predicate with the given id
   *
   * @param {Integer} predicateId
   */
  predicateWeight = (predicateId) => {
    if (!predicateId) {
      return 0;
    }

    const { predicates } = this.props;
    let pred = predicates.find((predicate) => predicate.id == predicateId);

    return pred.weight;
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  anyError(response) {
    if (response.error) {
      this.setState({ errors: [...this.state.errors, response.error] });
    }
    /// It will return a truthy value (depending no the existence
    /// of the error on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Perform the necessary tasks needed when the component finish mounting
   */
  componentDidMount() {
    this.calculateMappingWeights().then(() => {
      this.setState({ loading: false });
    });
  }

  /**
   * Actions to perform when this component os updated.
   * It manages to execute the callback to set the score in the property
   *
   * @param {Object} prevProps
   * @param {Object} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    const { currentMappingWeight, maxMappingWeight } = this.state;
    const { onAlignmentScoreFetched } = this.props;

    if (currentMappingWeight != prevState.currentMappingWeight) {
      onAlignmentScoreFetched((currentMappingWeight * 100) / maxMappingWeight);
    }
  }

  render() {
    /**
     * Elements from props
     */
    const { term, selectedDomain } = this.props;

    /**
     * Elements from state
     */
    const { currentMappingWeight, errors, loading, maxMappingWeight } = this.state;

    return (
      <>
        {/* ERRORS */}
        {errors.length ? (
          <AlertNotice message={errors} onClose={() => this.setState({ errors: [] })} />
        ) : null}

        <div className="card borderless bg-col-secondary h-100">
          <div className="card-header desm-rounded bottom-borderless bg-col-secondary">
            <small className="mt-3 col-on-primary-light">Element/Property</small>
            <h3>{term.name}</h3>

            <small className="mt-3 col-on-primary-light">Class/Type</small>
            <p>{term.property.selectedDomain}</p>

            <small className="mt-3 col-on-primary-light">Definition</small>
            <p>{term.property.comment}</p>

            <small className="mt-3 col-on-primary-light">Organization</small>
            <p>{term.organization?.name}</p>

            <small className="mt-3 col-on-primary-light">Schema</small>
            <p>{term.property.scheme}</p>

            {loading ? (
              <Loader />
            ) : (
              <ProgressReportBar
                currentValue={currentMappingWeight}
                maxValue={maxMappingWeight}
                percentageMode={true}
                cssClass={'bg-col-success'}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}
