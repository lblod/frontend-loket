import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerNewPersonController extends Controller {
  @service() router;

  queryParams = ['gebruikteVoornaam', 'achternaam', 'rijksregisternummer'];
  @tracked gebruikteVoornaam = '';
  @tracked achternaam = '';
  @tracked rijksregisternummer = '';

  get personPrefilledValues() {
    return {
      voornaam: this.gebruikteVoornaam,
      familienaam: this.achternaam,
      rijksregisternummer: this.rijksregisternummer,
    };
  }

  @action
  onCreate(person) {
    this.router.transitionTo('eredienst-mandatenbeheer.new', {
      queryParams: {
        personId: person.id,
      },
    });
  }

  @action
  onCancel() {
    this.router.transitionTo('eredienst-mandatenbeheer.new');
  }
}
