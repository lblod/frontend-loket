import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  ForkingStore,
  validateForm,
} from '@lblod/ember-submission-form-fields';
import rdflib from 'browser-rdflib';
import { dropTask, task, dropTaskGroup, timeout } from 'ember-concurrency';
import ConfirmDeletionModal from 'frontend-loket/components/public-services/confirm-deletion-modal';
import UnsavedChangesModal from 'frontend-loket/components/public-services/details/unsaved-changes-modal';
import { loadPublicServiceDetails } from 'frontend-loket/utils/public-services';

const FORM_GRAPHS = {
  formGraph: new rdflib.NamedNode('http://data.lblod.info/form'),
  metaGraph: new rdflib.NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`),
};

const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');
const RDF = new rdflib.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

export default class PublicServicesDetailsPageComponent extends Component {
  @service modals;
  @service router;
  @service store;

  @tracked submitToGoverment = false;
  @tracked isSubmit = false;

  @action
  sending() {
    this.submitToGoverment = !this.submitToGoverment;
  }

  @tracked hasUnsavedChanges = false;
  @tracked forceShowErrors = false;

  id = guidFor(this);
  form;
  formStore;
  graphs = FORM_GRAPHS;

  constructor() {
    super(...arguments);

    this.loadForm.perform();
    this.sourceNode = new rdflib.NamedNode(this.args.publicService.uri);
    this.router.on('routeWillChange', this, this.showUnsavedChangesModal);
  }

  @task
  *loadForm() {
    const {
      form: formTtl,
      meta: metaTtl,
      source: sourceTtl,
    } = yield fetchFormGraphs(this.args.publicService.id, this.args.formId);

    let formStore = new ForkingStore();
    formStore.parse(formTtl, FORM_GRAPHS.formGraph, 'text/turtle');
    formStore.parse(metaTtl, FORM_GRAPHS.metaGraph, 'text/turtle');
    formStore.parse(sourceTtl, FORM_GRAPHS.sourceGraph, 'text/turtle');

    let form = formStore.any(
      undefined,
      RDF('type'),
      FORM('Form'),
      FORM_GRAPHS.formGraph
    );

    formStore.registerObserver(this.updateFormDirtyState, this.id);

    this.form = form;
    this.formStore = formStore;
  }

  @action
  updateFormDirtyState(/* delta */) {
    // TODO: we can probably make this logic smarter so that reverting to the original saved state doesn't trigger a false positive
    this.hasUnsavedChanges = true;
  }

  @dropTaskGroup publicServiceAction;

  @task({ group: 'publicServiceAction' })
  *publishPublicService() {
    let isValidForm = validateForm(this.form, {
      ...this.graphs,
      sourceNode: this.sourceNode,
      store: this.formStore,
    });

    this.forceShowErrors = !isValidForm;

    if (isValidForm) {
      if (this.hasUnsavedChanges) {
        yield this.saveSemanticForm.unlinked().perform();
      }

      // TODO: replace this with the function call to the backend
      yield timeout(1000);

      this.router.transitionTo('public-services');
    } else {
      // TODO: Show some sort of error message
    }
  }

  @task({ group: 'publicServiceAction' })
  *handleFormSubmit(event) {
    event?.preventDefault?.();

    yield this.saveSemanticForm.unlinked().perform();
  }

  @dropTask
  *saveSemanticForm() {
    let serializedData = this.formStore.serializeDataWithAddAndDelGraph(
      this.graphs.sourceGraph,
      'application/n-triples'
    );

    yield saveFormData(
      this.args.publicService.id,
      this.args.formId,
      serializedData
    );

    yield loadPublicServiceDetails(this.store, this.args.publicService.id);
    this.hasUnsavedChanges = false;

    this.submitToGoverment = false;
  }

  @action
  removePublicService() {
    this.modals.open(ConfirmDeletionModal, {
      deleteHandler: async () => {
        await this.args.publicService.destroyRecord();
        this.router.replaceWith('public-services');
      },
    });
  }

  async showUnsavedChangesModal(transition) {
    if (transition.isAborted) {
      return;
    }

    if (this.hasUnsavedChanges) {
      transition.abort();

      let shouldTransition = await this.modals.open(UnsavedChangesModal, {
        saveHandler: async () => {
          await this.saveSemanticForm.perform();
        },
      });

      if (shouldTransition) {
        this.hasUnsavedChanges = false;
        transition.retry();
      }
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.formStore.deregisterObserver(this.id);
    this.router.off('routeWillChange', this, this.showUnsavedChangesModal);
  }
}

async function fetchFormGraphs(serviceId, formId) {
  let response = await fetch(`/lpdc-management/${serviceId}/form/${formId}`);
  return await response.json();
}

async function saveFormData(serviceId, formId, formData) {
  await fetch(`/lpdc-management/${serviceId}/form/${formId}`, {
    method: 'PUT',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
}
