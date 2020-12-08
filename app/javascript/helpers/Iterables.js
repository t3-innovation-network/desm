/**
 * Transforms an array of string values into an array of objects with id and name
 * to be used in a select.
 *
 * @param {Array} options An array of string values
 */
export const iterableSelectableOptions = (options) => {
  return options.map((option, i) => {
    return {
      id: i,
      name: option,
    };
  });
};
