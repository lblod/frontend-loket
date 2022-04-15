import Route from '@ember/routing/route';
import rdflib from 'browser-rdflib';
import fetch from 'fetch';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { RDF } from '@lblod/submission-form-helpers';

const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');
const FORM_GRAPH = new rdflib.NamedNode('http://data.lblod.info/form');
const META_GRAPH = new rdflib.NamedNode('http://data.lblod.info/metagraph');
const SOURCE_GRAPH = new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`);

export default class SubsidyApplicationsEditStepEditRoute extends Route {
  async model({ form_id: semanticFormID }) {
    let { consumption } = this.modelFor('subsidy.applications.edit');
    let { step } = this.modelFor('subsidy.applications.edit.step');
    let semanticForm = await this.store.findRecord(
      'subsidy-application-form',
      semanticFormID
    );
    await semanticForm.belongsTo('status').reload();

    // TODO: Set up the application form similar to how it was done in the edit route before
    // https://github.com/lblod/frontend-loket/blob/700febcd5267f2086fb238f9d2c79b704f3be992/app/routes/subsidy/applications/edit.js#L15

    // NOTE: Prepare data in forking store
    const formStore = new ForkingStore();

    const graphs = {
      formGraph: FORM_GRAPH,
      metaGraph: META_GRAPH,
      sourceGraph: SOURCE_GRAPH,
    };

    await this.retrieveForm(
      `/management-application-forms/${semanticForm.id}`,
      formStore,
      graphs
    );

    const formNode = formStore.any(
      undefined,
      RDF('type'),
      FORM('Form'),
      FORM_GRAPH
    );
    const sourceNode = new rdflib.NamedNode(semanticForm.uri);

    return {
      step,
      consumption,
      semanticForm,
      form: formNode,
      formStore,
      graphs,
      sourceNode,
    };
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      /**
       * NOTE: when exciting a controller, we want the error object to be reset.
       *       prevent it from "leaking" to other form edit-routes.
       */
      controller.reset();
    }
  }

  // --- Helpers ---

  async retrieveForm(url, store, graphs) {
    let response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/vnd.api+json' },
    });
    const content = await response.json();
    store.parse(content.form, graphs.formGraph, 'text/turtle');
    store.parse(content.meta, graphs.metaGraph, 'text/turtle');
    store.parse(content.source, graphs.sourceGraph, 'text/turtle');
  }
}
