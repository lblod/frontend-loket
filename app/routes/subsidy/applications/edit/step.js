import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import rdflib from 'browser-rdflib';
import fetch from 'fetch';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { RDF } from '@lblod/submission-form-helpers';

import { CONCEPT_STATUS } from '../../../../models/submission-document-status';

const FORM = new rdflib.Namespace('http://lblod.data.gift/vocabularies/forms/');
const FORM_GRAPH = new rdflib.NamedNode('http://data.lblod.info/form');
const META_GRAPH = new rdflib.NamedNode('http://data.lblod.info/metagraph');
const SOURCE_GRAPH = new rdflib.NamedNode(`http://data.lblod.info/sourcegraph`);

export default class SubsidyApplicationsEditStepRoute extends Route {

  @service store;
  @service currentSession;

  async beforeModel() {
    const conceptStatuses = await this.store.query('submission-document-status', {
      page: {size: 1},
      'filter[:uri:]': CONCEPT_STATUS,
    });

    if (conceptStatuses.length)
      this.conceptStatus = conceptStatuses.firstObject;
  }

  async model({step_id: stepId}) {
    let {consumption, organization} = this.modelFor('subsidy.applications.edit');
    let step = await this.store.findRecord('subsidy-application-flow-step', stepId);

    // TODO find/filter out existing application-forms
    // let forms = await this.store.findAll('subsidy-application-form', {
    //   filter: {
    //     'subsidy-application-flow-step': {
    //       ':id:': stepId,
    //     },
    //   },
    // });

    // TODO: Set up the application form similar to how it was done in the edit route before
    // https://github.com/lblod/frontend-loket/blob/700febcd5267f2086fb238f9d2c79b704f3be992/app/routes/subsidy/applications/edit.js#L15

    let currentUser = await this.currentSession.userContent;

    // TODO add check for lost form-spec
    const spec = await step.get('formSpecification');

    let subsidyApplicationForm = this.store.createRecord('subsidy-application-form', {
      creator: currentUser,
      lastModifier: currentUser,
      status: this.conceptStatus,
    });

    subsidyApplicationForm.sources.pushObject(spec);
    consumption.subsidyApplicationForms.pushObject(subsidyApplicationForm);

    subsidyApplicationForm = await subsidyApplicationForm.save();
    consumption = await consumption.save();

    // NOTE: Prepare data in forking store
    const formStore = new ForkingStore();

    const graphs = {
      formGraph: FORM_GRAPH,
      metaGraph: META_GRAPH,
      sourceGraph: SOURCE_GRAPH,
    };

    await this.retrieveForm(`/management-application-forms/${subsidyApplicationForm.id}`, formStore, graphs);

    const formNode = formStore.any(undefined, RDF('type'), FORM('Form'), FORM_GRAPH);
    const sourceNode = new rdflib.NamedNode(subsidyApplicationForm.uri);

    return {
      // consumption,
      step,
      form: formNode,
      formStore,
      graphs,
      sourceNode,
    };
  }

  resetController(controller) {
    controller.reset();
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
