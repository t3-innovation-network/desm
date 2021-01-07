/**
 * Options for sorting a collection of spine terms
 *
 * @todo Resolve the commented sort options
 */
export const spineSortOptions = {
  OVERALL_ALIGNMENT_SCORE: "Overall Alignment Score",
  TOTAL_IDENTICAL_ALIGNMENTS: "Total Identical Alignments",
  ORGANIZATION: "Organization",
  SPINE_CLASS_TYPE: "Spine Class/Type",
  SPINE_PROPERTY: "Spine Property",
  // HAS_ALIGNMENT_ISSUES: "Has Alignment Issues",
  // SOURCE_DATA_ORDER: "Source Data Order",
};

/**
 * Options for sorting a collection of alignments
 */
export const alignmentSortOptions = {
  ORGANIZATION: "Organization",
  CLASS_TYPE: "Class/Type",
  ALIGNMENT_SCORE: "Alignment Score",
  PROPERTY: "Property",
  HAS_ALIGNMENT_ISSUES: "Has Alignment Issues",
};

/**
 * Returns the properties collection ordered by the selected criteria
 *
 * @param {Array} properties
 * @param {String} sortOption
 */
export const implementSpineSort = (properties, sortOption) => {
  switch (sortOption) {
    /**
     * Sort by alignment score. This is a number assigned via calculation in the frontend.
     */
    case spineSortOptions.OVERALL_ALIGNMENT_SCORE:
      return properties.sort((a, b) => b.alignmentScore - a.alignmentScore);
    /**
     * Sort by "identical" alignments ("identical" predicate label)
     */
    case spineSortOptions.TOTAL_IDENTICAL_ALIGNMENTS:
      return properties.sort((a, b) =>
        a.alignments.filter(
          (a) => a.predicate.prefLabel.toLowerCase() == "identical"
        ).length <
        b.alignments.filter(
          (a) => a.predicate.prefLabel.toLowerCase() == "identical"
        ).length
          ? 1
          : -1
      );
    /**
     * Sort by organization name, since a property might be synthetic, meaning that a different
     * organization than the spine added it.
     */
    case spineSortOptions.ORGANIZATION:
      return properties.sort((a, b) =>
        a.organization.name > b.organization.name ? 1 : -1
      );
    /**
     * Sort by selected domain class of the property. This field can be edited in the edit term screen.
     */
    case spineSortOptions.SPINE_CLASS_TYPE:
      return properties.sort((a, b) =>
        a.property.selectedDomain > b.property.selectedDomain ? 1 : -1
      );
    /**
     * Sort by the spine property name
     */
    case spineSortOptions.SPINE_PROPERTY:
      return properties.sort((a, b) => (a.name > b.name ? 1 : -1));
    /**
     * @todo Find out the meaning of this sorting strategy
     */
    case spineSortOptions.HAS_ALIGNMENT_ISSUES:
      return properties;
    /**
     * @todo Find out the meaning of this sorting strategy
     */
    case spineSortOptions.SOURCE_DATA_ORDER:
      return properties;
    default:
      return properties;
  }
};

/**
 * Returns the properties collection ordered by the selected criteria.
 *
 * @param {Array} properties
 * @param {String} sortOption
 */
export const implementAlignmentSort = (properties, sortOption) => {
  switch (sortOption) {
    /**
     * Sort by the property organization name.
     */
    case alignmentSortOptions.ORGANIZATION:
      return properties.sort((a, b) => (a.origin > b.origin ? 1 : -1));
    /**
     * Sort by selected domain class of the property. This field can be edited in the edit term screen.
     */
    case alignmentSortOptions.CLASS_TYPE:
      return properties.sort((a, b) =>
        a.mappedTerms[0].property.selectedDomain >
        b.mappedTerms[0].property.selectedDomain
          ? 1
          : -1
      );
    /**
     * Sort by the alignment weight.
     */
    case alignmentSortOptions.ALIGNMENT_SCORE:
      return properties.sort((a, b) =>
        a.predicate.weight > b.predicate.weight ? 1 : -1
      );
    /**
     * Sort by the property name.
     */
    case alignmentSortOptions.PROPERTY:
      return properties.sort((a, b) =>
        a.mappedTerms[0].property.name > b.mappedTerms[0].property.name ? 1 : -1
      );
    /**
     * Sort bringing those alignments that has comments first.
     */
    case alignmentSortOptions.HAS_ALIGNMENT_ISSUES:
      return properties.sort((a, b) => (a.comment < b.comment ? 1 : -1));
    default:
      return properties;
  }
};
