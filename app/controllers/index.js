import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @service() currentSession;

  @action
    goToToezicht() {
      this.transitionToRoute('supervision.submissions');
    }

  @action
    goToBbcdr() {
      this.transitionToRoute('bbcdr.rapporten');
    }
    
  @action
    goToMandatenbeheer() {
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }

  @action
    goToBerichtencentrum() {
      this.transitionToRoute('berichtencentrum.berichten');
    }
    
  @action
    goToAdministratievegegevens() {
      this.transitionToRoute('administratieve-gegevens');
    }
    
  @action
    goToLeidinggevendenbeheer() {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties');
    }
    
  @action
    goToPersoneelsbeheer() {
      this.transitionToRoute('personeelsbeheer.personeelsaantallen.index');
    }
    
  @action
    goToSubsidiebeheer() {
      this.transitionToRoute('subsidy.applications.index');
    }		
}
