import Controller from '@ember/controller';

import { action } from '@ember/object';

import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { dropTask, task } from 'ember-concurrency-decorators';
import fetch from 'fetch';
import { validateForm } from '@lblod/ember-submission-form-fields';

export default class SubsidyApplicationsEditStepEditController extends Controller {

  @service currentSession;
  @service store;
  @service router;

  @tracked error;
  @tracked datasetTriples = [];
  @tracked addedTriples = [];
  @tracked removedTriples = [];
  @tracked forceShowErrors = false;
  @tracked isValidForm = true;
  @tracked recentlySaved = false;

  constructor() {
    super(...arguments);
  }

  get submitted() {
    return this.semanticForm.get('status').get('isSent');
  }

  get formStore() {
    return this.model.formStore;
  }

  get graphs() {
    return this.model.graphs;
  }

  get sourceNode() {
    return this.model.sourceNode;
  }

  get form() {
    return this.model.form;
  }

  get semanticForm() {
    return this.model.semanticForm;
  }

  get consumption() {
    return this.model.consumption;
  }

  get step() {
    return this.model.step;
  }

  get isActiveStep() {
    return this.consumption.activeSubsidyApplicationFlowStep.get('id') === this.step.id;
  }

  get canSubmit(){
    return !this.submitted && this.isActiveStep && this.isInSubmittablePeriod;
  }

  get isInSubmittablePeriod(){
    return !(this.submittablePeriodNeedsToStart || this.submittablePeriodExpired);
  }

  get submittablePeriodNeedsToStart(){
    const today = new Date();
    const begin = this.model.subsidyProceduralStepPeriod.begin;
    if(!begin){
      return false;
    }
    else{
      return today < begin;
    }
  }

  get submittablePeriodExpired(){
    const today = new Date();
    const end = this.model.subsidyProceduralStepPeriod.end;
    if(!end){
      return false;
    }
    else{
      return today > end;
    }
  }

  // TODO what is this?
  @action
  registerObserver() {
    this.formStore.registerObserver(() => {
      this.setTriplesForTables();
    });
  }

  @task
  * saveSemanticForm() {
    yield this.fetch(`/management-application-forms/${this.model.semanticForm.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/vnd.api+json'},
      body: JSON.stringify(
        {
          ...this.formStore.serializeDataWithAddAndDelGraph(this.graphs.sourceGraph, 'application/n-triples'),
        },
      ),
    });
    // Since the sources of the application form will be set/updated by the backend
    // and not via ember-data, we need to manually reload the application form record
    // to keep the form up-to-date
    yield this.model.semanticForm.reload();
    yield this.model.semanticForm.hasMany('sources').reload();
  }

  @task
  * submitSemanticForm() {
    yield this.fetch(`/management-application-forms/${this.model.semanticForm.id}/submit`, {
      method: 'POST',
      headers: {'Content-Type': 'application/vnd.api+json'},
    });
    // Since the sent date and sent status of the application form will be set by the backend
    // and not via ember-data, we need to manually reload the application form record
    // to keep the index page up-to-date
    const semanticForm = yield this.model.semanticForm.reload();
    yield semanticForm.belongsTo('status').reload();
  }

  @task
  * evaluateNextStep() {
    // Since the active step of the consumption will be set by the backend
    // and not via ember-data, we need to manually reload the consumption record
    // to keep the everything up-to-date
    yield this.fetch(`/flow-management/next-step/${this.consumption.id}`, {
      method: 'PATCH',
    });
    yield this.consumption.reload();
    yield this.consumption.belongsTo('activeSubsidyApplicationFlowStep').reload();
  }

  @dropTask
  * save() {
    try {
      yield this.saveSemanticForm.perform();

      // NOTE update modified for the form and the consumption
      yield this.updateModified(this.semanticForm);
      yield this.updateModified(this.consumption);

      this.updateRecentlySaved(); // TODO can this be done on a more "data" driven way
    } catch (exception) {
      console.log(exception);
      this.error = {
        action: 'bewaren',
        exception,
      };
    }
  }

  @dropTask
  * submit() {
    try {
      yield this.save.perform();
      const options = {...this.graphs, sourceNode: this.sourceNode, store: this.formStore};
      this.isValidForm = validateForm(this.form, options);
      if (!this.isValidForm) {
        this.forceShowErrors = true;
      } else {

        yield this.submitSemanticForm.perform();

        // NOTE update modified for the form and the consumption
        yield this.updateModified(this.semanticForm);
        yield this.updateModified(this.consumption);

        yield this.next.perform();

      }
    } catch (exception) {
      console.log(exception);
      this.error = {
        action: 'verzenden',
        exception,
      };
    }
  }

  @task
  * next(){
    // NOTE: move to next step if all was successfully
    yield this.evaluateNextStep.perform();
    if (this.step.id !== this.consumption.activeSubsidyApplicationFlowStep.get('id')) {
      this.router.transitionTo('subsidy.applications.edit', this.consumption.id);
    }
  }

  async updateRecentlySaved() {
    this.recentlySaved = true;
    await timeout(3000);
    this.recentlySaved = false;
  }

  async updateModified(model) {
    model.modified = new Date();
    model.lastModified = await this.currentSession.userContent;
    await model.save();
  }

  /**
   *  Wrapper off ember-fetch to throw an error if something went wrong
   */
  async fetch(url, options) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    } else {
      throw Error(response);
    }
  }

  reset() {
    this.error = null;
    this.forceShowErrors = false;
    this.recentlySaved = false;
  }
}
