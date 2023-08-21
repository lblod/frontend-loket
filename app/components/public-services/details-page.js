import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  ForkingStore,
  validateForm,
} from '@lblod/ember-submission-form-fields';
import { NamedNode } from 'rdflib';
import { dropTask, task, dropTaskGroup } from 'ember-concurrency';
import ConfirmDeletionModal from 'frontend-loket/components/public-services/confirm-deletion-modal';
import ConfirmReopeningModal from 'frontend-loket/components/public-services/confirm-reopening-modal';
import ConfirmSubmitModal from 'frontend-loket/components/public-services/confirm-submit-modal';
import UnsavedChangesModal from 'frontend-loket/components/public-services/details/unsaved-changes-modal';
import { FORM, RDF } from 'frontend-loket/rdf/namespaces';
import { loadPublicServiceDetails } from 'frontend-loket/utils/public-services';

const FORM_MAPPING = {
  'cd0b5eba-33c1-45d9-aed9-75194c3728d3': 'inhoud',
  '149a7247-0294-44a5-a281-0a4d3782b4fd': 'eigenschappen',
};

const FORM_GRAPHS = {
  formGraph: new NamedNode('http://data.lblod.info/form'),
  metaGraph: new NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new NamedNode(`http://data.lblod.info/sourcegraph`),
};

const SERVICE_STATUS = {
  SENT: 'http://lblod.data.gift/concepts/9bd8d86d-bb10-4456-a84e-91e9507c374c',
  CONCEPT:
    'http://lblod.data.gift/concepts/79a52da4-f491-4e2f-9374-89a13cde8ecd',
};

export default class PublicServicesDetailsPageComponent extends Component {
  @service modals;
  @service router;
  @service store;
  @service toaster;

  @tracked hasUnsavedChanges = false;
  @tracked forceShowErrors = false;
  @tracked form;

  id = guidFor(this);
  formStore;
  graphs = FORM_GRAPHS;

  constructor() {
    super(...arguments);
    this.loadForm.perform();
    this.sourceNode = new NamedNode(this.args.publicService.uri);

    if (!this.args.readOnly) {
      this.router.on('routeWillChange', this, this.showUnsavedChangesModal);
    }
  }

  get isInitialized() {
    return this.loadForm.last.isSuccessful;
  }

  get canSubmit() {
    return this.isInitialized && this.publicServiceAction.isIdle;
  }

  get canSave() {
    return (
      this.isInitialized &&
      this.hasUnsavedChanges &&
      this.publicServiceAction.isIdle
    );
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

    if (!this.args.readOnly) {
      formStore.registerObserver(this.updateFormDirtyState, this.id);
    }

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
    const { publicService } = this.args;
    try {
      if (this.hasUnsavedChanges) {
        yield this.saveSemanticForm.unlinked().perform();
      }

      const response = yield submitFormData(publicService.id);

      if (response.ok) {
        yield this.setServiceStatus(publicService, SERVICE_STATUS.SENT);
        this.resetReviewStatus();
        this.updateLastModifiedDate();
        yield publicService.save();

        this.router.transitionTo('public-services');
      } else {
        const jsonResponse = yield response.json();
        const errors = jsonResponse?.data?.errors;

        if (response.status == 500 || !errors) {
          throw 'Unexpected error while validating data in backend';
        } else {
          for (const error of errors) {
            //TODO: should probably handle this more in a more user friendly way
            //ie: redirect to said form and scroll down to the first invalid field
            const formId = error.form.id;
            this.toaster.error(
              `Er zijn fouten opgetreden in de tab "${FORM_MAPPING[formId]}". Gelieve deze te verbeteren!`,
              'Fout'
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
      this.toaster.error(
        `Onverwachte fout bij het verwerken van het product, gelieve de helpdesk te contacteren.
         Foutboodschap: ${error.message || error}`,
        'Fout'
      );
    }
  }

  @task({ group: 'publicServiceAction' })
  *handleFormSubmit(event) {
    event?.preventDefault?.();

    try {
      yield this.saveSemanticForm.unlinked().perform();
    } catch (error) {
      console.error(error);
      this.toaster.error(
        `Onverwachte fout bij het bewaren van het formulier, gelieve de helpdesk te contacteren.
         Foutboodschap: ${error.message || error}`,
        'Fout'
      );
    }
  }

  @dropTask
  *saveSemanticForm() {
    let { publicService, formId } = this.args;
    let serializedData = this.formStore.serializeDataWithAddAndDelGraph(
      this.graphs.sourceGraph,
      'application/n-triples'
    );

    yield saveFormData(publicService.id, formId, serializedData);

    this.hasUnsavedChanges = false;
    this.updateLastModifiedDate();
    yield publicService.save();

    yield loadPublicServiceDetails(this.store, publicService.id);
  }

  @action
  requestSubmitConfirmation() {
    let isValidForm = validateForm(this.form, {
      ...this.graphs,
      sourceNode: this.sourceNode,
      store: this.formStore,
    });
    this.forceShowErrors = !isValidForm;

    if (isValidForm) {
      this.modals.open(ConfirmSubmitModal, {
        submitHandler: async () => {
          await this.publishPublicService.perform();
        },
      });
    } else {
      this.toaster.error('Formulier is ongeldig', 'Fout');
    }
  }

  @action
  requestReopeningConfirmation() {
    this.modals.open(ConfirmReopeningModal, {
      reopeningHandler: async () => {
        let { publicService } = this.args;
        await this.setServiceStatus(publicService, SERVICE_STATUS.CONCEPT);
        this.updateLastModifiedDate();
        await publicService.save();

        this.router.refresh('public-services.details');
      },
    });
  }

  @action
  removePublicService() {
    this.modals.open(ConfirmDeletionModal, {
      deleteHandler: async () => {
        try {
          this.args.publicService.deleteRecord();
          await this.args.publicService.save();
          this.hasUnsavedChanges = false;
          this.router.replaceWith('public-services');
          this.args.publicService.unloadRecord();
        } catch (error) {
          console.error(error);
          this.toaster.error(
            `Onverwachte fout bij het verwijderen van het product, gelieve de helpdesk te contacteren.
             Foutboodschap: ${error.message || error}`,
            'Fout'
          );
        }
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

  async setServiceStatus(service, status) {
    const statusRecord = (
      await this.store.query('concept', {
        filter: {
          ':uri:': status,
        },
      })
    ).firstObject;
    service.status = statusRecord;
  }

  updateLastModifiedDate() {
    this.args.publicService.modified = new Date();
  }

  resetReviewStatus() {
    this.args.publicService.reviewStatus = null;
  }

  willDestroy() {
    super.willDestroy(...arguments);

    if (!this.args.readOnly) {
      this.formStore?.deregisterObserver(this.id);
      this.router.off('routeWillChange', this, this.showUnsavedChangesModal);
    }
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

async function submitFormData(serviceId) {
  const response = await fetch(`/lpdc-management/${serviceId}/submit`, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
  return response;
}
