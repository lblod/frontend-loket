import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PersoneelsbeheerPersoneelsaantallenPeriodesRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('employee-dataset', params.dataset_id);
  }
}
