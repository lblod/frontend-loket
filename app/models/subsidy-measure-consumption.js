import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';

export default class SubsidyMeasureConsumptionModel extends Model {
  // This flag can be used to mark this record "instable". It shouldn't be possible to delete instable records.
  // Note that we assume there will only ever be 1 action that manipulates this value at the same time.
  // If it needs to be possible to run actions concurrently this should replaced by an array
  // of concurrency task instances and a getter which returns true if no tasks are running.
  @tracked isStable = true;

  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('gebruiker') creator;
  @belongsTo('gebruiker') lastModifier;
  @belongsTo('subsidy-request') subsidyRequest;
  @belongsTo('subsidy-measure-offer') subsidyMeasureOffer;
  @belongsTo('subsidy-application-flow') subsidyApplicationFlow;
  @belongsTo('subsidy-application-flow-step') activeSubsidyApplicationFlowStep;
  @belongsTo('subsidy-measure-consumption-status') status;
  @hasMany('participation') participations;
  @hasMany('subsidy-application-form') subsidyApplicationForms;

  get deadline() {
    if (this.activeSubsidyApplicationFlowStep)
      return this.activeSubsidyApplicationFlowStep.get(
        'subsidyProceduralStep.period'
      );
    return undefined;
  }

  get projectName(){
    let projectNames = new Set();
    for ( let form of this.subsidyApplicationForms.toArray() ){
      if (form.projectName)
        projectNames.add(form.projectName);
      }
    return [...projectNames].join(', ');
  }
}
