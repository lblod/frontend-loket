import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	currentSession: service(),

	actions: {
    goToToezicht() {
      this.transitionToRoute('supervision.submissions');
    },
		goToBbcdr() {
			this.transitionToRoute('bbcdr.rapporten');
		},
		goToMandatenbeheer() {
			this.transitionToRoute('mandatenbeheer.mandatarissen');
		},
		goToBerichtencentrum() {
			this.transitionToRoute('berichtencentrum.berichten');
		},
		goToAdministratievegegevens() {
			this.transitionToRoute('administratieve-gegevens');
		},
		goToLeidinggevendenbeheer() {
			this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties');
		},
		goToPersoneelsbeheer() {
			this.transitionToRoute('personeelsbeheer.personeelsaantallen.index');
		},
		goToSubsidiebeheer() {
			this.transitionToRoute('subsidiebeheer.subsidies.index');
		}
	}
});
