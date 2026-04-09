import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { buildLinkMetaObject } from 'frontend-loket/helpers/relevant-user-manual-link';

export default class BerichtencentrumRoute extends Route {
  @service session;
  @service currentSession;
  @service router;

  buildRouteInfoMetadata() {
    return buildLinkMetaObject(
      'https://abb-vlaanderen.gitbook.io/hoofdloket-handleiding-loket-lokale-besturen/berichtencentrum',
    );
  }

  beforeModel(transition) {
    if (this.session.requireAuthentication(transition, 'login')) {
      if (!this.currentSession.canAccessBerichten)
        this.router.transitionTo('unauthorized');
    }
  }
}
