import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { ROLES } from 'frontend-loket/models/participation';

export default class SubsidyApplicationsNewRoute extends Route {
  @service currentSession;
  @service store;

  async beforeModel(transition) {
    let seriesId = transition.to.queryParams.seriesId;
    assert('A subsidy-measure-offer-series id needs to be provided through the `seriesId` query parameter', Boolean(seriesId));

    transition.data.series = await this.store.findRecord('subsidy-measure-offer-series', seriesId, {
      backgroundReload: false
    });

    if (!transition.data.series) {
      // TODO: Show a warning / error page
      this.transitionTo('subsidy.applications.available-subsidies');
    }
  }

  async model(params, transition) {
    let series = transition.data.series;
    let organisation = await this.currentSession.groupContent;
    let currentUser = await this.currentSession.userContent;

    let participation = this.store.createRecord('participation', {
      role: ROLES.APPLICANT,
      participatingBestuurseenheid: organisation
    });

    await participation.save();

    let applicationFlow = await series.activeApplicationFlow;
    let firstApplicationStep = await applicationFlow.firstApplicationStep;
    let subsidyMeasureOffer = await series.subsidyMeasureOffer;

    let consumption = this.store.createRecord('subsidy-measure-consumption', {
      subsidyApplicationFlow: applicationFlow,
      activeSubsidyApplicationFlowStep: firstApplicationStep,
      subsidyMeasureOffer,
      creator: currentUser,
      lastModifier: currentUser,
      created: new Date(),
      modified: new Date(),
      // TODO Add the concept status once the data is added to the triple store
    });

    consumption.participations.pushObject(participation);

    await consumption.save();

    return consumption;
  }

  afterModel(consumption) {
    this.transitionTo('subsidy.applications.edit', consumption.id);
  }
}
