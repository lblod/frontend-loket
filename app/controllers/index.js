import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	currentSession: service(),
	actions: {
		goToToezicht() {
			this.transitionToRoute('toezicht.inzendingen');
		},
		goToBbcdr() {
			this.transitionToRoute('bbcdr.rapporten')
		},
		goToMandatenbeheer() {
			this.transitionToRoute('mandatenbeheer.mandatarissen')
		},
		goToAdministratievegegevens() {
			this.transitionToRoute('administratieve-gegevens')
		}
	}
});
