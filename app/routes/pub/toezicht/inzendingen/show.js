import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    const models = await this.get('store').query('form-solution', {
      filter: {
        'inzending-voor-toezicht': {
          id: params.id
        }
      }
    });

    return models.firstObject;
  }
});
