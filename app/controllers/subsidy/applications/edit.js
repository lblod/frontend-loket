import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  importTriplesForForm,
  validateForm,
  delGraphFor,
  addGraphFor,
} from '@lblod/ember-submission-form-fields';
import fetch from 'fetch';
import { DELETED_STATUS } from '../../../models/submission-document-status';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class SubsidyApplicationsEditController extends Controller {
  @service currentSession;
  @service store;

  @tracked datasetTriples = [];
  @tracked addedTriples = [];
  @tracked removedTriples = [];
  @tracked forceShowErrors = false;
  @tracked isValidForm = true;
  @tracked userSaidTheTruth = false;

  constructor() {
    super(...arguments);
    this.ensureDeletedStatus();
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

  async ensureDeletedStatus() {
    this.deletedStatus = (await this.store.query('submission-document-status', {
      page: {size: 1},
      'filter[:uri:]': DELETED_STATUS,
    })).firstObject;
  }

  @action
  registerObserver() {
    this.formStore.registerObserver(() => {
      this.setTriplesForTables();
    });
  }

  @action
  setTriplesForTables() {
    this.datasetTriples = importTriplesForForm(this.form,
      {...this.graphs, sourceNode: this.sourceNode, store: this.formStore});
    this.addedTriples = this.formStore.match(undefined, undefined, undefined, addGraphFor(this.graphs.sourceGraph));
    this.removedTriples = this.formStore.match(undefined, undefined, undefined, delGraphFor(this.graphs.sourceGraph));
  }

  @action
  toggleUserSaidTheTruth() {
    this.userSaidTheTruth = !this.userSaidTheTruth;
  }

  @task
  * saveApplicationForm() {
    yield fetch(`/management-application-forms/${this.model.applicationForm.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/vnd.api+json'},
      body: JSON.stringify(
        {
          ...this.formStore.serializeDataWithAddAndDelGraph(this.graphs.sourceGraph, 'application/n-triples'),
        },
      ),
    });
  }

  @task
  * submitApplicationForm() {
    yield fetch(`/management-application-forms/${this.model.applicationForm.id}/submit`, {
      method: 'POST',
      headers: {'Content-Type': 'application/vnd.api+json'},
    });
    // Since the sent date and sent status of the application form will be set by the backend
    // and not via ember-data, we need to manually reload the application form record
    // to keep the index page up-to-date
    const applicationForm = yield this.model.applicationForm.reload();
    yield applicationForm.belongsTo('status').reload();
  }

  @task
  * deleteApplicationForm() {
    yield fetch(`/management-application-forms/${this.model.applicationForm.id}`, {
      method: 'DELETE',
    });
  }

  @task
  * delete() {
    yield this.deleteApplicationForm.perform();
    this.transitionToRoute('subsidy.applications');
  }

  @task
  * save() {
    yield this.saveApplicationForm.perform();

    const user = yield this.currentSession.user;
    this.model.applicationForm.modified = new Date();
    this.model.applicationForm.lastModifier = user;
    yield this.model.applicationForm.save();
  }

  @task
  * submit() {
    const options = {...this.graphs, sourceNode: this.sourceNode, store: this.formStore};
    this.isValidForm = validateForm(this.form, options);
    if (!this.isValidForm) {
      this.forceShowErrors = true;
    } else {
      const user = yield this.currentSession.user;
      this.model.applicationForm.modified = new Date();
      this.model.applicationForm.lastModifier = user;

      yield this.saveApplicationForm.perform();
      yield this.submitApplicationForm.perform();
      yield this.model.applicationForm.save();
      this.transitionToRoute('subsidy.applications');
    }
  }
}
