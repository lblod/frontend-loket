import Route from '@ember/routing/route';

export default Route.extend({

  model(){
    return this.modelFor('mandatenbeheer');
  },

  setupController(controller, model){
    this._super(controller, model);
    this.controllerFor('mandatenbeheer.mandatarissen').set('activeChildRoute', this.get('routeName'));
  },

  deactivate(){
    this.controller.clearProperties();
    this.controllerFor('mandatenbeheer.mandatarissen').set('activeChildRoute', '');
  }
});
