import Route from '@ember/routing/route';
import config from 'frontend-loket/config/environment';
import { inject as service } from '@ember/service';

export default class SubsidiesExternalRedirectRoute extends Route {
  @service router;

  model(params, transition) {
    if (!config.subsidiesUrl.startsWith('{{')) {
      const subsidiesUrl = new URL(config.subsidiesUrl);
      if (transition.to.localName === 'with-path') {
        const path = '/subsidy/' + transition.to.params.path;
        subsidiesUrl.pathname = path;
      }

      window.location.replace(subsidiesUrl);
    } else {
      // The URL isn't configured so we redirect to the index page instead.
      this.router.replaceWith('index');
    }
  }
}
