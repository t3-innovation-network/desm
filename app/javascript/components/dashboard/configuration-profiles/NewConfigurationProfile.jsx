import { Component } from 'react';
import ConfirmDialog from '../../shared/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import EllipsisOptions from '../../shared/EllipsisOptions';
import { CPBoxContainer } from './ConfigurationProfileBox';
import { withRouter } from 'react-router';

class NewConfigurationProfile extends Component {
  state = {
    confirmationVisible: false,
    confirmationMsg:
      'You are about to create a new empty Configuration Profile. You will be able to fill all the necessary information until\
       it is complete and ready to be used. Please confirm.',
    options: [
      { id: 1, name: 'Type in attributes' },
      { id: 2, name: 'Upload a JSON structure' },
    ],
  };

  handleCreate = () => {
    this.setState({ confirmationVisible: false });
    this.props.handleCreate();
  };

  handleOptionSelected = (option) => {
    const { history } = this.props;

    switch (option) {
      case this.state.options[0]:
        this.setState({ confirmationVisible: true });
        break;
      case this.state.options[1]:
        history.push('/dashboard/configuration-profiles/new');
        break;
    }
  };

  render() {
    const { confirmationMsg, confirmationVisible } = this.state;
    return (
      <>
        {confirmationVisible && (
          <ConfirmDialog
            onRequestClose={() => this.setState({ confirmationVisible: false })}
            onConfirm={this.handleCreate}
            visible={confirmationVisible}
          >
            <h2 className="text-center">Attention!</h2>
            <h5 className="mt-3 text-center"> {confirmationMsg}</h5>
          </ConfirmDialog>
        )}
        <CPBoxContainer
          icon={<FontAwesomeIcon icon={faPlus} className="fa-3x" />}
          sideBoxClass="bg-dashboard-background-highlight col-background"
          action={() => {
            this.setState({ confirmationVisible: true });
          }}
        >
          <BoxBody options={this.state.options} onOptionSelected={this.handleOptionSelected} />
        </CPBoxContainer>
      </>
    );
  }
}

const BoxBody = (props) => {
  const { options, onOptionSelected } = props;
  return (
    <div className="card-body">
      <div className="row no-gutters">
        <div className="col-md-10">
          <h5>Add a Configuration Profile</h5>
        </div>
        <div className="col-md-2">
          <EllipsisOptions options={options} onOptionSelected={onOptionSelected} />
        </div>
      </div>
    </div>
  );
};

export default withRouter(NewConfigurationProfile);
