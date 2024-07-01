import { useSelector } from 'react-redux';
import { capitalize, isEmpty, keys, map, snakeCase, sortBy } from 'lodash';
import { i18n } from 'utils/i18n';

const VALIDATION_ERRORS_ORDER = [
  'general',
  'mappingPredicates',
  'abstractClasses',
  'standardsOrganizations',
];

const CompleteStructureValidationErrors = () => {
  const { structureErrors } = useSelector((state) => state.currentCP);

  if (isEmpty(structureErrors)) {
    return null;
  }

  const renderValidationSection = (section) => {
    return (
      <ul className="list-unstyled">
        {map(section, (values, key) => {
          const title =
            values[0].sections.length >= 1 && values[0].path.length > 1
              ? values[0].sections.join(' > ')
              : null;
          const errors = values.map((value) => value.message).join(', ');
          return (
            <li key={key}>
              {title && <span className="fw-bold">{title}</span>}{' '}
              {title ? errors : capitalize(errors)}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderValidationSections = () => {
    const errorKeys = keys(structureErrors);
    const sortedKeys = sortBy(errorKeys, (key) => VALIDATION_ERRORS_ORDER.indexOf(key));

    return sortedKeys.map((key) => {
      let i18nKey = key === 'general' ? 'base' : isEmpty(key) ? 'root' : `${snakeCase(key)}.base`;
      i18nKey = `ui.dashboard.configuration_profiles.structure.${i18nKey}`;
      return (
        <li key={key}>
          <p className="fw-bold mb-0">{i18n.t(i18nKey)}</p>
          {renderValidationSection(structureErrors[key])}
        </li>
      );
    });
  };

  return (
    <div className="alert alert-warning pt-3 mb-0 col-12">
      <h6>{i18n.t('ui.dashboard.configuration_profiles.errors.incomplete')}</h6>
      <ol>{renderValidationSections()}</ol>
    </div>
  );
};

export default CompleteStructureValidationErrors;
