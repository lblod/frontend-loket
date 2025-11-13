import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  importTriplesForForm,
  validateForm,
  delGraphFor,
  addGraphFor,
} from '@lblod/ember-submission-form-fields';
import { DELETED_STATUS } from '../../../models/submission-document-status';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import fetchManager from 'frontend-loket/utils/fetch-manager';
import fetch from 'frontend-loket/utils/fetch';

export default class SupervisionSubmissionsEditController extends Controller {
  @service currentSession;
  @service store;
  @service router;
  @service toaster;

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
    this.deletedStatus = (
      await this.store.query('submission-document-status', {
        page: { size: 1 },
        'filter[:uri:]': DELETED_STATUS,
      })
    ).at(0);
  }

  @action
  registerObserver() {
    this.formStore.registerObserver(() => {
      this.setTriplesForTables();
    });
  }

  @action
  async setTriplesForTables() {
    this.datasetTriples = await importTriplesForForm(this.form, {
      ...this.graphs,
      sourceNode: this.sourceNode,
      store: this.formStore,
    });
    this.addedTriples = this.formStore.match(
      undefined,
      undefined,
      undefined,
      addGraphFor(this.graphs.sourceGraph),
    );
    this.removedTriples = this.formStore.match(
      undefined,
      undefined,
      undefined,
      delGraphFor(this.graphs.sourceGraph),
    );
  }

  @task
  *saveSubmissionForm() {
    yield fetchManager.request({
      url: `/submission-forms/${this.model.submissionDocument.id}`,
      method: 'PUT',
      headers: new Headers({ 'Content-Type': 'application/vnd.api+json' }),
      body: JSON.stringify({
        ...this.formStore.serializeDataWithAddAndDelGraph(
          this.graphs.sourceGraph,
        ),
      }),
    });

    yield fetchManager.request({
      url: `/submission-forms/${this.model.submissionDocument.id}/flatten`,
      method: 'PUT',
    });

    // Since the form data and related entities are not updated via ember-data
    // we need to manually reload those to keep the index page up-to-date
    const formData = yield this.model.submission.belongsTo('formData').reload();
    yield formData.hasMany('types').reload();
    yield formData.belongsTo('passedBy').reload();
  }

  @task
  *submitSubmissionForm() {
    yield fetchManager.request({
      url: `/submission-forms/${this.model.submissionDocument.id}/submit`,
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/vnd.api+json' }),
    });

    // Since the sent date and sent status of the submission will be set by the backend
    // and not via ember-data, we need to manually reload the submission record
    // to keep the index page up-to-date
    const submission = yield this.model.submission.reload();
    yield submission.belongsTo('status').reload();
  }

  @task
  *delete() {
    try {
      // TODO: use the request manager once that supports non-json responses
      yield fetch(`/submissions/${this.model.submission.id}`, {
        method: 'DELETE',
      });
      this.toaster.success(undefined, 'Dossier verwijderd', {
        timeOut: 3000,
      });
      this.router.transitionTo('supervision.submissions');
    } catch {
      this.toaster.error(
        'Er ging iets fout bij het verwijderen van het dossier.',
        'Bewaren mislukt',
      );
    }
  }

  @task
  *save() {
    try {
      yield this.saveSubmissionForm.perform();

      const user = this.currentSession.user;
      this.model.submission.modified = new Date();
      this.model.submission.lastModifier = user;
      yield this.model.submission.save();

      this.toaster.success(undefined, 'Concept bewaard', {
        timeOut: 3000,
      });
    } catch {
      this.toaster.error(
        'Er ging iets fout bij het bewaren van het dossier.',
        'Bewaren mislukt',
      );
    }
  }

  @task
  *submit() {
    const options = {
      ...this.graphs,
      sourceNode: this.sourceNode,
      store: this.formStore,
    };
    this.isValidForm = yield validateForm(this.form, options);
    if (!this.isValidForm) {
      this.forceShowErrors = true;
    } else {
      const user = this.currentSession.user;
      this.model.submission.modified = new Date();
      this.model.submission.lastModifier = user;

      try {
        yield this.saveSubmissionForm.perform();
        yield this.submitSubmissionForm.perform();
        yield this.model.submission.save();
        this.toaster.success(undefined, 'Dossier verzonden', {
          timeOut: 5000,
        });
        this.router.transitionTo('supervision.submissions');
      } catch {
        this.toaster.error(
          'Er ging iets fout bij het verzenden van het dossier.',
          'Verzenden mislukt',
        );
      }
    }
  }
}
