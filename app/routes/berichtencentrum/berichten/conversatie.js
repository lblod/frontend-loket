import Route from '@ember/routing/route';

export default Route.extend({

  model(params) {
    let record = this.store.peekRecord ('conversatie', params.id);
    return record;
  }
});
