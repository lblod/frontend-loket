import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  currentSession: service(),
  modelName: 'inzending-voor-toezicht',
  async beforeModel() {
    const bestuurseenheid = await this.get('currentSession.group');
    this.set('bestuurseenheid', bestuurseenheid);
  },
  mergeQueryOptions() {
    return {'filter[bestuurseenheid][id]': this.bestuurseenheid.id};
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.get('bestuurseenheid'));
  }
});
