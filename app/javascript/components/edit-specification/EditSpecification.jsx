import { useContext, useEffect } from 'react';
import { useLocalStore } from 'easy-peasy';
import EditTerm from '../mapping-to-domains/EditTerm';
import TermCard from '../mapping-to-domains/TermCard';
import AlertNotice from '../shared/AlertNotice';
import Loader from '../shared/Loader';
import TopNav from '../shared/TopNav';
import TopNavOptions from '../shared/TopNavOptions';
import Pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../contexts/AppContext';
import { specificationStore } from './stores/specificationStore';

const EditSpecification = (props) => {
  const { organization } = useContext(AppContext);
  const [state, actions] = useLocalStore(() => specificationStore());
  const { editingTerm, domain, terms, termToEdit, termsInputValue } = state;

  // Manage to change values from inputs in the state
  const filterTermsOnChange = (event) => actions.setTermsInputValue(event.target.value);

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchDataFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    actions.fetchDataFromAPI({ spineId: props.match.params.id });
  }, []);

  return (
    <>
      <EditTerm
        modalIsOpen={editingTerm}
        onRequestClose={() => actions.setEditingTerm(false)}
        onRemoveTerm={actions.onRemoveTerm}
        termId={termToEdit.id}
      />
      <div className="container-fluid">
        <TopNav centerContent={navCenterOptions} />

        {state.hasErrors ? (
          <AlertNotice message={state.errors} onClose={actions.clearErrors} />
        ) : (
          ''
        )}

        <div className="row">
          {state.loading ? (
            <Loader />
          ) : (
            <div className="col p-lg-5 pt-5 bg-col-secondary">
              <div className="border-bottom">
                <div className="row">
                  <div className="col">
                    <h2>
                      Spine for <strong className="col-primary">{domain.pref_label}</strong>
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <h6 className="subtitle">{organization.name}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 form-group input-group-has-icon">
                    <FontAwesomeIcon icon={faSearch} className="form-control-feedback" />

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Find Element / Property"
                      value={termsInputValue}
                      onChange={filterTermsOnChange}
                    />
                  </div>
                </div>
              </div>

              <div className="pr-5 mt-4">
                <AlertNotice
                  cssClass="bg-col-primary col-background"
                  title={
                    terms.length +
                    ' ' +
                    Pluralize('property', terms.length) +
                    ' recognized for this spine'
                  }
                  message="You can edit each term of your specification until you are confident with names, vocabularies, uri's and more."
                />
                <div className="has-scrollbar scrollbar pr-5">
                  {state.filteredTerms.map((term) => {
                    return (
                      <TermCard
                        key={term.id}
                        term={term}
                        onClick={() => {}}
                        isMapped={() => false}
                        editEnabled={true}
                        onEditClick={actions.onEditTermClick}
                        disableClick={true}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditSpecification;
