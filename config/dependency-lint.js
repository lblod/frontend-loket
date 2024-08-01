'use strict';

module.exports = {
  generateTests: false,
  allowedVersions: {
    'ember-template-imports': '^3.0.0 || ^4.0.0', // This is a build-time addon so we don't need a single version. We can remove this once we update to v4 in the app itself.
  },
};
