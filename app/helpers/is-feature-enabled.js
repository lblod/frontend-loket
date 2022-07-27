import config from 'frontend-loket/config/environment';
import { assert } from '@ember/debug';

export default function isFeatureEnabled(featureName) {
  let featureFlagValue = config.features?.[featureName];

  assert(
    `The "${featureName}" feature is not defined. Make sure the feature is defined in the "features" object in the config/environment.js file and that there are no typos in the name.`,
    Boolean(featureFlagValue)
  );

  return featureFlagValue === 'true' || featureFlagValue === true;
}
