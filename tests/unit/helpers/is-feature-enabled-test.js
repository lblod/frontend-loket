import config from 'frontend-loket/config/environment';
import isFeatureEnabled from 'frontend-loket/helpers/is-feature-enabled';
import { module, test } from 'qunit';

module('Unit | Helper | is-feature-enabled', function () {
  test('it works', function (assert) {
    let originalFeaturesConfig = config.features;

    config.features = {};

    config.features.foo = true;
    assert.true(
      isFeatureEnabled('foo'),
      'it returns true if the value is the boolean `true`',
    );

    config.features.foo = 'true';
    assert.true(
      isFeatureEnabled('foo'),
      "it returns true if the value is the string 'true'",
    );

    config.features.foo = false;
    assert.false(
      isFeatureEnabled('foo'),
      'it returns true if the value is the boolean `false`',
    );

    config.features.foo = null;
    assert.false(
      isFeatureEnabled('foo'),
      'it returns false if the value is falsy',
    );

    config.features.foo = 'bar';
    assert.false(
      isFeatureEnabled('foo'),
      'it returns false if the value is any string other than "true"',
    );

    assert.throws(
      () => {
        isFeatureEnabled('baz');
      },
      /The "baz" feature is not defined. Make sure the feature is defined in the "features" object in the config\/environment.js file and that there are no typos in the name./,
      "it throws an assertion error if the feature name doesn't exist",
    );

    config.features = originalFeaturesConfig;
  });
});
