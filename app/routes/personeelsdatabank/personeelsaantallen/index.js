import Route from '@ember/routing/route';

export default Route.extend({
  async model() {
    const bestuurseenheid = this.modelFor('personeelsdatabank');
    const datasets = await this.store.query('employee-dataset', {
      'filter[bestuurseenheid][id]': bestuurseenheid.id
    });
    return { bestuurseenheid, datasets };
  }

});
