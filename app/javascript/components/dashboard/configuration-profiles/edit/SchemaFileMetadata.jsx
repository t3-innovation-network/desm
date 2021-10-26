import React from "react";

const SchemaFileMetadata = (props) => {
  const { fileIdx } = props;

  return <h3>{`Concept Scheme Metadata for ${fileIdx + 1}`}</h3>;
};

export default SchemaFileMetadata;
