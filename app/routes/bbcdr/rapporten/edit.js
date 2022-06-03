import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BbcdrRapportenEditRoute extends Route {
  @service store;

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
