import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {importTriplesForForm, validateForm,  delGraphFor, addGraphFor} from '@lblod/ember-submission-form-fields';
import fetch from 'fetch';
import { DELETED_STATUS } from '../../../models/submission-document-status';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class SupervisionSubmissionsEditController extends Controller {
  @service currentSession;
  @service store;

  @tracked datasetTriples = [];
  @tracked addedTriples = [];
  @tracked removedTriples = [];
  @tracked forceShowErrors = false;
  @tracked isValidForm = true;

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
      page: { size: 1 },
      'filter[:uri:]': DELETED_STATUS
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
    this.datasetTriples = importTriplesForForm(this.form, { ...this.graphs, sourceNode: this.sourceNode, store: this.formStore });
    this.addedTriples = this.formStore.match(undefined, undefined, undefined, addGraphFor(this.graphs.sourceGraph));
    this.removedTriples = this.formStore.match(undefined, undefined, undefined, delGraphFor(this.graphs.sourceGraph));
  }

  @task
  *saveSubmissionForm() {
    yield fetch(`/submission-forms/${this.model.submissionDocument.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/vnd.api+json'},
      body: JSON.stringify(
        {
          ...this.formStore.serializeDataWithAddAndDelGraph(this.graphs.sourceGraph)
        }
      )
    });
    yield fetch(`/submission-forms/${this.model.submissionDocument.id}/flatten`, {
      method: 'PUT'
    });

    // Since the form data and related entities are not updated via ember-data
    // we need to manually reload those to keep the index page up-to-date
    const formData = yield this.model.submission.belongsTo('formData').reload();
    yield formData.hasMany('types').reload();
    yield formData.belongsTo('passedBy').reload();
  }

  @task
  *submitSubmissionForm() {
    yield fetch(`/submission-forms/${this.model.submissionDocument.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/vnd.api+json'}
    });
    // Since the sent date and sent status of the submission will be set by the backend
    // and not via ember-data, we need to manually reload the submission record
    // to keep the index page up-to-date
    const submission = yield this.model.submission.reload();
    yield submission.belongsTo('status').reload();
  }

  @task
  *deleteSubmissionForm() {
    yield fetch(`/submissions/${this.model.submission.id}`, {
      method: 'DELETE',
    });
  }

  @task
  *delete() {
    yield this.deleteSubmissionForm.perform();
    this.transitionToRoute('supervision.submissions');
  }

  @task
  *save() {
    yield this.saveSubmissionForm.perform();

    const user = yield this.currentSession.user;
    this.model.submission.modified = new Date();
    this.model.submission.lastModifier = user;
    yield this.model.submission.save();
  }

  @task
  *submit() {
    const options = { ...this.graphs, sourceNode: this.sourceNode, store: this.formStore};
    this.isValidForm = validateForm(this.form, options);
    if (!this.isValidForm) {
      this.forceShowErrors = true;
    } else {
      const user = yield this.currentSession.user;
      this.model.submission.modified = new Date();
      this.model.submission.lastModifier = user;

      yield this.saveSubmissionForm.perform();
      yield this.submitSubmissionForm.perform();
      yield this.model.submission.save();
      this.transitionToRoute('supervision.submissions');
    }
  }
}
