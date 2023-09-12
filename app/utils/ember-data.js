import { registerWarnHandler } from '@ember/debug';

export function silenceEmptySyncRelationshipWarnings() {
  // EmberData displays a warning when we push records with sync relationships where the API only provides a link and no data
  // Due to legacy reasons EmberData makes the assumption that the relationship is empty, even though it's valid according to the {json:api} spec.
  // Since the warning is verbose we silence it but it does require some extra workarounds sometimes (reload instead of load for example).
  // More info: https://github.com/emberjs/data/issues/7584
  registerWarnHandler((message, options, next) => {
    if (options.id === 'ds.store.push-link-for-sync-relationship') {
      return;
    }

    next(message, options);
  });
}
