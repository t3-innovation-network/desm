import React, { useState, useEffect } from "react";
import TopNav from "../shared/TopNav";
import Loader from "../shared/Loader";
import fetchMapping from "../../services/fetchMapping";
import { useSelector } from "react-redux";
import AlertNotice from "../shared/AlertNotice";
import TopNavOptions from "../shared/TopNavOptions";
import TermCard from "./TermCard";
import DomainCard from "./DomainCard";
import EditTerm from "./EditTerm";
import TermCardsContainer from "./TermCardsContainer";
import fetchSpecification from "../../services/fetchSpecification";
import fetchSpecificationTerms from "../../services/fetchSpecificationTerms";
import saveMappingTerms from "../../services/saveMappingTerms";
import { toastr as toast } from "react-redux-toastr";
import updateMapping from "../../services/updateMapping";

const MappingToDomains = (props) => {
  /**
   * Representation of an error on this page process
   */
  const [errors, setErrors] = useState([]);

  /**
   * Declare and have an initial state for the mapping
   */
  const [mapping, setMapping] = useState({});

  /**
   * Declare and have an initial state for the mapping
   */
  const [domain, setDomain] = useState({});

  /**
   * The specification terms list
   */
  const [terms, setTerms] = useState([]);

  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);

  /**
   * Whether any change awas performed after the page loads
   */
  const [anyTermMapped, setAnyTermMapped] = useState(false);

  /**
   * Whether to hide mapped terms or not
   */
  const [hideMapped, setHideMapped] = useState(false);

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
   * The logged in user
   */
  const user = useSelector((state) => state.user);

  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of terms
   */
  const [termsInputValue, setTermsInputValue] = useState("");

  /**
   * The selected or not selected terms that includes the string typed by the user in the
   * search box.
   */
  const filteredTerms = (options = { pickSelected: false }) =>
    terms
      .filter((term) => {
        return (
          (options.pickSelected ? term.selected : !term.selected) &&
          term.name.toLowerCase().includes(termsInputValue.toLowerCase())
        );
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));

  /**
   * The already mapped terms. To use in progress bar.
   */
  const mappedTerms = terms.filter(termIsMapped);

  /**
   * Returns wether the term is already mapped to the domain. It can be 1 of 2 options:
   *
   * 1. The term is recently dragged to the domain, so it's not in the backend, just
   *    marked in memory as "mapped".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   */
  function termIsMapped(term) {
    return (
      term.mapped ||
      mapping.terms.some((mappingTerm) => {
        return mappingTerm.mapped_term_id === term.id;
      })
    );
  }

  /**
   * The selected terms.
   */
  const selectedTerms = terms.filter((term) => {
    return term.selected;
  });

  /**
   * Action to perform after a term is dropped
   */
  const afterDropTerm = (domain) => {
    let tempTerms = selectedTerms;
    tempTerms.forEach((termToMap) => {
      termToMap.mapped = true;
      termToMap.selected = !termToMap.selected;
    });
    tempTerms = [...terms];
    setTerms(tempTerms);
    setAnyTermMapped(true);
  };

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
   * Configure the options to see at the center of the top navigation bar
   */
  const navCenterOptions = () => {
    return (
      <TopNavOptions
        viewMappings={true}
        mapSpecification={true}
        stepper={true}
        stepperStep={2}
        customcontent={<DoneDomainMapping />}
      />
    );
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
   * Manage to change values from inputs in the state
   *
   * @param {Event} event
   */
  const filterTermsOnChange = (event) => {
    setTermsInputValue(event.target.value);
  };

  /**
   * Mark the term as "selected"
   */
  const onTermClick = (clickedTerm) => {
    if (!clickedTerm.mapped) {
      let tempTerms = [...terms];
      let term = tempTerms.find((t) => t.id == clickedTerm.id);
      term.selected = clickedTerm.selected;

      setTerms(tempTerms);
    }
  };

  /**
   * Button to accept the mapping, create teh mapping terms and go to the next screen
   */
  const DoneDomainMapping = () => {
    return (
      <button
        className="btn bg-col-primary col-background"
        onClick={handleDoneDomainMapping}
        disabled={!mappedTerms.length}
      >
        Done Domain Mapping
      </button>
    );
  };

  /**
   * Comain mappping complete. Confirm to save status in the backend
   */
  const handleDoneDomainMapping = async () => {
    // Change the mapping satus to "in_progress" (with underscore, because it's
    // the name in the backend), so we say it's begun terms mapping phase
    await updateMapping({ id: mapping.id, status: "in_progress" });

    // Save changes if necessary
    if (anyTermMapped) {
      handleSaveChanges();
    }
    // Redirect to 3rd step mapping ("Align and Fine Tune")
    props.history.push("/mappings/" + mapping.id + "/align");
  };

  /**
   * Create the mapping terms
   */
  const handleSaveChanges = () => {
    saveMappingTerms({
      mappingId: mapping.id,
      terms: mappedTerms,
    })
      .then(() => {
        toast.success("Changes saved");
        setAnyTermMapped(false);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  /**
   * Get the specification terms
   */
  const handleFetchSpecificationTerms = async (spec_id) => {
    let response = await fetchSpecificationTerms(spec_id);
    // Manage to set the errors to show in the UI
    if (response.error) {
      let tempErrors = errors;
      tempErrors.push(response.error);
      setErrors(tempErrors);
      // Finish execution of this method here
      return;
    }
    // Set the spine terms on state
    setTerms(response.terms);
  };

  /**
   * Get the data from the service
   */
  const fetchDataFromAPI = async () => {
    // Get the mapping
    let response = await fetchMapping(props.match.params.id);
    setMapping(response.mapping);

    // Get the specification, with the domain
    let spec_id = response.mapping.specification_id;
    response = await fetchSpecification(spec_id);
    setDomain(response.specification.domain);

    // Get the terms
    await handleFetchSpecificationTerms(spec_id);
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchMappingsFromAPI'
   * and also 'fillWithDomains' actions at the 'mounted' event of this functional component
   * (It's not actually mounted, but it mimics the same action).
   */
  useEffect(() => {
    async function fetchData() {
      await fetchDataFromAPI();
    }
    fetchData().then(() => {
      if (_.isEmpty(errors)) {
        setLoading(false);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <EditTerm
        modalIsOpen={editingTerm}
        onRequestClose={() => {
          setEditingTerm(false);
        }}
        onRemoveTerm={termRemoved}
        termId={termToEdit.id}
      />
      <div className="wrapper">
        <TopNav centerContent={navCenterOptions} />
        {errors.length ? <AlertNotice message={errors.join("\n")} /> : ""}
        <div className="container-fluid container-wrapper">
          <div className="row">
            {loading ? (
              <Loader />
            ) : (
              <React.Fragment>
                {/* LEFT SIDE */}

                <div className="col-lg-6 p-lg-5 pt-5">
                  <div className="border-bottom">
                    <h6 className="subtitle">
                      2. Add your elements to the proper domain
                    </h6>
                    <h1>Mapping {mapping.name}</h1>
                    <div className="row">
                      <div className="col-5">
                        <p>
                          <strong>{mappedTerms.length}</strong>
                          {" of " + terms.length + " elements added to domains"}
                        </p>
                      </div>
                      <div className="col-7">
                        <div className="progress terms-progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width:
                                (mappedTerms.length * 100) / terms.length + "%",
                            }}
                            aria-valuenow="0"
                            aria-valuemin="0"
                            aria-valuemax={terms.length}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    {/* DOMAINS */}
                    {!loading && (
                      <DomainCard
                        domain={domain}
                        mappedTerms={mappedTerms}
                        selectedTermsCount={selectedTerms.length}
                      />
                    )}
                  </div>
                  <div className="mt-2"></div>
                  {<DoneDomainMapping />}
                  <button
                    className="btn btn-dark ml-3"
                    onClick={handleSaveChanges}
                    disabled={!anyTermMapped}
                  >
                    Save Changes
                  </button>
                </div>

                {/* RIGHT SIDE */}

                <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
                  <div className="border-bottom">
                    <div className="row">
                      <div className="col-6">
                        <h6 className="subtitle">{user.organization.name}</h6>
                      </div>
                      <div className="col-6">
                        <div className="form-check float-right">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={hideMapped}
                            onChange={(e) => setHideMapped(!hideMapped)}
                            id="hideElems"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="hideElems"
                          >
                            Hide mapped elements
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 form-group has-search">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Find Element / Property"
                          value={termsInputValue}
                          onChange={filterTermsOnChange}
                        />
                      </div>
                    </div>
                    <p>
                      <strong>{selectedTerms.length}</strong> elements selected
                    </p>
                  </div>

                  <div className="pr-5 mt-5">
                    <AlertNotice
                      cssClass="bg-col-primary col-background"
                      title={terms.length + " elements have been uploaded"}
                      message="Drag your individual elements below to the matching domains on the left to begin mapping your specification"
                    />
                    <div>
                      {/* SELECTED TERMS */}

                      <TermCardsContainer
                        className="has-scrollbar scrollbar pr-5"
                        terms={selectedTerms}
                        afterDrop={afterDropTerm}
                      >
                        {filteredTerms({ pickSelected: true }).map((term) => {
                          return hideMapped && termIsMapped(term) ? (
                            ""
                          ) : (
                            <TermCard
                              key={term.id}
                              term={term}
                              onClick={onTermClick}
                              isMapped={termIsMapped}
                              editEnabled={true}
                              onEditClick={onEditTermClick}
                              origin={mapping.origin}
                            />
                          );
                        })}
                      </TermCardsContainer>

                      {/* NOT SELECTED TERMS */}
                      {filteredTerms({ pickSelected: false }).map((term) => {
                        return hideMapped && termIsMapped(term) ? (
                          ""
                        ) : (
                          <TermCard
                            key={term.id}
                            term={term}
                            onClick={onTermClick}
                            isMapped={termIsMapped}
                            editEnabled={true}
                            onEditClick={onEditTermClick}
                            origin={mapping.origin}
                          />
                        );
                      })}
                      {/* END NOT SELECTED TERMS */}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MappingToDomains;
