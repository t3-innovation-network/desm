const contentType = 'application/json;charset=utf-8;';

/**
 * Saves an object to a files and download it.
 *
 * @param {Object} objectData
 * @param {String} name
 */
export const downloadFile = (objectData, name = null, contentType = 'application/json') => {
  const filename = name || 'export.json';
  const data = typeof objectData === 'object' ? JSON.stringify(objectData) : objectData;

  const a = document.createElement('a');
  a.download = filename;
  a.href = `data:${contentType},${encodeURIComponent(data)}`;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
