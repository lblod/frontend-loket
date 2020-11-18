import Route from '@ember/routing/route';
import { warn } from '@ember/debug';
import rdflib from 'browser-rdflib';
import fetch from 'fetch';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { SENT_STATUS } from '../../../models/submission-document-status';

const RDF = new rdflib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const FORM = new rdflib.Namespace("http://lblod.data.gift/vocabularies/forms/");

export default class SubsidyApplicationsEditRoute extends Route {
  async model(params) {
    // Fetch data from backend
    const applicationForm = await this.store.find('application-form', params.id);
    const applicationFormStatus = await applicationForm.status;

    if (!applicationForm) {
      warn('No application form, Transitioning to index.', {id: 'no-application-form'});
      this.transitionTo('subsidy.applications');
    }

    const response = await fetch('/subsidy-applications-active-form-data', {
      method: 'GET',
      headers: {'Accept': 'text/turtle'},
    });
    const form = await response.text();

    // Prepare data in forking store
    const formStore = new ForkingStore();

    const formGraph = new rdflib.NamedNode("http://data.lblod.info/form");
    formStore.parse(form, formGraph, "text/turtle");

    const graphs = { formGraph };
    const formNode = formStore.any(undefined, RDF("type"), FORM("Form"), formGraph);
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
}
