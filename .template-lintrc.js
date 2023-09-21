'use strict';

module.exports = {
  extends: 'recommended',
  overrides: [
    {
      files: ['tests/**/*-test.*'],
      rules: {
        'require-input-label': false,
      },
    },
  ],
};
