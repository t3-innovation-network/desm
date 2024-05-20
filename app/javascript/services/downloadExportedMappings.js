import axios from 'axios';
import saveAs from 'file-saver';
import queryString from 'query-string';

const downloadExportedMappings = async ({
  configurationProfile = null,
  domainIds,
  format = 'jsonld',
  mapping,
}) => {
  const params = {
    configuration_profile_id: configurationProfile?.id,
    domain_ids: domainIds,
    mapping_id: mapping?.id,
  };

  const response = await axios.get(`/api/v1/mapping_exports.${format}`, {
    params,
    paramsSerializer: (params) => queryString.stringify(params, { arrayFormat: 'bracket' }),
    responseType: 'blob',
  });

  const blob = new Blob([response.data]);
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'export';

  if (contentDisposition) {
    const matches = /filename="([^"]+)"/.exec(contentDisposition);
    if (matches != null && matches[1]) {
      filename = matches[1];
    }
  }

  saveAs(blob, filename);
};

export default downloadExportedMappings;
