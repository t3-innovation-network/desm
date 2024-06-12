import { action, computed } from 'easy-peasy';
import { partition, remove } from 'lodash';
import { baseModel } from '../../stores/baseModel';
import { easyStateSetters } from '../../stores/easyState';

export const defaultState = {
  // status

  // options

  // data
  // The list  of domains (from the skos file)
  domainsList: [],
  // The list of selected domains that should be filtered otherwise
  selectedFilteredDomains: [],
};

export const domainsStore = (initialData = {}) => ({
  ...baseModel(initialData),
  ...easyStateSetters(defaultState, initialData),

  // computed
  // The list of selected domains. The ones the user selects
  selectedDomains: computed((state) => state.domainsList.filter((domain) => domain.selected)),
  allSelected: computed(
    (state) => state.domainsList.findIndex((domain) => !domain.selected) === -1
  ),
  partitionDomains: computed((state) =>
    partition(state.domainsList, (d) => d.uri === 'rdfs:Resource')
  ),
  selectedDomainsSize: computed(
    (state) => state.selectedDomains.length + state.selectedFilteredDomains.length
  ),
  selectedDomainsUris: computed((state) =>
    state.selectedDomains.concat(state.selectedFilteredDomains).map((d) => d.uri)
  ),

  // actions
  resetData: action((state) => {
    state.domainsList = [];
    state.selectedFilteredDomains = [];
  }),
  toggleSelectAll: action((state, selected) => {
    state.domainsList.forEach((d) => {
      d.selected = selected;
    });
    if (!selected) state.selectedFilteredDomains = [];
  }),
  toggleDomain: action((state, id) => {
    let domain = state.domainsList.find((d) => d.id === id);
    if (domain) {
      domain.selected = !domain.selected;
    } else {
      domain = state.selectedFilteredDomains.find((d) => d.id === id);
      if (domain) remove(state.selectedFilteredDomains, domain);
    }
  }),
  updateDomains: action((state, domains) => {
    state.selectedFilteredDomains = state.selectedFilteredDomains.concat(
      state.domainsList.filter((domain) => domain.selected)
    );
    state.domainsList = domains;
    state.domainsList.forEach((domain) => {
      domain.selected = state.selectedFilteredDomains.some((d) => d.id === domain.id);
    });
    state.selectedFilteredDomains = state.selectedFilteredDomains.filter(
      (domain) => domains.findIndex((d) => d.id === domain.id) === -1
    );
  }),

  // thunks
});
