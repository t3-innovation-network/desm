import { Component } from 'react';
import Collapsible from '../../shared/Collapsible';

/**
 * Structure of a concept of the mapped term vocabulary
 *
 * @param {Object} concept
 * @param {Function} onClick
 * @param {String} origin
 */
class ConceptCard extends Component {
  /**
   * Internal state for "selected"
   */
  state = {
    selected: this.props.concept.selected,
  };

  /**
   * Internal handler for onclick event
   */
  handleClick = () => {
    const { selected } = this.state;
    const { onClick, concept } = this.props;

    this.setState({ selected: !selected }, () => {
      if (onClick) {
        onClick(concept);
      }
    });
  };

  render() {
    const { concept, origin } = this.props;
    const { selected } = this.state;

    return (
      <Collapsible
        headerContent={<strong>{concept.name}</strong>}
        cardStyle={'with-shadow mb-2' + (selected ? ' draggable term-selected' : '')}
        cardHeaderColStyle={selected ? '' : 'cursor-pointer'}
        observeOutside={false}
        handleOnClick={this.handleClick}
        bodyContent={
          <>
            <p>{concept.definition}</p>
            <p>
              Origin:
              <span className="col-primary">{' ' + origin}</span>
            </p>
          </>
        }
      />
    );
  }
}

export default ConceptCard;
