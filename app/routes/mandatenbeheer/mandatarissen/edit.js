import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {

  async model(params){
    let parentModel = await this.modelFor('mandatenbeheer');

    let queryParams = {
      include: [
        'is-bestuurlijke-alias-van',
        'bekleedt',
        'bekleedt.bestuursfunctie',
        'beleidsdomein',
        'heeft-lidmaatschap',
        'heeft-lidmaatschap.binnen-fractie'
      ].join(',')
    };

    let mandataris = await this.get('store').findRecord('mandataris', params.id, queryParams);

    return RSVP.hash({
      bestuurseenheid: parentModel.bestuurseenheid,
      bestuursorganen: parentModel.bestuursorganen,
      mandataris: mandataris
    });
  },

  setupController(controller, model){
    this._super(controller, model);
    this.controllerFor('mandatenbeheer.mandatarissen').set('activeChildRoute', this.get('routeName'));
  },

  deactivate(){
    this.controllerFor('mandatenbeheer.mandatarissen').set('activeChildRoute', '');
  }
});
