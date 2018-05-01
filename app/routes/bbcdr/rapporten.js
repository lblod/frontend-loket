import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { inject as service } from '@ember/service';

export default Route.extend(DataTableRouteMixin, {
  currentSession: service(),

  modelName: 'bbcdr-report',

  async beforeModel() {
    const bestuurseenheid = await this.get('currentSession.group');
    this.set('bestuurseenheid', bestuurseenheid);
  },

  mergeQueryOptions(params) {
    return {
      sort: params.sort,
      filter: {
        bestuurseenheid: {
          id: this.get('bestuurseenheid.id')
        }
      },
      include: [
        'files',
        'last-modifier',
        'status'
      ].join(',')
    };
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.get('bestuurseenheid'));
  }
});
