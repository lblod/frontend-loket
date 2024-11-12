'use strict';

module.exports = {
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: '*.{js,mjs,ts,gjs,gts}',
      options: {
        singleQuote: true,
        templateSingleQuote: false,
      },
    },
  ],
};
