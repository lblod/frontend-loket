import Controller from '@ember/controller';

export default class SubsidyApplicationsAvailableSubsidiesController extends Controller {
  page = 0;
  size = 10;
  sort =
    'active-application-flow.first-application-step.subsidy-procedural-step.period.end';
}
