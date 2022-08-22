import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  ForkingStore,
  validateForm,
} from '@lblod/ember-submission-form-fields';
import rdflib from 'rdflib';
import { dropTask, task, dropTaskGroup } from 'ember-concurrency';
import ConfirmDeletionModal from 'frontend-loket/components/public-services/confirm-deletion-modal';
import SubmitErrorModal from 'frontend-loket/components/public-services/submit-error-modal';
import UnsavedChangesModal from 'frontend-loket/components/public-services/details/unsaved-changes-modal';
import { loadPublicServiceDetails } from 'frontend-loket/utils/public-services';
import { FORM_MAPPING, LIFECYCLE_STATUS } from 'frontend-loket/utils/constants';

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

      const response = yield publish(this.args.publicService.id);

      if (!response) {
        this.modals.open(SubmitErrorModal, {
          submitErrorMessage:
            'Onverwachte fout bij het verwerken van het product, gelieve de helpdesk te contacteren.',
        });
        this.sending();
        return;
      }

      const errors = response.data.errors;

      if (errors.length == 0) {
        const activeStatus = (yield this.store.query('concept', {
          filter: { ':uri:': LIFECYCLE_STATUS.ACTIVE },
        })).firstObject;
        const publicService = yield this.args.publicService;
        publicService.status = activeStatus;
        yield publicService.save();
        this.router.transitionTo('public-services');
      } else if (errors.length == 1) {
        //TODO: should probably handle this more in a more user friendly way
        //ie: redirect to said form and scroll down to the first invalid field
        const formId = errors[0].form.id;
        this.modals.open(SubmitErrorModal, {
          submitErrorMessage: `Er zijn fouten opgetreden in de tab "${FORM_MAPPING[formId]}". Gelieve deze te verbeteren!`,
        });
      } else if (errors.length > 1) {
        this.modals.open(SubmitErrorModal, {
          submitErrorMessage: 'Meerdere formulieren zijn onjuist ingevuld',
        });
      }
    }
    this.sending();
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
        this.hasUnsavedChanges = false;
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

async function publish(serviceId) {
  const response = await fetch(`/lpdc-management/${serviceId}/submit`, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
  if (response.status == 500) {
    console.warn(
      `Unexpected error during validation  of service "${serviceId}".`
    );
    return null;
  } else {
    const jsonResponse = await response.json();
    return jsonResponse;
  }
}
