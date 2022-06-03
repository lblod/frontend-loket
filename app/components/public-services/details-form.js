import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import rdflib from 'browser-rdflib';
import { dropTask, task, timeout } from 'ember-concurrency';

const FORM_GRAPHS = {
  formGraph: new rdflib.NamedNode('http://data.lblod.info/form'),
  metaGraph: new rdflib.NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`),
};

const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');
const RDF = new rdflib.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

// TODO: this isn't correct
const SOURCE_NODE = new rdflib.NamedNode(
  'http://ember-submission-form-fields/source-node'
);

export default class PublicServicesDetailsFormComponent extends Component {
  @service router;

  id = guidFor(this);
  form;
  formStore;
  graphs = FORM_GRAPHS;
  sourceNode = SOURCE_NODE;
  hasUnsavedChanges = false;

  constructor() {
    super(...arguments);

    this.loadForm.perform();

    // TODO: Set up a routeWillChange event handler so we can show a confirmation modal before leaving the tab
    // Even better would be to create a generic component which does this for us and which we can also use on other pages in the app.
    // Design: https://www.figma.com/file/FEAkPmpEoalGutq5QvsQ2c/LPDC?node-id=1706%3A8837
  }

  @task
  *loadForm() {
    yield timeout(1000);
    const formData = yield fetchFormData('53de1e9d-52c8-4edf-ae97-58474f7184eb', 'cd0b5eba-33c1-45d9-aed9-75194c3728d3');

    // TODO: retrieve the form data from the custom microservice
    // let [formTtl, metaTtl] = yield Promise.all([
    //   fetchForm(this.args.formId),
    //   fetchFormMeta(this.args.formId),
    // ]);

    let formStore = new ForkingStore();
    formStore.parse(formData.form, FORM_GRAPHS.formGraph, 'text/turtle');
    formStore.parse(formData.meta, FORM_GRAPHS.metaGraph, 'text/turtle');
    formStore.parse(formData.source, FORM_GRAPHS.sourceGraph, 'text/turtle');

    let form = formStore.any(
      undefined,
      RDF('type'),
      FORM('Form'),
      FORM_GRAPHS.formGraph
    );

    formStore.registerObserver(this.updateFormDirtyState, 'cd0b5eba-33c1-45d9-aed9-75194c3728d3');

    this.form = form;
    this.formStore = formStore;
    this.graphs = FORM_GRAPHS;
    this.sourceNode = new rdflib.NamedNode('http://data.lblod.info/id/public-services/53de1e9d-52c8-4edf-ae97-58474f7184eb');
  }

  @action
  updateFormDirtyState(/* delta */) {
    // TODO: we can probably make this logic smarter so that reverting to the original saved state doesn't trigger a false positive
    this.hasUnsavedChanges = true;
  }

  @dropTask
  *saveSemanticForm(event) {
    event.preventDefault();

    // TODO: Do we need to disable deletion until while the save is running, similar to the subsidy module?

    // TODO: persist the form state to the backend
    const serializedData = this.formStore.serializeDataWithAddAndDelGraph(
        this.graphs.sourceGraph,
        'application/n-triples'
    );
    yield saveFormData('53de1e9d-52c8-4edf-ae97-58474f7184eb', 'cd0b5eba-33c1-45d9-aed9-75194c3728d3', serializedData);

    yield this.args.publicService.reload();

    yield timeout(1000);
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.formStore.deregisterObserver(this.id);
  }
}

async function saveFormData(serviceId, formId, data){
  let response = await fetch(`/lpdc-management/${serviceId}/form/${formId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  });
}

async function fetchFormData(serviceId, formId) {
  let response = await fetch(`/lpdc-management/${serviceId}/form/${formId}`);
  return await response.json();
}

async function fetchForm(formName) {
  let response = await fetch(getFormDataPath(formName, 'form.ttl'));
  let ttl = await response.text();

  return ttl;
}

async function fetchFormMeta(formName) {
  let response = await fetch(getFormDataPath(formName, 'meta.ttl'));
  let ttl = await response.text();

  return ttl;
}

function getFormDataPath(formName, fileName) {
  return `/forms/${formName}/${fileName}`;
}
