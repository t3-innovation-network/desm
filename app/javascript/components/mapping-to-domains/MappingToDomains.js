import React, { useState, useEffect } from "react";
import TopNav from "../shared/TopNav";
import Loader from "../shared/Loader";
import fetchMapping from "../../services/fetchMapping";
import fetchDomains from "../../services/fetchDomains";
import { useSelector } from "react-redux";
import AlertNotice from "../shared/AlertNotice";
import TopNavOptions from "../shared/TopNavOptions";
import TermCard from "./TermCard";
import DomainCard from "./DomainCard";
import EditTerm from "./EditTerm";

const MappingToDomains = (props) => {
  /**
   * Declare and have an initial state for the mapping
   */
  const basicMapping = {
    specification: {
      terms: [],
    },
  };
  const [mapping, setMapping] = useState(basicMapping);

  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);

  /**
   * The domains list
   */
  const [domains, setDomains] = useState([]);

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
   * when there are many domains in the uploaded file
   */
  const [termsInputValue, setTermsInputValue] = useState("");

  /**
   * The domains that includes the string typed by the user in the
   * search box when there are many domains in the uploaded file
   */
  const filteredTerms = mapping.specification.terms.filter((term) => {
    return term.name.toLowerCase().includes(termsInputValue.toLowerCase());
  });

  /**
   * The already mapped terms. To use in progress bar.
   */
  const mappedTerms = mapping.specification.terms.filter((term) => {
    return term.mappedTo;
  });

  /**
   * The selected terms.
   */
  const selectedTerms = mapping.specification.terms.filter((term) => {
    return term.selected;
  });

  /**
   * The already mapped terms to a given domain.
   */
  const mappedTermsToDomain = (domainUri) =>
    mapping.specification.terms.filter((term) => {
      return term.mappedTo == domainUri;
    });

  /**
   * Action to perform after a term is dropped
   */
  const afterDropTerm = (mappedTerm, domain) => {
    let tempMapping = mapping;
    let termToMap = tempMapping.specification.terms.find(
      (term) => term.uri == mappedTerm.uri
    );
    termToMap.mappedTo = domain.uri;
    setMapping(basicMapping);
    setMapping(tempMapping);
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
    const tempTerms = mapping.specification.terms.filter(
      (term) => term.id !== removedTerm.id
    );
    mapping.specification.terms = tempTerms;
    setMapping(mapping);
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
   * Get the mapping from the service
   */
  const goForTheMapping = () => {
    fetchMapping(props.match.params.id).then((response) => {
      setLoading(false);
      setMapping(response.mapping);
    });
  };

  /**
   * Fecth the domains to be listed in the new mapping form
   * then put it in the local sate
   */
  const fillWithDomains = () => {
    fetchDomains().then((response) => {
      setDomains(response);
    });
  };

  /**
   * Mark the term as "selected"
   */
  const onTermClick = (termId) => {
    let tempTerms = mapping.specification.terms;
    let term = tempTerms.find(t => t.id == termId);

    term.selected = (term.selected == undefined) ? true : !term.selected;

    mapping.specification.terms = tempTerms;
    setMapping(basicMapping);
    setMapping(mapping);
  }

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'goForTheMappings'
   * and also 'fillWithDomains' actions at the 'mounted' event of this functional component
   * (It's not actually mounted, but it mimics the same action).
   */
  useEffect(() => {
    goForTheMapping();
    fillWithDomains();
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
                          {" of " +
                            mapping.specification.terms.length +
                            " elements added to domains"}
                        </p>
                      </div>
                      <div className="col-7">
                        <div className="progress terms-progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width:
                                (mappedTerms.length * 100) /
                                  mapping.specification.terms.length +
                                "%",
                            }}
                            aria-valuenow="0"
                            aria-valuemin="0"
                            aria-valuemax={mapping.specification.terms.length}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    {/* DOMAINS */}´

                    {domains.map((domain) => {
                      return (
                        <DomainCard
                          key={domain.id}
                          domain={domain}
                          mappedTerms={mappedTermsToDomain(domain.id)}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <button className="btn bg-col-primary col-background">
                      Done Domain Mapping
                    </button>
                  </div>
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
                            Hidde mapped elements
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
                      title={
                        mapping.specification.terms.length +
                        " elements have been uploaded"
                      }
                      message="Drag your individual elements below to the matching domains on the left to begin mapping your specification"
                    />
                    <div className="has-scrollbar scrollbar pr-5">
                      {/* MAPPING TERMS */}

                      {filteredTerms.map((term) => {
                        return hideMapped && term.mappedTo ? (
                          ""
                        ) : (
                          <TermCard
                            key={term.id}
                            term={term}
                            onClick={() => onTermClick(term.id)}
                            afterDrop={afterDropTerm}
                            onEditClick={onEditTermClick}
                          />
                        );
                      })}
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
