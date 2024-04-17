import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenIndexController extends Controller {
  @service() router;

  sort = 'start';
  page = 0;
  size = 20;

  @tracked searchData;
  @tracked bestuursfunctie;

  @action
  handleVoegNieuweAanstellingsperiodeClick() {
    this.router.transitionTo(
      'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new',
    );
  }
}
