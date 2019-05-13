import Route from '@ember/routing/route';

export default Route.extend({
  async model() {
    return await this.modelFor('leidinggevendenbeheer.functionarissen.new');
  }
});