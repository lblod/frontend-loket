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
    this.set('bestuursFunctieId', params.bestuursfunctie_id);
    return {'filter[bekleedt][id]': params.bestuursfunctie_id, include:'is-bestuurlijke-alias-van'};
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.bestuurseenheid);
    controller.set('bestuursfunctie', await this.store.findRecord('bestuursfunctie', this.bestuursFunctieId));
  },

  actions: {
    reloadModelLeidinggevendenbeheerFunctionarissen(){
      this.refresh();
    }

  }
});
