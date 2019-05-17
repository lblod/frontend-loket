import Route from '@ember/routing/route';

export default Route.extend({
  async model(params){
    const functionaris = await this.store.findRecord('functionaris', params.functionarisId);
    return {
      functionaris: functionaris,
      initialStatus: await functionaris.status
    }
  }
});