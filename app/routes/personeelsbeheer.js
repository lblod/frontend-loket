import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { buildLinkMetaObject } from 'frontend-loket/helpers/relevant-user-manual-link';

export default class PersoneelsbeheerRoute extends Route {
  @service currentSession;
  @service session;
  @service router;

  buildRouteInfoMetadata() {
    return buildLinkMetaObject(
      'https://abb-vlaanderen.gitbook.io/handleiding-personeelsbeheer',
    );
  }

  beforeModel(transition) {
    if (this.session.requireAuthentication(transition, 'login')) {
      if (!this.currentSession.canAccessPersoneelsbeheer)
        this.router.transitionTo('unauthorized');
    }
  }

  model() {
    return {
      bestuurseenheid: this.currentSession.group,
    };
  }
}
