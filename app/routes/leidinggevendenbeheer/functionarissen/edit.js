import Route from '@ember/routing/route';

export default Route.extend({
  async model(params){
    const functionaris = await this.store.findRecord('functionaris', params.functionaris_id);
    return {
      functionaris: functionaris,
      /**
       * This value will be used to determine whether the status has been changed or not.
       * This check is necessary when we are leaving the route.
       */
      initialStatus: await functionaris.status
    };
  }
});
