/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ['builds', 'coverage'],
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  plugins: ['stylelint-selector-bem-pattern', 'stylelint-order'],
  rules: {
    'block-no-empty': true,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'order/properties-alphabetical-order': true,
    'plugin/selector-bem-pattern': {
      componentName: '[A-Z]+',
      componentSelectors: {
        initial: '^\\.{componentName}(?:-[a-z]+)?$',
        combined: '^\\.combined-{componentName}-[a-z]+$',
      },
      utilitySelectors: '^\\.util-[a-z]+$',
    },
    'declaration-property-value-no-unknown': [
      true,
      {
        ignoreProperties: {
          '/.+/': ['/[.(rfs)$]+/'], // Ignore SCSS variables
        },
      },
    ],
  },
};
