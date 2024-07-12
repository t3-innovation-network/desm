import { action, computed } from 'easy-peasy';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';

export const defaultState = {
  // status

  // options

  // data
  // The list  of domains (from the skos file)
  domains: [],
  // Which domains were found in the uploaded file (the api parses the file to get to it)
  domainsInFile: [],
  // The value of the input that the user is typing in the search box
  //  when there are many domains in the uploaded file
  inputValue: '',
  // Whether there's more than one domain found in the uploaded file
  multipleDomainsInFile: false,
  // Name of the specification
  name: '',
  // Specification id
  id: null,
  // The selected domain to map to
  selectedDomainId: null,
  // Selected domain data (in use only in re-importing mode)
  selectedDomain: {},
  // Specification version
  version: '',
};

export const initFromMapping = (data, mapping) => {
  if (!mapping?.specification) return data;
  return {
    ...data,
    id: mapping.specification.id,
    name: mapping.specification.name,
    version: mapping.specification.version,
    selectedDomainId: mapping.specification.domain.id,
    selectedDomain: mapping.specification.domain,
  };
};

export const mappingFormStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  // The domains that includes the string typed by the user in the
  // search box when there are many domains in the uploaded file
  filteredDomainsInFile: computed((state) =>
    state.domainsInFile.filter((domain) =>
      domain.label.toLowerCase().includes(state.inputValue.toLowerCase())
    )
  ),
  formData: computed((state) => ({
    id: state.id,
    name: state.name,
    version: state.version,
    domainId: state.selectedDomainId,
  })),

  // actions
  updateDataFromMapping: action((state, mapping) => {
    const data = initFromMapping({}, mapping);
    Object.keys(data).forEach((key) => {
      state[key] = data[key];
    });
  }),

  // thunks
});
