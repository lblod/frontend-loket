import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { buildLinkMetaObject } from 'frontend-loket/helpers/relevant-user-manual-link';

export default class SupervisionRoute extends Route {
  @service session;
  @service currentSession;
  @service router;

  buildRouteInfoMetadata() {
    return buildLinkMetaObject(
      'https://abb-vlaanderen.gitbook.io/handleiding-toezicht',
    );
  }

  beforeModel(transition) {
    if (this.session.requireAuthentication(transition, 'login')) {
      if (!this.currentSession.canAccessToezicht)
        this.router.transitionTo('unauthorized');
    }
  }
}
