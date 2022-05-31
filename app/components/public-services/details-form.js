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

    // TODO: retrieve the form data from the custom microservice
    let [formTtl, metaTtl] = yield Promise.all([
      fetchForm(this.args.formId),
      fetchFormMeta(this.args.formId),
    ]);

    let formStore = new ForkingStore();
    formStore.parse(formTtl, FORM_GRAPHS.formGraph, 'text/turtle');
    formStore.parse(metaTtl, FORM_GRAPHS.metaGraph, 'text/turtle');

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

  @dropTask
  *saveSemanticForm(event) {
    event.preventDefault();

    // TODO: Do we need to disable deletion until while the save is running, similar to the subsidy module?

    // TODO: persist the form state to the backend
    console.log(
      this.formStore.serializeDataWithAddAndDelGraph(
        this.graphs.sourceGraph,
        'application/n-triples'
      )
    );

    yield this.args.publicService.reload();

    yield timeout(1000);
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.formStore.deregisterObserver(this.id);
  }
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
