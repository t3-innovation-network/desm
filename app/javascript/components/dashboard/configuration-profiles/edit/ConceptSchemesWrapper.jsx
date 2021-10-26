import React from "react";

const ConceptSchemesWrapper = (props) => {
  const { fileIdx } = props;

  return <h3>{`Concept Schemes Wrapper for ${fileIdx + 1}`}</h3>;
};

export default ConceptSchemesWrapper;
