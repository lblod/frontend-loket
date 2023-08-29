import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PersoneelsbeheerPersoneelsaantallenIndexRoute extends Route {
  @service currentSession;
  @service store;

  async model() {
    const bestuurseenheid = this.currentSession.group;
    const datasets = await this.store.query('employee-dataset', {
      'filter[bestuurseenheid][id]': bestuurseenheid.id,
    });
    return { bestuurseenheid, datasets };
  }
}
