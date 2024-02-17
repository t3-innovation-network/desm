const contentType = 'application/json;charset=utf-8;';

/**
 * Saves an object to a files and download it.
 *
 * @param {Object} objectData
 * @param {String} name
 */
export const downloadFile = (objectData, name = null) => {
  let filename = name || 'export.json';

  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    /// Build binary large object (BLOB)
    var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(objectData)))], {
      type: contentType,
    });
    /// Save it using the navigator api
    navigator.msSaveOrOpenBlob(blob, filename);
    /// If all good, stop execution
    return;
  }

  /// Plan B: Use a link appoach, adding it to the DOM, to use it and discard it
  /// when it's done.
  downloadWithLink(objectData, filename);
};

/**
 * Saves an object to a files and download it, using link approach
 *
 * @param {Object} objectData
 * @param {String} filename
 */
const downloadWithLink = (objectData, filename) => {
  var a = document.createElement('a');
  a.download = filename;
  a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(objectData));
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
