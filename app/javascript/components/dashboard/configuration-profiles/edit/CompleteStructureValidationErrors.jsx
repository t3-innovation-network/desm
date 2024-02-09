import React from "react";
import { useSelector } from "react-redux";

const CompleteStructureValidationErrors = () => {
  const { completeStructureValidationErrors } = useSelector((state) => state.currentCP)

  if (!completeStructureValidationErrors?.length) {
    return null;
  }

  return (
    <div className="alert alert-warning pt-3">
      <h6>
        The following issues prevent the configuration profile from being promoted to the "Complete" state:
      </h6>

      <ol>
        {completeStructureValidationErrors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ol>
    </div>
  );
};

export default CompleteStructureValidationErrors;
