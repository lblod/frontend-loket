import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'functionaris',
  bestuursFunctieId: null,

  mergeQueryOptions(params) {
    const controller = this.controllerFor('leidinggevendenbeheer.bestuursfuncties');
    controller.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));
    this.set('bestuursFunctieId', params.bestuursfunctie_id);
    return {'filter[bekleedt][id]': params.bestuursfunctie_id, include:'is-bestuurlijke-alias-van'};
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuursfunctie', await this.store.findRecord('bestuursfunctie', this.bestuursFunctieId));
  },

  actions: {
    reloadModelLeidinggevendenbeheerFunctionarissen(){
      this.refresh();
    }

  }
});
