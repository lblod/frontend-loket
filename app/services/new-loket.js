import Service, { service } from '@ember/service';
import isFeatureEnabled from 'frontend-loket/helpers/is-feature-enabled';

export default class NewLoketService extends Service {
  @service currentSession;

  get shouldUseNewLoket() {
    return (
      isFeatureEnabled('new-loket') && this.currentSession?.group?.usesNewLoket
    );
  }
}
