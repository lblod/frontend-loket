import Route from '@ember/routing/route';
import { warn } from '@ember/debug';
import rdflib from 'browser-rdflib';
import fetch from 'fetch';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { SENT_STATUS } from '../../../models/submission-document-status';

const RDF = new rdflib.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');
const FORM_GRAPH = new rdflib.NamedNode('http://data.lblod.info/form');
const META_GRAPH = new rdflib.NamedNode('http://data.lblod.info/metagraph');

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

    await this.retrieveFormData('/subsidy-applications-active-form-data', formStore, FORM_GRAPH);
    const graphs = { FORM_GRAPH };
    /* --- To add when meta data will be implemented in the service ---
      await this.retrieveMetaData('/subsidy-applications-active-form-data/meta', formStore, META_GRAPH);
      const graphs = { FORM_GRAPH, META_GRAPH };
    */
    const formNode = formStore.any(undefined, RDF('type'), FORM('Form'), FORM_GRAPH);
    const sourceNode =  new rdflib.NamedNode('http://frontend-loket/temp-source-node')

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

  // --- Helpers ---

  async retrieveFormData(url, store, formGraph) {
    let response = await fetch(url, {
      method: 'GET',
      headers: {'Accept': 'text/turtle'},
    });
    const ttl = await response.text();
    store.parse(ttl, formGraph, 'text/turtle');
  }

  async retrieveMetaData(url, store, metaGraph) {
    let response = await fetch(url, {
      method: 'GET',
      headers: {'Accept': 'application/n-triples'},
    });
    const ttl = await response.text();
    store.parse(ttl, metaGraph, 'text/turtle');
  }
}
