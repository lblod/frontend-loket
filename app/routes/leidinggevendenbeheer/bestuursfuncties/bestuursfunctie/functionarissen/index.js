import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'functionaris',
  bestuursfunctieId: null,

  mergeQueryOptions(params) {
    return {
      'filter[bekleedt][id]': params.bestuursfunctie_id, include:'is-bestuurlijke-alias-van'
    };
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));
    controller.set('bestuursfunctie', this.modelFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie'));
  }
});
