import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { COMMUNICATION_TYPES } from 'frontend-loket/models/bericht';
import { TrackedArray, TrackedObject } from 'tracked-built-ins';

export default class BerichtencentrumBerichtenNewRoute extends Route {
  @service currentSession;
  @service router;

  beforeModel() {
    if (!this.currentSession.isAdmin) {
      this.router.transitionTo('berichtencentrum.berichten');
    }
  }

  model() {
    return {
      formData: new TrackedObject({
        type: COMMUNICATION_TYPES.KENNISGEVING,
        files: new TrackedArray(),
      }),
    };
  }
}
