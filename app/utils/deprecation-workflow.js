// Basic deprecation workflow implementation based on the RFC: https://github.com/emberjs/rfcs/blob/9310137035a094ccc1675aff66af73c0691a047c/text/1009-move-deprecation-workflow-to-apps.md
import { registerDeprecationHandler } from '@ember/debug';
// import config from 'frontend-loket/config/environment';

// const SHOULD_THROW = config.environment !== 'production';
const SHOULD_THROW = false; // We don't want to throw for now.
const SILENCED_DEPRECATIONS = [
  // Add ids of deprecations you temporarily want to silence here.
];

registerDeprecationHandler((message, options, next) => {
  if (!options) {
    console.error('Missing options');
    throw new Error(message);
  }

  if (SILENCED_DEPRECATIONS.includes(options.id)) {
    return;
  } else if (SHOULD_THROW) {
    throw new Error(message);
  }

  next(message, options);
});
