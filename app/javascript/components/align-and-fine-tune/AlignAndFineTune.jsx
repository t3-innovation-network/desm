import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import fetchMapping from "../../services/fetchMapping";
import fetchMappingSelectedTerms from "../../services/fetchMappingSelectedTerms";
import fetchPredicates from "../../services/fetchPredicates";
import fetchSpecificationTerms from "../../services/fetchSpecificationTerms";
import TermCard from "../mapping-to-domains/TermCard";
import AlertNotice from "../shared/AlertNotice";
import Loader from "../shared/Loader";
import TopNav from "../shared/TopNav";
import TopNavOptions from "../shared/TopNavOptions";
import SpineTermRow from "./SpineTermRow";
import SpineHeader from "./SpineHeader";
import MappingTermsHeaders from "./MappingTermsHeader";
import Pluralize from "pluralize";
import fetchMappingTerms from "../../services/fetchMappingTerms";
import updateMappingTerm from "../../services/updateMappingTerm";
import deleteAlignment from "../../services/deleteAlignment";
import { toastr as toast } from "react-redux-toastr";
import createSpineTerm from "../../services/createSpineTerm";
import Draggable from "../shared/Draggable";
import { DraggableItemTypes } from "../shared/DraggableItemTypes";
import updateMapping from "../../services/updateMapping";
import MappingChangeLog from "./mapping-changelog/MappingChangeLog";
import fetchAudits from "../../services/fetchAudits";
import ConfirmDialog from "../shared/ConfirmDialog";

const AlignAndFineTune = (props) => {
  /**
   * Whether any change awas performed after the page loads
   */
  const [addingSynthetic, setAddingSynthetic] = useState(false);
  /**
   * Whether any change awas performed after the page loads
   */
  const [changesPerformed, setChangesPerformed] = useState(0);
  /**
   * Controls displaying the removal confirmation dialog
   */
  const [confirmingRemoveAlignment, setConfirmingRemoveAlignment] = useState(
    false
  );
  /**
   * The date the mapping was marked as "mapped", which is "completed".
   */
  const [dateMapped, setDateMapped] = useState(null);
  /**
   * Representation of an error on this page process
   */
  const [errors, setErrors] = useState([]);
  /**
   * Whether to hide mapped spine terms or not
   */
  const [hideMappedSelectedTerms, setHideMappedSelectedTerms] = useState(false);
  /**
   * Whether to hide mapped mapping terms or not
   */
  const [hideMappedSpineTerms, setHideMappedSpineTerms] = useState(false);
  /**
   * Whether the page is loading results or not
   */
  const [loading, setLoading] = useState(true);
  /**
   * Declare and have an initial state for the mapping
   */
  const [mapping, setMapping] = useState({});
  /**
   * The terms of the mapping (The selected ones from the uploaded specification)
   */
  const [mappingSelectedTerms, setMappingSelectedTerms] = useState([]);
  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of mapping terms
   */
  const [
    mappingSelectedTermsInputValue,
    setMappingSelectedTermsInputValue,
  ] = useState("");
  /**
   * The terms of the mapping (The ones for the output, not visible here, but necessary
   * to configure the relation between the predicate, spine term and selected terms
   * from the specification)
   */
  const [mappingTerms, setMappingTerms] = useState([]);
  /**
   * Represents the alignment that's going to be removed if the user confirms that action
   */
  const [mappingTermToRemove, setMappingTermToRemove] = useState(null);
  /**
   * The predicates from DB. These will be used to match a mapping term to a spine
   * term in a meaningful way. E.g. "Identicall", "Agregatted", ...
   */
  const [predicates, setPredicates] = useState([]);
  /**
   * The terms of the spine (The specification being mapped against)
   */
  const [spineTerms, setSpineTerms] = useState([]);
  /**
   * The value of the input that the user is typing in the search box
   * to filter the list of spine terms
   */
  const [spineTermsInputValue, setSpineTermsInputValue] = useState("");
  /**
   * The logged in user
   */
  const user = useSelector((state) => state.user);

  /**
   * ---- FUNCTIONS ----
   */

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
  const filteredSpineTerms = _.sortBy(
    spineTerms.filter((term) => {
      return term.name
        .toLowerCase()
        .includes(spineTermsInputValue.toLowerCase());
    }),
    ["synthetic", "name"]
  );

  /**
   * All the terms that are already mapped
   */
  const mappedSelectedTerms = mappingSelectedTerms.filter(selectedTermIsMapped);

  /**
   * Returns whether all the terms from the specification are already mapped
   */
  const allTermsMapped = mappingSelectedTerms.every((term) =>
    mappingTerms.some((mTerm) =>
      mTerm.mapped_terms.some((t) => t.id === term.id)
    )
  );

  /**
   * Returns wether the term is already mapped to the spine. It can be 1 of 2 options:
   *
   * 1. The mapping term was recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The term is already mapped in the backend (is one of the mapping terms in DB).
   */
  function selectedTermIsMapped(mappingTerm) {
    return mappingTerms.some((mTerm) =>
      mTerm.mapped_terms.some((mappedTerm) => mappedTerm.id === mappingTerm.id)
    );
  }

  /**
   * Returns wether the spine term has any mappping terms mapped to it. It can be 1 of 2 options:
   *
   * 1. The mapping term was recently dragged to the spine term, so it's not in the backend, just
   *    marked in memory as "mappedTo".
   * 2. The mapping term is already mapped in the backend (is one of the mapping terms mapped in DB).
   */
  const spineTermIsMapped = (spineTerm) => {
    let mTerm = mappingTerms.find(
      (mTerm) => mTerm.spine_term_id == spineTerm.id
    );
    return mTerm.mapped_terms.length;
  };

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
  const mappingTermForSpineTerm = (spineTermId) =>
    mappingTerms.find((mt) => mt.spine_term_id === spineTermId);

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
    selectedTerm.changed = true;

    setMappingTerms(tempTerms);

    /// Warn to save changes
    setChangesPerformed(changesPerformed + 1);
  };

  /**
   * Update the name of a spine term
   *
   * @param {Integer} spineTermId
   * @param {String} name
   */
  const setSyntheticName = (spineTermId, name) => {
    let tempSpineTerms = spineTerms;
    let spineTerm = tempSpineTerms.find((sTerm) => sTerm.id === spineTermId);

    if (spineTerm.synthetic) {
      spineTerm.name = name;
      setSpineTerms(tempSpineTerms);
    }
  };

  /**
   * Action to perform after a mapping term is dropped
   */
  const afterDropTerm = (spineTerm) => {
    setLoading(true);
    /// Set the selected terms as mapped for the mapping terms dropped on
    let selectedTerms = selectedMappingTerms;
    let mappingTerm = mappingTerms.find(
      (mt) => mt.spine_term_id === spineTerm.id
    );
    mappingTerm.mapped_terms = selectedTerms;
    mappingTerm.changed = true;
    let tempMappingTerms = mappingTerms;

    /// Manage synthetic name (valid only when the spine term is synthetic)
    let [firstSelectedTerm] = selectedTerms;
    setSyntheticName(spineTerm.id, firstSelectedTerm.name);

    /// Deselect terms
    selectedTerms.forEach((term) => (term.selected = !term.selected));

    /// Redraw the mapping selected terms
    setMappingSelectedTerms([...mappingSelectedTerms]);

    /// Redraw the mapped terms
    setMappingTerms(tempMappingTerms);

    /// Warn to save changes
    setChangesPerformed(changesPerformed + 1);
    setLoading(false);
  };

  /**
   * Manages to use the API service to remove an alignment
   */
  const handleRemoveAlignment = async () => {
    let response = await deleteAlignment(mappingTermToRemove.id);

    if (!anyError(response)) {
      /// Update the UI
      setMappingTerms([
        ...mappingTerms.filter((mt) => mt.id !== mappingTermToRemove.id),
      ]);
      setSpineTerms([
        ...spineTerms.filter(
          (sTerm) => sTerm.id !== mappingTermToRemove.spine_term_id
        ),
      ]);

      /// Close the modal confirmation window
      setConfirmingRemoveAlignment(false);

      /// If this is the only change, it's not right to count it as a change to save, since it's already
      /// performed against the service, so it does not represent a change to perform.
      setChangesPerformed(changesPerformed - 1);

      /// Communicate the operation result to the user
      toast.success("Synthetic alignment successfully removed");
    }
  };

  /**
   * Mark the term not mapped.
   *
   * @param {Object} mappingTerm Also called "alignment", containing the information about the spine term,
   * predicate and mapped terms.
   * @param {Object} mappedTerm The mapped term that's going to be dettached from the mapping term
   */
  const handleRevertMapping = (mappingTerm, mappedTerm) => {
    mappingTerm.changed = true;
    mappingTerm.mapped_terms = mappingTerm.mapped_terms.filter(
      (mTerm) => mTerm.id !== mappedTerm.id
    );

    /// If there's no mapped terms after removing the selected one to remove (this was the last mapped
    /// term, and we removed it)
    if (!mappingTerm.mapped_terms.length) {
      mappingTerm.predicate_id = null;
      if (mappingTerm.synthetic) {
        setMappingTermToRemove(mappingTerm);
        setConfirmingRemoveAlignment(true);
      }
    }

    setChangesPerformed(changesPerformed + 1);
    setMappingTerms([...mappingTerms]);
  };

  /**
   * Button to accept the mapping alignment.
   */
  const AlignmentOptions = () => {
    return (
      <React.Fragment>
        <button
          className="btn btn-dark mr-2"
          onClick={handleSaveAlignment}
          disabled={!changesPerformed || loading}
        >
          Save and Exit
        </button>
        {mapping.status !== "mapped" && (
          <button
            className="btn bg-col-primary col-background"
            onClick={handleDoneAlignment}
            disabled={loading || !allTermsMapped}
          >
            Done Alignment
          </button>
        )}
      </React.Fragment>
    );
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
        customcontent={<AlignmentOptions />}
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
   * Returns the next id for a given "in-memory" collection
   *
   * @param {Array} collection
   */
  const nextId = (collection) => {
    return (
      1 + collection.reduce((max, elem) => (elem.id > max ? elem.id : max), 0)
    );
  };

  /**
   * Adds an extra property to the spineTerms collection
   */
  const addSyntheticTerm = () => {
    let tempSpineTerms = spineTerms;
    let maxId = nextId(tempSpineTerms);

    tempSpineTerms.push({
      id: maxId,
      name: "",
      synthetic: true,
      property: {
        comment: "Synthetic property added to spine",
      },
    });

    setSpineTerms(tempSpineTerms);

    return maxId;
  };

  /**
   * Adds an extra property to the mappingTerms collection (alignments)
   *
   * @param {Integer} syntheticTermId
   */
  const addSyntheticAlignment = (syntheticTermId) => {
    let tempMappingTerms = mappingTerms;

    tempMappingTerms.push({
      id: nextId(tempMappingTerms),
      synthetic: true,
      mapped_terms: [],
      spine_term_id: syntheticTermId,
      predicate_id: null,
      comment: null,
    });

    setMappingTerms(tempMappingTerms);
  };

  /**
   * Adds a synthetic property to the spine. It also handles the alignment object to be created.
   */
  const handleAddSynthetic = () => {
    setLoading(true);
    addSyntheticAlignment(addSyntheticTerm());
    setChangesPerformed(changesPerformed + 1);
    setAddingSynthetic(true);
    setLoading(false);
  };

  /**
   * CAncel adding a synthetic term to the spine
   */
  const handleCancelSynthetic = () => {
    setMappingTerms(mappingTerms.filter((mt) => !mt.synthetic));
    setSpineTerms(spineTerms.filter((st) => !st.synthetic));
    setChangesPerformed(changesPerformed - 1);
    setAddingSynthetic(false);
  };

  /**
   * Save a synthetic property added to the spine to the service
   *
   * It const of saving both:
   * - The spine term, which is a property in the specification marked
   * as spine for the current domain, and
   *
   * - The alignment (mappingTerm) which specifies which mappedTerm/
   * from the uploaded specification is going to be aligned with the
   * new synthetic term and with which predicate.
   */
  const saveSynthetic = async (mTerm) => {
    if (!mTerm.mapped_terms.length) {
      let tempErrors = errors;
      tempErrors.push("You must select at least 1 term to add the synthetic!");
      setErrors(tempErrors);
      return false;
    }
    let [mappedTerm] = mTerm.mapped_terms;
    let tempUri = mappedTerm.uri + "-synthetic";
    let spineTerm = spineTerms.find(
      (sTerm) => sTerm.id === mTerm.spine_term_id
    );

    let response = await createSpineTerm({
      synthetic: {
        mappingTerm: {
          comment:
            "Alignment for a synthetic property added to the spine. Synthetic uri: " +
            tempUri,
          uri: tempUri,
          predicateId: predicates.find((p) =>
            p.uri.toLowerCase().includes("nomatch")
          ).id,
          mappingId: mapping.id,
          mappedTerms: mTerm.mapped_terms.map((term) => term.id),
          synthetic: true,
        },
        specification_id: mapping.spine_id,
        spineTerm: {
          name: spineTerm.name,
          propertyAttributes: {
            uri: tempUri,
            label: tempUri,
            comment: "Synthetic property added to the spine",
          },
          organizationId: user.organization.id,
          uri: tempUri,
        },
      },
    });

    return !anyError(response);
  };

  /**
   * Save one only alignment to the service
   *
   * @param {Object} mTerm
   */
  const saveOneAlignment = async (mTerm) => {
    let response = await updateMappingTerm({
      id: mTerm.id,
      predicate_id: mTerm.predicate_id,
      mapped_terms: mTerm.mapped_terms
        ? mTerm.mapped_terms.map((mt) => mt.id)
        : [],
    });

    return !anyError(response);
  };
  /**
   * Process each alignment to save, and save it in parallel
   */
  const saveAllAlignments = async () => {
    /// Check for synthetic properties and save it if any
    let synthetics = mappingTerms.filter((mTerm) => mTerm.synthetic);
    let alignments = mappingTerms.filter(
      (mTerm) => !mTerm.synthetic && mTerm.changed
    );
    let savedTerms = 0;

    await Promise.all(
      synthetics.map(async (mTerm) => {
        let added = await saveSynthetic(mTerm);
        if (added) {
          savedTerms++;
        }
      })
    );

    /// If we had synthetics to save and we successfully saved it
    if (!synthetics.length || (synthetics.length && savedTerms)) {
      /// Save the rest of the changes (new alignments)
      await Promise.all(
        alignments.map(async (mTerm) => {
          if (await saveOneAlignment(mTerm)) {
            savedTerms++;
          }
        })
      );

      return savedTerms;
    }
  };

  /**
   * Save the performed changes.
   */
  const handleSaveAlignment = async () => {
    /// Save alignments
    setLoading(true);
    let savedTerms = await saveAllAlignments();
    setLoading(false);

    /// Show success message (errors are managed in the previous function call)
    if (savedTerms && !errors.length) {
      setChangesPerformed(false);
      toast.success("Changes saved!");

      /// Redirect to the list of specifications
      props.history.push("/mappings");
    }
  };

  /**
   * Domain mappping complete. Confirm to save status in the backend
   */
  const handleDoneAlignment = async () => {
    /// Change the mapping satus to "mapped", so we confirm it's finish the
    /// mapping phase
    let response = await updateMapping({
      id: mapping.id,
      status: "mapped",
    });

    if (!anyError(response)) {
      /// Save changes if necessary
      if (changesPerformed) {
        handleSaveAlignment();
      }
      /// Redirect to the specifications list
      props.history.push("/mappings");
    }
  };

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
      setMappingTerms(response.terms);
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
   * Fetch changes from the api service. This is only used to get the exact date
   * when the mapping changed from "in-progress" to "mapped".
   */
  const handleFetchMappingChanges = async (mapping) => {
    if (mapping.status == "mapped") {
      let response = await fetchAudits({
        className: "Mapping",
        instanceIds: mapping.id,
        auditAction: "update",
      });

      if (!anyError(response)) {
        let statusChangedAudit = response.audits.find(
          (audit) => audit.audited_changes["status"].toString() == "1,2"
        );

        if (statusChangedAudit) {
          setDateMapped(statusChangedAudit.created_at);
        }
      }
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

    // Get the audits
    await handleFetchMappingChanges(response.mapping);
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
        {errors.length ? <AlertNotice message={errors} /> : ""}
        <div className="container-fluid container-wrapper">
          <div className="row">
            {loading ? (
              <Loader />
            ) : (
              <React.Fragment>
                <ConfirmDialog
                  onRequestClose={() => setConfirmingRemoveAlignment(false)}
                  onConfirm={() => handleRemoveAlignment()}
                  visible={confirmingRemoveAlignment}
                >
                  <h2 className="text-center">
                    You are removing an alignment permanently.
                  </h2>
                  <h5 className="mt-3 text-center">
                    Please confirm this action.
                  </h5>
                </ConfirmDialog>

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
                    addingSynthetic={addingSynthetic}
                    handleAddSynthetic={handleAddSynthetic}
                    mappingTerms={mappingTerms}
                  />
                  <div className="mt-5">
                    {/* CHANGELOG */}
                    {dateMapped && (
                      <MappingChangeLog
                        predicates={predicates}
                        mapping={mapping}
                        spineTerms={spineTerms}
                        mappingTerms={mappingTerms}
                        dateMapped={dateMapped}
                      />
                    )}

                    {/* CANCEL SYNTHETIC TERM FORM */}
                    {addingSynthetic && (
                      <div className="row">
                        <div className="col mb-3">
                          <a
                            className="col-primary cursor-pointer float-right"
                            onClick={handleCancelSynthetic}
                          >
                            <strong>Cancel</strong>
                          </a>
                        </div>
                      </div>
                    )}
                    {!loading &&
                      filteredSpineTerms.map((term) => {
                        return props.hideMappedSpineTerms &&
                          props.isMapped(term) ? (
                          ""
                        ) : loading ? (
                          <Loader />
                        ) : hideMappedSpineTerms && spineTermIsMapped(term) ? (
                          ""
                        ) : (
                          <SpineTermRow
                            key={term.id}
                            term={term}
                            mappingTerm={mappingTermForSpineTerm(term.id)}
                            predicates={predicates}
                            selectedMappingTerms={selectedMappingTerms}
                            mappedTermsToSpineTerm={mappedTermsToSpineTerm}
                            origin={mapping.origin}
                            spineOrigin={mapping.spine_origin}
                            onPredicateSelected={onPredicateSelected}
                            onRevertMapping={(mappedTerm) =>
                              handleRevertMapping(
                                mappingTermForSpineTerm(term.id),
                                mappedTerm
                              )
                            }
                          />
                        );
                      })}
                  </div>
                  <div className="mt-3">
                    <AlignmentOptions />
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
                        Pluralize("property", mappingSelectedTerms.length) +
                        " have been selected from the original specification"
                      }
                      message={
                        "The items below have been added to the " +
                        _.capitalize(mapping.domain) +
                        " domain. Now you can align them to the spine."
                      }
                    />
                    <div className="has-scrollbar scrollbar pr-5">
                      {/* SELECTED TERMS */}

                      <Draggable
                        items={selectedMappingTerms}
                        itemType={DraggableItemTypes.PROPERTIES_SET}
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
                      </Draggable>

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
                            disableClick={
                              addingSynthetic && selectedMappingTerms.length > 0
                            }
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
