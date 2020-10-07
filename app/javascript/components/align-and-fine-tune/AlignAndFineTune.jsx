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
import SpineHeader from "./SpineHeader";
import MappingTermsHeaders from "./MappingTermsHeader";

const AlginAndFineTune = (props) => {
  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);

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
   * Whether to hide mapped mapping terms or not
   */
  const [hideMappedSpineTerms, setHideMappedSpineTerms] = useState(false);

  /**
   * Whether to hide mapped spine terms or not
   */
  const [hideMappedMappingTerms, setHideMappedMappingTerms] = useState(false);

  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of mapping terms
   */
  const [mappingTermsInputValue, setMappingTermsInputValue] = useState("");

  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of spine terms
   */
  const [spineTermsInputValue, setSpineTermsInputValue] = useState("");

  /**
   * The selected mapping terms (the terms of the original specification, now
   * selected to map into the spine).
   */
  const selectedMappingTerms = mappingTerms.filter((term) => {
    return term.selected;
  });

  /**
   * Manage to change values from mapping term inputs in the state
   *
   * @param {Event} event
   */
  const filterMappingTermsOnChange = (event) => {
    setMappingTermsInputValue(event.target.value);
  };

  /**
   * Manage to change values from spine term inputs in the state
   *
   * @param {Event} event
   */
  const filterSpineTermsOnChange = (event) => {
    setSpineTermsInputValue(event.target.value);
  };

  /**
   * The already mapped terms. To use in progress bar.
   * For a term to be mapped, it can be 1 of 2 options:
   *
   * 1. The term is recently dragged to the domain, so it's not in the backend, just
   *    marked in memory as "mapped".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   *
   * @param {Object} spineTerm
   */
  const mappedTermsToSpineTerm = (spineTerm) => {
    return mappingTerms.filter((term) => {
      return term.mapped_term.mappedTo === spineTerm.uri;
    });
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
   * The selected or not selected terms that includes the string typed by the user in the
   * search box.
   */
  const filteredSpineTerms = spineTerms
    .filter((term) => {
      return term.name
        .toLowerCase()
        .includes(spineTermsInputValue.toLowerCase());
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  /**
   * All the terms that are already mapped
   */
  const mappedMappingTerms = mappingTerms.filter(mappingTermIsMapped);

  /**
   * Returns wether the term is already mapped to the spine. It can be 1 of 2 options:
   *
   * 1. The mapping term was recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   */
  function mappingTermIsMapped(mappingTerm) {
    return (
      mappingTerm.mappedTo ||
      spineTerms.some((spineTerm) => {
        return spineTerm.id === mappingTerm.spine_term_id;
      })
    );
  }

  /**
   * Returns wether the spine term has any mappping terms mapped to it. It can be 1 of 2 options:
   *
   * 1. The mapping term was recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The mapping term is already mapped in the backend (is one of the mapping terms in DB).
   */
  function spineTermIsMapped(spineTerm) {
    return mappingTerms.some((mappingTerm) => {
      return (
        mappingTerm.mappedTo === spineTerm.uri ||
        mappingTerm.spine_term_id === spineTerm.id
      );
    });
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
      termToMap.mapped_term.mappedTo = spineTerm.uri;
      termToMap.selected = !termToMap.selected;
    });
    tempTerms = [...mappingTerms];
    setMappingTerms([]);
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
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchMappingsFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted, but
   * it mimics the same action).
   */
  useEffect(() => {
    async function fetchData() {
      await fetchDataFromAPI();
    }
    fetchData().then(() => {
      setLoading(false);
    });
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
                  <SpineHeader
                    domain={mapping.domain}
                    hideMappedSpineTerms={hideMappedSpineTerms}
                    setHideMappedSpineTerms={setHideMappedSpineTerms}
                    mappingTerms={mappingTerms}
                    mappedMappingTerms={mappedMappingTerms}
                    spineTermsInputValue={spineTermsInputValue}
                    filterSpineTermsOnChange={filterSpineTermsOnChange}
                  />
                  <div className="mt-5">
                    {!loading && (
                      <SpineTermsList
                        terms={filteredSpineTerms}
                        predicates={predicates}
                        selectedMappingTerms={selectedMappingTerms}
                        hideMappedSpineTerms={hideMappedSpineTerms}
                        mappedTermsToSpineTerm={mappedTermsToSpineTerm}
                        isMapped={spineTermIsMapped}
                        origin={mapping.origin}
                      />
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE */}

                <div className="col-lg-4 p-lg-5 pt-5 bg-col-secondary">
                  <MappingTermsHeaders
                    organizationName={user.organization.name}
                    domain={mapping.domain}
                    selectedMappingTerms={selectedMappingTerms}
                    hideMappedMappingTerms={hideMappedMappingTerms}
                    setHideMappedMappingTerms={setHideMappedMappingTerms}
                    mappingTerms={mappingTerms}
                    mappedMappingTerms={mappedMappingTerms}
                    mappingTermsInputValue={mappingTermsInputValue}
                    filterMappingTermsOnChange={filterMappingTermsOnChange}
                  />

                  {/* MAPPING TERMS LIST */}

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
                              mappingTermIsMapped(term) ? (
                              ""
                            ) : (
                              <TermCard
                                key={term.id}
                                term={term.mapped_term}
                                onClick={onMappingTermClick}
                                editEnabled={false}
                                isMapped={mappingTermIsMapped}
                                origin={mapping.origin}
                              />
                            );
                          }
                        )}
                      </TermCardsContainer>

                      {/* NOT SELECTED TERMS */}
                      {filteredMappingTerms({ pickSelected: false }).map(
                        (term) => {
                          return hideMappedMappingTerms &&
                            mappingTermIsMapped(term) ? (
                            ""
                          ) : (
                            <TermCard
                              key={term.id}
                              term={term.mapped_term}
                              onClick={onMappingTermClick}
                              editEnabled={false}
                              isMapped={mappingTermIsMapped}
                              origin={mapping.origin}
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
