import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @service() currentSession;
  @service() router;

  @action
    goToToezicht() {
      this.router.transitionTo('supervision.submissions');
    }

  @action
    goToBbcdr() {
      this.router.transitionTo('bbcdr.rapporten');
    }

  @action
    goToMandatenbeheer() {
      this.router.transitionTo('mandatenbeheer.mandatarissen');
    }

  @action
    goToBerichtencentrum() {
      this.router.transitionTo('berichtencentrum.berichten');
    }

  @action
    goToAdministratievegegevens() {
      this.router.transitionTo('administratieve-gegevens');
    }

  @action
    goToLeidinggevendenbeheer() {
      this.router.transitionTo('leidinggevendenbeheer.bestuursfuncties');
    }

  @action
    goToPersoneelsbeheer() {
      this.router.transitionTo('personeelsbeheer.personeelsaantallen.index');
    }

  @action
    goToSubsidiebeheer() {
      this.router.transitionTo('subsidy.applications.index');
    }
}
