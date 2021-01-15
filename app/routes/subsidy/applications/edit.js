import Route from '@ember/routing/route';
import { warn } from '@ember/debug';
import rdflib from 'browser-rdflib';
import fetch from 'fetch';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { SENT_STATUS } from '../../../models/submission-document-status';
import { RDF } from '@lblod/submission-form-helpers';

const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');
const FORM_GRAPH = new rdflib.NamedNode('http://data.lblod.info/form');
const META_GRAPH = new rdflib.NamedNode('http://data.lblod.info/metagraph');
const SOURCE_GRAPH = new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`);

export default class SubsidyApplicationsEditRoute extends Route {
  async model(params) {
    // Fetch data from backend
    const applicationForm = await this.store.find('application-form', params.id);
    const applicationFormStatus = await applicationForm.status;

    if (!applicationForm) {
      warn('No application form, Transitioning to index.', {id: 'no-application-form'});
      this.transitionTo('subsidy.applications');
    }

    // Prepare data in forking store
    const formStore = new ForkingStore();

    const graphs = {
      formGraph : FORM_GRAPH,
      metaGraph: META_GRAPH,
      sourceGraph: SOURCE_GRAPH
    };

    await this.retrieveForm(`/management-application-forms/${applicationForm.id}`, formStore, graphs);

    const formNode = formStore.any(undefined, RDF('type'), FORM('Form'), FORM_GRAPH);
    const sourceNode =  new rdflib.NamedNode(applicationForm.uri);

    return {
      form: formNode,
      formStore,
      graphs,
      sourceNode,
      applicationForm,
      submitted: applicationFormStatus.uri === SENT_STATUS
    };
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.isValidForm = true;
    controller.forceShowErrors = false;
  }

  resetController(controller, isExiting, transition) {
    if (isExiting) {
      /**
       * NOTE: when exciting a controller, we want the error object to be reset.
       *       prevent it from "leaking" to other form edit-routes.
       */
      controller.set('error', null);
    }
  }

  // --- Helpers ---

  async retrieveForm(url, store, graphs) {
    let response = await fetch(url, {
      method: 'GET',
      headers: {'Accept': 'application/vnd.api+json'},
    });
    const content = await response.json();
    store.parse(content.form, graphs.formGraph, 'text/turtle');
    store.parse(content.meta, graphs.metaGraph, 'text/turtle');
    store.parse(content.source, graphs.sourceGraph, 'text/turtle');
  }
}
