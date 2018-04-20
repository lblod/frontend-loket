import Route from '@ember/routing/route';

export default Route.extend({

  model(){
    return this.modelFor('mandatenbeheer');
  },

  setupController(){
    this.controllerFor('mandatenbeheer.mandatarissen').set('activeChildRoute', this.get('routeName'));
  },

  deactivate(){
    this.controllerFor('mandatenbeheer.mandatarissen').set('activeChildRoute', '');
  }
});
