import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {

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
