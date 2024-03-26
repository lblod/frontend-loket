import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewPersonController extends Controller {
  @service() router;

  queryParams = ['voornaam', 'achternaam', 'rijksregisternummer'];
  @tracked voornaam;
  @tracked achternaam;
  @tracked rijksregisternummer;

  get personPrefilledValues() {
    return {
      voornaam: this.voornaam,
      familienaam: this.achternaam,
      rijksregisternummer: this.rijksregisternummer,
    };
  }

  @action
  onCreate(user) {
    this.router.transitionTo(
      'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.periode',
      user.get('id'),
    );
  }

  @action
  onCancel() {
    this.router.transitionTo(
      'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new',
    );
  }
}
