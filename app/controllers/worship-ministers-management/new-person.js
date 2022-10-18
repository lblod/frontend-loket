import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class WorshipMinistersManagementNewPersonController extends Controller {
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
    this.router.transitionTo('worship-ministers-management.new', {
      queryParams: {
        personId: person.id,
      },
    });
  }

  @action
  onCancel() {
    this.router.transitionTo('worship-ministers-management.new');
  }
}
