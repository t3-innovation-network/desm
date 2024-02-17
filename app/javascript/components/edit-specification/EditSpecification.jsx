import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import fetchSpine from '../../services/fetchSpine';
import fetchSpineTerms from '../../services/fetchSpineTerms';
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

const EditSpecification = (props) => {
  const { organization } = useContext(AppContext);

  /**
   * Error message to present on the UI
   */
  const [errors, setErrors] = useState([]);

  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);

  /**
   * The logged in user
   */
  const user = useSelector((state) => state.user);

  /**
   * Declare and have an initial state for the domain
   */
  const [domain, setDomain] = useState({});

  /**
   * The terms of the spine
   */
  const [terms, setTerms] = useState([]);

  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of terms
   */
  const [termsInputValue, setTermsInputValue] = useState('');

  /**
   * Whether we are editing a term or not. Useful to show/hide the
   * modal window to edit a term
   */
  const [editingTerm, setEditingTerm] = useState(false);

  /**
   * The term to be edited. Active when the user clicks the pencil
   * icon on a term
   */
  const [termToEdit, setTermToEdit] = useState({ property: {} });

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  /**
   * Manage to change values from inputs in the state
   *
   * @param {Event} event
   */
  const filterTermsOnChange = (event) => {
    setTermsInputValue(event.target.value);
  };

  /**
   * The terms that includes the string typed by the user in the search box.
   */
  const filteredTerms = () =>
    terms
      .filter((term) => {
        return term.name.toLowerCase().includes(termsInputValue.toLowerCase());
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));

  /**
   * Handles to view the modal window that allows to edit a term
   *
   * @param {Object} term
   */
  const onEditTermClick = (term) => {
    setEditingTerm(true);
    setTermToEdit(term);
  };

  /**
   * Actions on term removed. The term was removed using another component,
   * so in this one, it's still visible, we need to change that to also
   * don't show it.
   *
   * @param {Object} removedTerm
   */
  const termRemoved = (removedTerm) => {
    const tempTerms = terms.filter((term) => term.id !== removedTerm.id);
    setTerms(tempTerms);
  };

  /**
   * Handle showing the errors on screen, if any
   *
   * @param {HttpResponse} response
   */
  function anyError(response) {
    if (response.error) {
      let tempErrors = errors;
      tempErrors.push(response.error);
      setErrors([]);
      setErrors(tempErrors);
    }
    /// It will return a truthy value (depending no the existence
    /// of the errors on the response object)
    return !_.isUndefined(response.error);
  }

  /**
   * Get the specification
   */
  const handleFetchSpine = async (spineId) => {
    let response = await fetchSpine(spineId);
    if (!anyError(response)) {
      // Set the domain on state
      setDomain(response.spine.domain);
    }
  };

  /**
   * Get the specification terms
   */
  const handleFetchSpineTerms = async (spineId) => {
    let response = await fetchSpineTerms(spineId);
    if (!anyError(response)) {
      // Set the spine terms on state
      setTerms(response.terms);
    }
  };

  /**
   * Get the data from the service
   */
  const fetchDataFromAPI = async () => {
    // Get the specification
    await handleFetchSpine(props.match.params.id);
    // Get the terms
    await handleFetchSpineTerms(props.match.params.id);
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchDataFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted,
   * but it mimics the same action).
   */
  useEffect(() => {
    if (loading) {
      fetchDataFromAPI().then(() => {
        if (_.isEmpty(errors)) {
          setLoading(false);
        }
      });
    }
  }, []);

  return (
    <Fragment>
      <EditTerm
        modalIsOpen={editingTerm}
        onRequestClose={() => {
          setEditingTerm(false);
        }}
        onRemoveTerm={termRemoved}
        termId={termToEdit.id}
      />
      <div className="container-fluid">
        <TopNav centerContent={navCenterOptions} />

        {errors.length ? <AlertNotice message={errors} /> : ''}

        <div className="row">
          {loading ? (
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

              <div className="pr-5 mt-5">
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
                  {filteredTerms().map((term) => {
                    return (
                      <TermCard
                        key={term.id}
                        term={term}
                        onClick={() => {}}
                        isMapped={() => false}
                        editEnabled={true}
                        onEditClick={onEditTermClick}
                        origin={term.organization.name}
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
    </Fragment>
  );
};

export default EditSpecification;
