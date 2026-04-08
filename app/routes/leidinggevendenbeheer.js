import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { buildLinkMetaObject } from 'frontend-loket/helpers/relevant-user-manual-link';

export default class LeidinggevendenbeheerRoute extends Route {
  @service session;
  @service currentSession;
  @service router;

  buildRouteInfoMetadata() {
    return buildLinkMetaObject(
      'https://abb-vlaanderen.gitbook.io/handleiding-leidinggevendenbeheer',
    );
  }

  beforeModel(transition) {
    if (this.session.requireAuthentication(transition, 'login')) {
      if (!this.currentSession.canAccessLeidinggevenden)
        this.router.transitionTo('unauthorized');
    }
  }

  model() {
    return this.currentSession.group;
  }
}
