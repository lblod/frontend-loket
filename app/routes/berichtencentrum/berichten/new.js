import Route from '@ember/routing/route';
import { COMMUNICATION_TYPES } from 'frontend-loket/models/bericht';
import { TrackedArray, TrackedObject } from 'tracked-built-ins';

export default class BerichtencentrumBerichtenNewRoute extends Route {
  model() {
    return {
      formData: new TrackedObject({
        type: COMMUNICATION_TYPES.KENNISGEVING,
        files: new TrackedArray(),
      }),
    };
  }
}
