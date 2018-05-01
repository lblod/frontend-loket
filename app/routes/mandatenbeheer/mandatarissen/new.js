import Route from '@ember/routing/route';

export default Route.extend({
  setupController(controller, model){
    this._super(controller, model);
    this.controllerFor('mandatenbeheer.mandatarissen').set('activeChildRoute', this.get('routeName'));
  },

  deactivate(){
    this.controllerFor('mandatenbeheer.mandatarissen').set('activeChildRoute', '');
  }
});
