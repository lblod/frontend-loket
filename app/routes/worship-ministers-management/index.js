/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

// ministers
export default class MinisterManagementIndexRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service session;
  @service store;

  modelName = 'minister';

  // beforeModel(transition) {
  //   this.session.requireAuthentication(transition, 'login');

  //   if (!this.currentSession.canAccessBedienarenbeheer)
  //     this.router.transitionTo('index');
  // }

  // async model() {
  //   console.log(this.store.findAll('persoon'));
  //   return this.store.findAll('agent-in-position');
  // }
}
