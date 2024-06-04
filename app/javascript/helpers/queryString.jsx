import queryString from 'query-string';
import { isEqual } from 'lodash';
import { camelizeKeys } from 'humps';

export const parseLocationSearch = ({ location }) => queryString.parse(location.search);
// React Router v6 compatibile
export const parseSearchParams = (search) => {
  return Object.fromEntries([...search]);
};
// React Router v6 compatibile
export const camelizeLocationSearch = (props, params = {}) =>
  camelizeKeys(params.v6 ? Object.fromEntries([...props]) : parseLocationSearch(props));

// React Router v6 compatibile
export const parseWithRouter = (
  params,
  effects,
  parsingParams = { withCamelizedKeys: false, v6: false }
) => {
  let parsed = {};

  if (parsingParams.v6) {
    parsed = parseSearchParams(params);
  } else {
    const { location } = params;
    parsed = queryString.parse(location.search);
  }

  if (parsingParams.withCamelizedKeys) parsed = camelizeKeys(parsed);

  if (effects) {
    for (const param of Object.keys(effects)) {
      const [effect, defaultValue] = effects[param];
      const value = parsed[param];
      if (value) {
        effect(value);
      } else {
        effect(defaultValue);
      }
    }
  }
  return parsed;
};

// React Router v6 compatibile
export const updateWithRouter = ({ history, location, v6 = false }) => (search) => {
  const oldSearch = v6 ? parseSearchParams(location) : queryString.parse(location.search);
  const newSearch = { ...oldSearch, ...search };
  for (const k of Object.keys(newSearch)) {
    if (!newSearch[k]) {
      delete newSearch[k];
    }
  }
  // don't need to push history if search is the same
  if (isEqual(oldSearch, newSearch)) return;
  const newQuery = new URLSearchParams(newSearch).toString();
  const params = { pathname: '', search: `?${newQuery}` };
  v6 ? history(params) : history.push(params);
};
