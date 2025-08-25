/**
 * Button to accept the mapping alignment.
 */
const AlignmentsOptions = (props) => {
  const {
    handleSaveAlignments,
    handleDoneAlignment,
    changesPerformed,
    noPartiallyMappedTerms,
    loading,
    isAllowedToMap,
  } = props;

  return (
    <>
      <button
        className="btn btn-dark me-2"
        onClick={handleSaveAlignments}
        disabled={!changesPerformed || loading}
        title={
          'You can save the changes to continue mapping later' +
          (changesPerformed ? '' : '. Try making a change!')
        }
      >
        Save
      </button>
      {isAllowedToMap && (
        <button
          className="btn bg-col-primary col-background"
          onClick={handleDoneAlignment}
          disabled={loading || !noPartiallyMappedTerms}
          title={
            noPartiallyMappedTerms
              ? 'Publish this mapping'
              : 'Be sure to map all the properties to the spine, and to set a predicate to each alignment'
          }
        >
          Publish
        </button>
      )}
    </>
  );
};

export default AlignmentsOptions;
