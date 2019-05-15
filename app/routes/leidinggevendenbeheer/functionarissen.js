import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  currentSession: service(),
  modelName: 'functionaris',
  bestuursFunctieId: null,

  async beforeModel() {
    const bestuurseenheid = await this.get('currentSession.group');
    this.set('bestuurseenheid', bestuurseenheid);
  },

  mergeQueryOptions(params) {
    this.set('bestuursFunctieId', params.bestuursfunctieId);
    return {'filter[bekleedt][id]': params.bestuursfunctieId};
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.bestuurseenheid);
    controller.set('bestuursfunctie', await this.store.findRecord('bestuursfunctie', this.bestuursFunctieId));
  }
});