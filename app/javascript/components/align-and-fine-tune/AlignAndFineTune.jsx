import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import fetchMapping from "../../services/fetchMapping";
import fetchMappingSelectedTerms from "../../services/fetchMappingSelectedTerms";
import fetchPredicates from "../../services/fetchPredicates";
import fetchSpecificationTerms from "../../services/fetchSpecificationTerms";
import TermCard from "../mapping-to-domains/TermCard";
import TermCardsContainer from "../mapping-to-domains/TermCardsContainer";
import AlertNotice from "../shared/AlertNotice";
import Loader from "../shared/Loader";
import TopNav from "../shared/TopNav";
import TopNavOptions from "../shared/TopNavOptions";
import SpineTermRow from "./SpineTermRow";
import SpineHeader from "./SpineHeader";
import MappingTermsHeaders from "./MappingTermsHeader";
import Pluralize from "pluralize";
import fetchMappingTerms from "../../services/fetchMappingTerms";

const AlignAndFineTune = (props) => {
  /**
   * Representation of an error on this page process
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
   * Declare and have an initial state for the mapping
   */
  const [mapping, setMapping] = useState({});

  /**
   * The terms of the mapping (The ones for the output, not visible here, but necessary
   * to configure the relation between the predicate, spine term and selected terms
   * from the specification)
   */
  const [mappingTerms, setMappingTerms] = useState([]);

  /**
   * The terms of the mapping (The selected ones from the uploaded specification)
   */
  const [mappingSelectedTerms, setMappingSelectedTerms] = useState([]);

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
  const [hideMappedSelectedTerms, setHideMappedSelectedTerms] = useState(false);

  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of mapping terms
   */
  const [
    mappingSelectedTermsInputValue,
    setMappingSelectedTermsInputValue,
  ] = useState("");

  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of spine terms
   */
  const [spineTermsInputValue, setSpineTermsInputValue] = useState("");

  /**
   * The selected mapping terms (the terms of the original specification, now
   * selected to map into the spine).
   */
  const selectedMappingTerms = mappingSelectedTerms.filter((term) => {
    return term.selected;
  });

  /**
   * Manage to change values from mapping term inputs in the state
   *
   * @param {Event} event
   */
  const filterMappingSelectedTermsOnChange = (event) => {
    setMappingSelectedTermsInputValue(event.target.value);
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
    let mterm = mappingTerms.find((mt) => mt.spine_term_id === spineTerm.id);
    return mterm ? mterm.mapped_terms : [];
  };

  /**
   * The selected or not selected terms that includes the string typed by the user in the
   * search box.
   */
  const filteredMappingSelectedTerms = (options = { pickSelected: false }) =>
    mappingSelectedTerms
      .filter((term) => {
        return (
          (options.pickSelected ? term.selected : !term.selected) &&
          term.name
            .toLowerCase()
            .includes(mappingSelectedTermsInputValue.toLowerCase())
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
  const mappedSelectedTerms = mappingSelectedTerms.filter(selectedTermIsMapped);

  /**
   * Returns wether the term is already mapped to the spine. It can be 1 of 2 options:
   *
   * 1. The mapping term was recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   */
  function selectedTermIsMapped(mappingTerm) {
    return (
      mappingTerm.mappedTo ||
      _.some(spineTerms, (spineTerm) => {
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
    return mappingSelectedTerms.some((mappingTerm) => {
      return (
        mappingTerm.mappedTo === spineTerm.uri ||
        mappingTerm.spine_term_id === spineTerm.id
      );
    });
  }

  /**
   * Mark the term as "selected"
   */
  const onSelectedTermClick = (clickedTerm) => {
    if (!clickedTerm.mappedTo) {
      let tempTerms = [...mappingSelectedTerms];
      let term = tempTerms.find((t) => t.id == clickedTerm.id);
      term.selected = clickedTerm.selected;

      setMappingSelectedTerms(tempTerms);
    }
  };

  /**
   * Returns the mapping term that corresponds to a specific term by its id
   * It represents the relation between a spine term, one or more selected
   * terms from the original specification and the predicate
   *
   * @param {Integer} spineTermId
   */
  const mappingTermForSpineTerm = (spineTermId) => {
    return mappingTerms.find((mt) => mt.spine_term_id === spineTermId.id);
  };

  /**
   * Link the predicate to the corresponding mapping term
   *
   * @param {Object} spineTerm
   * @param {Object} predicate
   */
  const onPredicateSelected = (spineTerm, predicate) => {
    let tempTerms = mappingTerms;
    let selectedTerm = tempTerms.find(
      (mTerm) => mTerm.spine_term_id == spineTerm.id
    );
    selectedTerm.predicate_id = predicate.id;

    setMappingTerms([]);
    setMappingTerms(tempTerms);
  };

  /**
   * Action to perform after a mapping term is dropped
   */
  const afterDropTerm = (spineTerm) => {
    /// Set the selected terms as mapped for the mapping terms dropped on
    let selectedTerms = selectedMappingTerms;
    let mappingTerm = mappingTerms.find(
      (mt) => mt.spine_term_id === spineTerm.id
    );
    mappingTerm.mapped_terms = selectedTerms;
    let tempMappingTerms = mappingTerms;

    /// Deselect terms
    selectedTerms.forEach(term => term.selected = !term.selected);
    let tempMappingSelectedTerms = [...mappingSelectedTerms];
    setMappingSelectedTerms(tempMappingSelectedTerms);

    /// Redraw the mapped terms
    setMappingTerms([]);
    setMappingTerms(tempMappingTerms);

    /// Warn to save changes
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
   * Get the mapping
   */
  const handleFetchMapping = async (mappingId) => {
    let response = await fetchMapping(mappingId);
    if (!anyError(response)) {
      // Set the mapping and mapping terms on state
      setMapping(response.mapping);
    }
    return response;
  };

  /**
   * Get the mapping terms
   */
  const handleFetchMappingSelectedTerms = async (mappingId) => {
    let response = await fetchMappingSelectedTerms(mappingId);
    if (!anyError(response)) {
      // Set the mapping on state
      setMappingSelectedTerms(response.terms);
    }
  };

  /**
   * Get the mapping terms. These are those that will relate spine terms
   * with predicates and specification selected terms
   */
  const handleFetchMappingTerms = async (mappingId) => {
    let response = await fetchMappingTerms(mappingId);
    if (!anyError(response)) {
      // Set the mapping terms on state
      setMappingTerms(response.terms)
    }
  };

  /**
   * Get the specification terms
   */
  const handleFetchSpineTerms = async (specId) => {
    let response = await fetchSpecificationTerms(specId);
    if (!anyError(response)) {
      // Set the spine terms on state
      setSpineTerms(response.terms);
    }
  };

  /**
   * Get the specification terms
   */
  const handleFetchPredicates = async () => {
    let response = await fetchPredicates();
    if (!anyError(response)) {
      // Set the spine terms on state
      setPredicates(response.predicates);
    }
  };

  /**
   * Get the data from the service
   */
  const fetchDataFromAPI = async () => {
    // Get the mapping
    let response = await handleFetchMapping(props.match.params.id);

    // Get the mapping terms
    await handleFetchMappingTerms(props.match.params.id);

    // Get the mapping selected terms
    await handleFetchMappingSelectedTerms(props.match.params.id);

    // Get the spine terms
    await handleFetchSpineTerms(response.mapping.spine_id);

    // Get the predicates
    await handleFetchPredicates();
  };

  /**
   * Use effect with an emtpy array as second parameter, will trigger the 'fetchDataFromAPI'
   * action at the 'mounted' event of this functional component (It's not actually mounted, but
   * it mimics the same action).
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
                <div className="col-lg-8 p-lg-5 pt-5">
                  <SpineHeader
                    domain={mapping.domain}
                    hideMappedSpineTerms={hideMappedSpineTerms}
                    setHideMappedSpineTerms={setHideMappedSpineTerms}
                    mappingSelectedTerms={mappingSelectedTerms}
                    mappedSelectedTerms={mappedSelectedTerms}
                    spineTermsInputValue={spineTermsInputValue}
                    filterSpineTermsOnChange={filterSpineTermsOnChange}
                  />
                  <div className="mt-5">
                    {!loading &&
                      filteredSpineTerms.map((term) => {
                        return props.hideMappedSpineTerms &&
                          props.isMapped(term) ? (
                          ""
                        ) : (
                          <SpineTermRow
                            key={term.id}
                            term={term}
                            predicates={predicates}
                            selectedMappingTerms={selectedMappingTerms}
                            mappedTermsToSpineTerm={mappedTermsToSpineTerm}
                            isMapped={spineTermIsMapped}
                            origin={mapping.origin}
                            onPredicateSelected={onPredicateSelected}
                            mappingTerm={() => mappingTermForSpineTerm(term.id)}
                          />
                        );
                      })}
                  </div>
                </div>

                {/* RIGHT SIDE */}

                <div className="col-lg-4 p-lg-5 pt-5 bg-col-secondary">
                  <MappingTermsHeaders
                    organizationName={user.organization.name}
                    domain={mapping.domain}
                    selectedMappingTerms={selectedMappingTerms}
                    hideMappedSelectedTerms={hideMappedSelectedTerms}
                    setHideMappedSelectedTerms={setHideMappedSelectedTerms}
                    mappingSelectedTerms={mappingSelectedTerms}
                    mappedSelectedTerms={mappedSelectedTerms}
                    mappingSelectedTermsInputValue={
                      mappingSelectedTermsInputValue
                    }
                    filterMappingSelectedTermsOnChange={
                      filterMappingSelectedTermsOnChange
                    }
                  />

                  {/* MAPPING TERMS LIST */}

                  <div className="pr-5 mt-5">
                    <AlertNotice
                      cssClass="bg-col-primary col-background"
                      title={
                        mappingSelectedTerms.length +
                        " " +
                        Pluralize("element", mappingSelectedTerms.length) +
                        " have been selected from the original specification"
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
                        {filteredMappingSelectedTerms({
                          pickSelected: true,
                        }).map((term) => {
                          return hideMappedSelectedTerms &&
                            selectedTermIsMapped(term) ? (
                            ""
                          ) : (
                            <TermCard
                              key={term.id}
                              term={term}
                              onClick={onSelectedTermClick}
                              editEnabled={false}
                              isMapped={selectedTermIsMapped}
                              origin={mapping.origin}
                              alwaysEnabled={true}
                            />
                          );
                        })}
                      </TermCardsContainer>

                      {/* NOT SELECTED TERMS */}
                      {filteredMappingSelectedTerms({
                        pickSelected: false,
                      }).map((term) => {
                        return hideMappedSelectedTerms &&
                          selectedTermIsMapped(term) ? (
                          ""
                        ) : (
                          <TermCard
                            key={term.id}
                            term={term}
                            onClick={onSelectedTermClick}
                            editEnabled={false}
                            isMapped={selectedTermIsMapped}
                            origin={mapping.origin}
                            alwaysEnabled={true}
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

export default AlignAndFineTune;
