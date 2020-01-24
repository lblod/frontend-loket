import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    return this.store.query('employee-observation', {
      page: { size: 100 },
      'filter[slice][id]': params.period_id,
      include: ['unit-measure',
                'educational-level',
                'sex',
                'working-time-category',
                'legal-status',
                'slice'].join(',')
    });
  },

  setupController(controller) {
    this._super(...arguments);
    const dataset = this.modelFor('personeelsbeheer.personeelsaantallen.periodes');
    controller.set('dataset', dataset);
  }
});
