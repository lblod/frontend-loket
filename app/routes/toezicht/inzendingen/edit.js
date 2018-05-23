import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    let models =  (await this.get('store').query('form-solution', {'filter[inzending-voor-toezicht][id]': params.id,
                                                                   include: 'inzending-voor-toezicht'}));
    return models.firstObject;
  }
});
