import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.query('toezicht-report', {
      sort: '-created',
      page: {
        size: 2
      }
    });
  }
});
