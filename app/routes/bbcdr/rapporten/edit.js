import Route from '@ember/routing/route';

export default class BbcdrRapportenEditRoute extends Route {
  async model(params) {
    let report = await this.store.findRecord('bbcdr-report', params.id, {
      include: ['files', 'last-modifier', 'status'].join(','),
    });

    return {
      report,
      reportFiles: await report.files,
    };
  }
}
