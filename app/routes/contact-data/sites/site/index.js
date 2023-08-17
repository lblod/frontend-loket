import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ContactDataSitesSiteIndexRoute extends Route {
  @service store;
  async model() {
    const data = this.store.findAll('bestuurseenheid');
    console.log(data);
    return data;
  }
}
