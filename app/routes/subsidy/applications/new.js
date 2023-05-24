import { assert } from '@ember/debug';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { ROLES } from 'frontend-loket/models/participation';
import { STATUS } from '../../../models/subsidy-measure-consumption-status';

export default class SubsidyApplicationsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service store;

  async beforeModel(transition) {
    let seriesId = transition.to.queryParams.seriesId;
    assert(
      'A subsidy-measure-offer-series id needs to be provided through the `seriesId` query parameter',
      Boolean(seriesId)
    );

    transition.data.series = await this.store.findRecord(
      'subsidy-measure-offer-series',
      seriesId,
      {
        backgroundReload: false,
      }
    );

    if (!transition.data.series) {
      // TODO: Show a warning / error page
      this.router.transitionTo('subsidy.applications.available-subsidies');
    }

    if (transition.data.series.isExternallyProcessed) {
      // TODO: Show a warning / error page
      console.warn('This subsidy application should be processed externally');
      this.router.transitionTo('subsidy.applications.available-subsidies');
    }

    const statuses = await this.store.query(
      'subsidy-measure-consumption-status',
      {
        page: { size: 1 },
        'filter[:uri:]': STATUS.CONCEPT,
      }
    );
    if (statuses.length) this.concept = statuses.firstObject;
  }

  async model(params, transition) {
    let series = transition.data.series;
    let organisation = this.currentSession.group;
    let currentUser = this.currentSession.user;

    let participation = this.store.createRecord('participation', {
      role: ROLES.APPLICANT,
      participatingBestuurseenheid: organisation,
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
      status: this.concept,
    });

    consumption.participations.pushObject(participation);

    await consumption.save();

    return consumption;
  }

  afterModel(consumption) {
    this.router.replaceWith('subsidy.applications.edit', consumption.id);
  }
}
