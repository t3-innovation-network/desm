import apiService, { processMessage } from "./apiService";

const apiGet = async (props) => {
  const response = await apiService.get(props.uri).catch((error) => {
    return {
      error: processMessage(error),
    };
  });

  // Return the respone object with an error
  if (response.error) {
    return response;
  }

  /// We don't have a valid response
  if (response.status != 200) {
    return props.defaultResponse;
  }

  /// We have our response, return in a proper way
  let data = {}
  data[props.successResponse] = response.data;
  return data;
};

export default apiGet;
