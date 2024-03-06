import { action } from 'easy-peasy';
import { assign, camelCase, isUndefined, map, keys } from 'lodash';

const easyState = (name, defaultValue = null) => ({
  [name]: isUndefined(defaultValue) ? null : defaultValue,
  [camelCase(`set ${name}`)]: action((state, value) => {
    state[name] = value;
  }),
});

// initialize multiple values from defaultState
export const easyStateSetters = (obj, initialData = {}) => {
  return assign(
    {},
    ...map(keys(obj), (name) =>
      easyState(name, isUndefined(initialData[name]) ? obj[name] : initialData[name])
    )
  );
};

export default easyState;
