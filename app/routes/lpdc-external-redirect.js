import Route from '@ember/routing/route';
import config from 'frontend-loket/config/environment';
import { inject as service } from '@ember/service';

export default class LpdcExternalRedirectRoute extends Route {
  @service router;

  model(params, transition) {
    if (!config.lpdcUrl.startsWith('{{')) {
      const lpdcUrl = new URL(config.lpdcUrl);

      if (transition.to.localName === 'with-path') {
        const { path } = transition.to.params;
        lpdcUrl.pathname = path;
      }

      window.location.replace(lpdcUrl);
    } else {
      // The URL isn't configured so we redirect to the index page instead.
      this.router.replaceWith('index');
    }
  }
}
