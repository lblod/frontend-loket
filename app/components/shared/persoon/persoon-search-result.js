import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SharedPersoonPersoonSearchResultComponent extends Component {
  @service currentSession;
  @tracked showDetails = false;

  @action
  select() {
    this.args.onSelect(this.args.persoon);
  }

  @action
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  get mailContent() {
    let mail = 'LoketLokaalBestuur@vlaanderen.be';
    let administrativeUnitName = `${this.currentSession.groupClassification.label} ${this.currentSession.group.naam}`;
    let subject = encodeURIComponent('Melden van onvolledige of foutieve data');
    // The indentation is intentional, otherwise the email would display white space in the front
    // TODO: look for some de-indent solution since we could use it in other places as well
    let message = encodeURIComponent(`\
Beste Loket team,

Ik zie foutieve data bij/wens een ander probleem te melden:
Bestuur: ${administrativeUnitName}
Persoon: ${this.args.persoon.gebruikteVoornaam} ${this.args.persoon.achternaam}
Foute data: [Vul details aan]
Correctie: [Vul details aan]`);

    return `mailto:${mail}?subject=${subject}&body=${message}`;
  }
}
