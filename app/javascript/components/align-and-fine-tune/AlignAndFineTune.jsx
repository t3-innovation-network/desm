import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import fetchMapping from "../../services/fetchMapping";
import fetchMappingTerms from "../../services/fetchMappingTerms";
import fetchPredicates from "../../services/fetchPredicates";
import fetchSpecificationTerms from "../../services/fetchSpecificationTerms";
import TermCard from "../mapping-to-domains/TermCard";
import TermCardsContainer from "../mapping-to-domains/TermCardsContainer";
import AlertNotice from "../shared/AlertNotice";
import Loader from "../shared/Loader";
import TopNav from "../shared/TopNav";
import TopNavOptions from "../shared/TopNavOptions";
import SpineTermsList from "./SpineTermsList";

const AlginAndFineTune = (props) => {
  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(false);

  /**
   * The logged in user
   */
  const user = useSelector((state) => state.user);

  /**
   * Declare and have an initial state for the mapping
   */
  const [mapping, setMapping] = useState({});

  /**
   * The terms of the mapping (The selected ones from the uploaded specification)
   */
  const [mappingTerms, setMappingTerms] = useState([]);

  /**
   * The terms of the spine (The specification being mapped against)
   */
  const [spineTerms, setSpineTerms] = useState([]);

  /**
   * The predicates from DB. These will be used to match a mapping term to a spine
   * term in a meaningful way. E.g. "Identicall", "Agregatted", ...
   */
  const [predicates, setPredicates] = useState([]);

  /**
   * Whether any change awas performed after the page loads
   */
  const [anyChangePerformed, setAnyChangePerformed] = useState(false);

  /**
   * Whether to hide mapped terms or not
   */
  const [hideMappedMappingTerms, setHideMappedMappingTerms] = useState(false);

  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of terms
   */
  const [mappingTermsInputValue, setMappingTermsInputValue] = useState("");

  /**
   * The selected mapping terms (the terms of the original specification, now
   * selected to map into the spine).
   */
  const selectedMappingTerms = mappingTerms.filter((term) => {
    return term.selected;
  });

  /**
   * Manage to change values from inputs in the state
   *
   * @param {Event} event
   */
  const filterSpecTermsOnChange = (event) => {
    setMappingTermsInputValue(event.target.value);
  };

  /**
   * The selected or not selected terms that includes the string typed by the user in the
   * search box.
   */
  const filteredMappingTerms = (options = { pickSelected: false }) =>
    mappingTerms
      .filter((term) => {
        return (
          (options.pickSelected ? term.selected : !term.selected) &&
          term.mapped_term.name
            .toLowerCase()
            .includes(mappingTermsInputValue.toLowerCase())
        );
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));

  /**
   * Returns wether the term is already mapped to the spinw. It can be 1 of 2 options:
   *
   * 1. The term is recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   */
  function termIsMapped(mappingTerm) {
    return (
      mappingTerm.mappedTo ||
      spineTerms.some((spineTerm) => {
        return spineTerm.id === mappingTerm.spine_term_id;
      })
    );
  }

  /**
   * Mark the term as "selected"
   */
  const onMappingTermClick = (clickedTerm) => {
    if (!clickedTerm.mappedTo) {
      let tempTerms = [...mappingTerms];
      let term = tempTerms.find((t) => t.mapped_term.id == clickedTerm.id);
      term.selected = clickedTerm.selected;

      setMappingTerms(tempTerms);
    }
  };

  /**
   * Action to perform after a mapping term is dropped
   */
  const afterDropTerm = (spineTerm) => {
    let tempTerms = selectedMappingTerms;
    tempTerms.forEach((termToMap) => {
      termToMap.mappedTo = spineTerm.uri;
      termToMap.selected = !termToMap.selected;
    });
    tempTerms = [...mappingTerms];
    setMappingTerms(tempTerms);
    setAnyChangePerformed(true);
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
        stepperStep={3}
      />
    );
  };

  /**
   * Get the data from the service
   */
  const fetchDataFromAPI = async () => {
    // Get the mapping
    let response = await fetchMapping(props.match.params.id);
    setMapping(response.mapping);

    // Get the spine terms
    response = await fetchSpecificationTerms(response.mapping.spine_id);
    setSpineTerms(response.terms);

    // Get the mapping terms
    response = await fetchMappingTerms(props.match.params.id);
    setMappingTerms(response.terms);

    // Get the predicates
    response = await fetchPredicates();
    setPredicates(response.predicates);

    setLoading(false);
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchMappingsFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted, but
   * it mimics the same action).
   */
  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  return (
    <React.Fragment>
      <div className="wrapper">
        <TopNav centerContent={navCenterOptions} />
        <div className="container-fluid container-wrapper">
          <div className="row">
            {loading ? (
              <Loader />
            ) : (
              <React.Fragment>
                {/* LEFT SIDE */}

                <div className="col-lg-8 p-lg-5 pt-5">
                  <div className="border-bottom">
                    <h6 className="subtitle">
                      3. Map CredReg to Schema / Spine
                    </h6>
                    <div className="row">More content</div>
                  </div>
                  <div className="mt-5">
                    <SpineTermsList
                      terms={spineTerms}
                      predicates={predicates}
                    />
                  </div>
                </div>

                {/* RIGHT SIDE */}

                <div className="col-lg-4 p-lg-5 pt-5 bg-col-secondary">
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
                            value={hideMappedMappingTerms}
                            onChange={(e) =>
                              setHideMappedSpecTerms(!hideMappedMappingTerms)
                            }
                            id="hideElems"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="hideElems"
                          >
                            Hidde Mapped Elements
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
                          value={mappingTermsInputValue}
                          onChange={filterSpecTermsOnChange}
                        />
                      </div>
                    </div>
                    <p>
                      <strong>{selectedMappingTerms.length}</strong> elements
                      selected
                    </p>
                  </div>

                  <div className="pr-5 mt-5">
                    <AlertNotice
                      cssClass="bg-col-primary col-background"
                      title={
                        mappingTerms.length +
                        " elements have been selected from the original specification"
                      }
                      message="The items below have been added to Person Domain. Now you can align them to the spine."
                    />
                    <div>
                      {/* SELECTED TERMS */}

                      <TermCardsContainer
                        className="has-scrollbar scrollbar pr-5"
                        terms={selectedMappingTerms}
                        afterDrop={afterDropTerm}
                      >
                        {filteredMappingTerms({ pickSelected: true }).map(
                          (term) => {
                            return hideMappedMappingTerms &&
                              termIsMapped(term) ? (
                              ""
                            ) : (
                              <TermCard
                                key={term.id}
                                term={term.mapped_term}
                                onClick={onMappingTermClick}
                                editEnabled={false}
                                isMapped={termIsMapped}
                              />
                            );
                          }
                        )}
                      </TermCardsContainer>

                      {/* NOT SELECTED TERMS */}
                      {filteredMappingTerms({ pickSelected: false }).map(
                        (term) => {
                          return hideMappedMappingTerms &&
                            termIsMapped(term) ? (
                            ""
                          ) : (
                            <TermCard
                              key={term.id}
                              term={term.mapped_term}
                              onClick={onMappingTermClick}
                              editEnabled={false}
                              isMapped={termIsMapped}
                            />
                          );
                        }
                      )}
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

export default AlginAndFineTune;
