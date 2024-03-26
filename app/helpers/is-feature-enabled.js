import config from 'frontend-loket/config/environment';
import { assert } from '@ember/debug';

export default function isFeatureEnabled(featureName) {
  let features = config.features || {};

  assert(
    `The "${featureName}" feature is not defined. Make sure the feature is defined in the "features" object in the config/environment.js file and that there are no typos in the name.`,
    featureName in features,
  );

  let featureFlagValue = features[featureName];

  return featureFlagValue === 'true' || featureFlagValue === true;
}
