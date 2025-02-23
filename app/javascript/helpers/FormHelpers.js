import { values } from 'lodash';

export const valuesToOptions = (data) =>
  values(data).map((value) => (
    <option key={value} value={value}>
      {value}
    </option>
  ));
