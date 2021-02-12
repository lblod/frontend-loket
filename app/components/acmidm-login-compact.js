import { warn } from '@ember/debug';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AcmidmLoginCompactComponent extends Component {
  @service('session') session;

  @tracked errorMessage;
  @tracked isAuthenticating;

  @action
    login() {
      this.session.authenticate('authenticator:torii', 'acmidm-oauth2').catch((reason) => {
        warn(reason.error || reason, { id: 'authentication.failure' });

        if (reason.status == 403)
          this.errorMessage = 'U heeft geen toegang tot deze applicatie.';
        else
          this.errorMessage = 'Fout bij het aanmelden. Gelieve opnieuw te proberen.';
      })
      .finally(() => {
        this.isAuthenticating = false;
      });
    }
}

