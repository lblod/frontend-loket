import Route from '@ember/routing/route';

export default Route.extend({
  async model(params){
    const aangesteldStatus = (await this.store.query('functionaris-status-code', {
      filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/45b4b155-d22a-4eaf-be3a-97022c6b7fcd' }})).firstObject;

      const waarnemendStatus = (await this.store.query('functionaris-status-code', {
      filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/188fc9c0-dae7-43b2-b2b3-6122c1594479' }})).firstObject;

    const functionaris = await this.store.findRecord('functionaris', params.functionarisId);

    return {
      functionaris: functionaris,
      aangesteldStatus: aangesteldStatus,
      waarnemendStatus: waarnemendStatus,
      initialStatus: await functionaris.status
    }
  }
});