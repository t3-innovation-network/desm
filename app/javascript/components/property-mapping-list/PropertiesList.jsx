import { useEffect, useMemo, useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { flatMap, groupBy, intersection, sortBy, uniqBy, isEmpty } from 'lodash';
import AlertNotice from '../shared/AlertNotice';
import fetchAlignmentsForSpine from '../../services/fetchAlignmentsForSpine';
import fetchSpineTerms from '../../services/fetchSpineTerms';
import Loader from '../shared/Loader';
import NoSpineAlert from './NoSpineAlert';
import PropertyAlignments from './PropertyAlignments';
import PropertyCard from './PropertyCard';
import { implementSpineSort } from './SortOptions';
import Info from './Info';

/**
 * @description: The list of properties with its alignments. Contains all the information about the property
 * itself, and the alignment, like the origin, the predicate, and more
 *
 * Props:
 * @param {Boolean} hideSpineTermsWithNoAlignments
 * @param {Object} configurationProfile
 * @param {String} inputValue
 * @param {Array} specifications
 * @param {Object} selectedDomain
 * @param {String} selectedAlignmentOrderOption
 * @param {Array} selectedAlignmentSpecifications
 * @param {Array} selectedPredicates
 * @param {String} selectedSpineOrderOption
 * @param {Array} selectedSpineSpecifications
 */
const PropertiesList = (props) => {
  const {
    hideSpineTermsWithNoAlignments,
    configurationProfile,
    inputValue,
    predicates,
    selectedDomain,
    selectedAlignmentOrderOption,
    selectedAlignmentSpecifications,
    selectedPredicates,
    selectedSpineOrderOption,
    selectedSpineSpecifications,
    showInfo,
    setShowInfo,
  } = props;

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spineExists, setSpineExists] = useState(false);
  const [properties, setProperties] = useState([]);
  const [showingConnectors, setShowingConnectors] = useState({});
  const [collapsedTerms, setCollapsedTerms] = useState([]);

  const selectedPredicateIds = selectedPredicates.map((predicate) => predicate.id);
  const selectedAlignmentSpecificationsIds = selectedAlignmentSpecifications.map((s) => s.id);
  const selectedSpineSpecificationIds = selectedSpineSpecifications.map((s) => s.id);

  const alignmentsExists = (alignments) => {
    return alignments.some((alignment) => !isEmpty(alignment.mappedTerms));
  };

  const onToggleTermCollapse = (termId) => {
    if (collapsedTerms.includes(termId)) {
      setCollapsedTerms(collapsedTerms.filter((id) => id !== termId));
    } else {
      setCollapsedTerms([...collapsedTerms, termId]);
    }
  };

  const onSetShowingConnectors = (termId, value) => {
    setShowingConnectors((prev) => ({
      ...prev,
      [termId]: value,
    }));
  };

  const filteredProperties = useMemo(() => {
    let filteredProps = properties.filter(
      (property) =>
        property.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        (!hideSpineTermsWithNoAlignments ||
          (alignmentsExists(property.alignments) &&
            property.alignments.some((alignment) =>
              selectedPredicateIds.includes(alignment.predicateId)
            ) &&
            property.alignments.some((alignment) =>
              selectedAlignmentSpecificationsIds.includes(alignment.mapping.specification.id)
            ) &&
            intersection(
              selectedSpineSpecificationIds,
              property.specifications.map((s) => s.id)
            ).length))
    );

    return implementSpineSort(filteredProps, selectedSpineOrderOption);
  }, [
    selectedSpineOrderOption,
    properties,
    inputValue,
    hideSpineTermsWithNoAlignments,
    selectedSpineSpecificationIds,
    selectedAlignmentSpecificationsIds,
    selectedPredicateIds,
  ]);

  const anyError = (response) => {
    if (response.error) {
      setErrors((prevErrors) => [...prevErrors, response.error]);
    }
    return !isEmpty(response.error);
  };

  const decoratePropertiesWithAlignments = async (spineId, spineTerms) => {
    const response = await fetchAlignmentsForSpine({
      spineId,
      configurationProfileId: configurationProfile?.id,
    });

    if (!anyError(response)) {
      const { alignments } = response;
      const groupedAlignments = groupBy(alignments, 'spineTermId');

      spineTerms.forEach((term) => {
        term.alignments = groupedAlignments[term.id] || [];
        term.alignmentScore =
          term.maxMappingWeight > 0 ? (term.currentMappingWeight * 100) / term.maxMappingWeight : 0;
      });
    }

    return spineTerms;
  };

  const handleFetchProperties = async (spineId) => {
    let response = await fetchSpineTerms(spineId, {
      withWeights: true,
      configurationProfileId: configurationProfile?.id,
    });

    if (!anyError(response)) {
      const properties = await decoratePropertiesWithAlignments(spineId, response.terms);
      setProperties(properties);
    }
  };

  const handleFetchDataFromAPI = async () => {
    setLoading(true);
    setSpineExists(selectedDomain.spine);

    if (selectedDomain.spine) {
      await handleFetchProperties(selectedDomain.spineId);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleFetchDataFromAPI();
  }, [selectedDomain?.id]);

  const filteredPropertiesList = () =>
    filteredProperties.map((term) => {
      const collapsed = collapsedTerms.includes(term.id);
      return (
        <div className="desm-mapping-list row u-margin-bottom--gutter" key={term.id}>
          <div className="col-lg-4 col-12">
            <PropertyCard
              term={term}
              collapsed={collapsed}
              onToggleTermCollapse={onToggleTermCollapse}
              showingConnectors={(showingConnectors[term.id] || false) && !collapsed}
            />
          </div>
          <div className="col-lg-8 col-12">
            <Collapse in={!collapsed}>
              <div className="desm-mapping-list__alignments">
                <PropertyAlignments
                  selectedAlignmentOrderOption={selectedAlignmentOrderOption}
                  selectedAlignmentSpecificationsIds={selectedAlignmentSpecificationsIds}
                  selectedPredicateIds={selectedPredicateIds}
                  selectedSpineSpecificationIds={selectedSpineSpecificationIds}
                  spineTerm={term}
                  onSetShowingConnectors={onSetShowingConnectors}
                />
              </div>
            </Collapse>
          </div>
        </div>
      );
    });

  const sharedMappings = () => {
    const mappings = uniqBy(
      flatMap(filteredProperties, (term) => term.alignments.map((a) => a.mapping)),
      'id'
    );

    const groupedMappings = {};

    for (const mapping of mappings) {
      const lastMapping = groupedMappings[mapping.specification.name];

      if (!lastMapping || lastMapping.mappedAt < mapping.mappedAt) {
        groupedMappings[mapping.specification.name] = mapping;
      }
    }

    return sortBy(Object.values(groupedMappings), 'specification.name');
  };

  return loading ? (
    <Loader />
  ) : errors.length ? (
    <AlertNotice message={errors} onClose={() => setErrors([])} />
  ) : spineExists ? (
    <>
      <Offcanvas
        placement="start"
        show={showInfo}
        onHide={() => setShowInfo(false)}
        aria-labelledby="Info"
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <Info sharedMappings={sharedMappings()} predicates={predicates} />
        </Offcanvas.Body>
      </Offcanvas>
      {filteredPropertiesList()}
    </>
  ) : (
    <NoSpineAlert />
  );
};

export default PropertiesList;
