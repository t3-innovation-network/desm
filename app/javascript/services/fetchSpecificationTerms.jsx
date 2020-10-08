import apiService from "./apiService";

const fetchSpecificationTerms = async (specId) => {
  try {
    const response = await apiService.get(
      "/api/v1/specifications/" + specId + "/terms"
    );
    /// We don't have a valid response
    if (response.status != 200) {
      return [];
    }
    /// We have our response, return in a proper way
    return {
      terms: response.data,
    };
  } catch (e) {
    /// Default error message
    let message = "We found an error!";

    /// Override default message with the generic from the error object
    if (e.message) {
      message = e.message;
    }

    /// Override the genric message with a specific from the service, if we found one
    if (e.response && e.response.data && e.response.data.message) {
      message = e.response.data.message;
    }

    return {
      error: {
        message: message,
      },
    };
  }
};

export default fetchSpecificationTerms;
