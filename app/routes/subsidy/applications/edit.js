import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyApplicationsEditRoute extends Route {
  @service store;
  @service currentSession;

  async model({ id: consumptionID }) {
    const consumption = await this.store.findRecord(
      'subsidy-measure-consumption',
      consumptionID,
      {
        include: [
          'active-subsidy-application-flow-step',
          'status',
          'subsidy-measure-offer',
          'subsidy-application-forms',
          'subsidy-application-flow.defined-steps.subsidy-procedural-step',
          'subsidy-application-flow.subsidy-measure-offer-series.period',
          'participations.participating-bestuurseenheid',
          'last-modifier',
        ].join(','),
      }
    );

    return {
      consumption,
      organization: this.currentSession.group,
    };
  }
}
