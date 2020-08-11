import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { inject as service } from '@ember/service';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'functionaris',
  currentSession: service('current-session'),

  async beforeModel(){
    const bestuurseenheidClassificatie = await (await this.currentSession.group).classificatie;
    if(bestuurseenheidClassificatie.uri === "http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000002") {
      this.transitionTo('leidinggevendenbeheer.bestuursfuncties.index');
    }
  },

  async mergeQueryOptions() {
    this.set('bestuursfunctie', this.modelFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie'));
    return {
      'filter[bekleedt][id]': this.bestuursfunctie.id,
      include: 'is-bestuurlijke-alias-van'
    };
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));
    controller.set('bestuursfunctie', this.bestuursfunctie);
  }
});
