import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const bestuurseenheid = this.modelFor('leidinggevendenbeheer');
    return this.store.query('bestuursfunctie', {
      'filter[bevat-in][is-tijdsspecialisatie-van][bestuurseenheid][:id:]':bestuurseenheid.id
    });
  }
});
