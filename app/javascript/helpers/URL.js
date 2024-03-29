/**
 * Returns whether a string correctly represents a valid URL
 *
 * @param {String} str
 */
export const validURL = (str) => {
  var pattern = new RegExp(
    /// protocol
    '^(https?:\\/\\/)?' +
      /// domain name
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      /// OR ip (v4) address
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      /// port and path
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      /// query string
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      /// fragment locator
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );

  return pattern.test(str);
};
