import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { registerFormFields } from '@lblod/ember-submission-form-fields';
import ApplicationFormTableEditComponent from 'frontend-loket/components/rdf-form-fields/application-form-table/edit';
import ApplicationFormTableShowComponent from 'frontend-loket/components/rdf-form-fields/application-form-table/show';
import ClimateSubsidyCostsTableComponent from 'frontend-loket/components/rdf-form-fields/climate-subsidy-costs-table';
import EngagementTableEditComponent from 'frontend-loket/components/rdf-form-fields/engagement-table/edit';
import EngagementTableShowComponent from 'frontend-loket/components/rdf-form-fields/engagement-table/show';
import EstimatedCostEditComponent from 'frontend-loket/components/rdf-form-fields/estimated-cost-table/edit';
import EstimatedCostShowComponent from 'frontend-loket/components/rdf-form-fields/estimated-cost-table/show';
import ObjectiveTableEditComponent from 'frontend-loket/components/rdf-form-fields/objective-table/edit';
import ObjectiveTableShowComponent from 'frontend-loket/components/rdf-form-fields/objective-table/show';
import PlanLivingTogetherTableEditComponent from 'frontend-loket/components/rdf-form-fields/plan-living-together-table/edit';
import PlanLivingTogetherTableShowComponent from 'frontend-loket/components/rdf-form-fields/plan-living-together-table/show';

export default class SubsidyApplicationsEditRoute extends Route {
  @service store;
  @service currentSession;

  constructor() {
    super(...arguments);

    this.registerTableFields();
  }

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

  registerTableFields() {
    registerFormFields([
      {
        displayType:
          'http://lblod.data.gift/display-types/applicationFormTable',
        edit: ApplicationFormTableEditComponent,
        show: ApplicationFormTableShowComponent,
      },
      {
        displayType:
          'http://lblod.data.gift/display-types/climateSubsidyCostTable',
        edit: ClimateSubsidyCostsTableComponent,
      },
      {
        displayType: 'http://lblod.data.gift/display-types/engagementTable',
        edit: EngagementTableEditComponent,
        show: EngagementTableShowComponent,
      },
      {
        displayType: 'http://lblod.data.gift/display-types/estimatedCostTable',
        edit: EstimatedCostEditComponent,
        show: EstimatedCostShowComponent,
      },
      {
        displayType: 'http://lblod.data.gift/display-types/objectiveTable',
        edit: ObjectiveTableEditComponent,
        show: ObjectiveTableShowComponent,
      },
      {
        displayType:
          'http://lblod.data.gift/display-types/planLivingTogetherTable',
        edit: PlanLivingTogetherTableEditComponent,
        show: PlanLivingTogetherTableShowComponent,
      },
    ]);
  }
}
