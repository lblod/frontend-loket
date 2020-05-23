import Route from '@ember/routing/route';
import { warn } from '@ember/debug';
import rdflib from 'browser-rdflib';
import fetch from 'fetch';
import {ForkingStore} from '@lblod/ember-submission-form-fields';
import { SENT_STATUS } from '../../../models/submission-document-status';

const RDF = new rdflib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const FORM = new rdflib.Namespace("http://lblod.data.gift/vocabularies/forms/");

export default class SupervisionSubmissionsEditRoute extends Route {
  async model(params) {
    // Fetch data from backend

    const submission = await this.store.find('submission', params.id);
    const submissionDocument = await submission.submissionDocument;
    const submissionStatus = await submission.status;

    if (!submissionDocument) {
      warn('No submission document, Transitioning to index.');
      this.transitionTo('supervision.submissions');
    }

    const response = await fetch(`/submission-forms/${submissionDocument.id}`);
    const { source, additions, removals, meta, form } = await response.json();

    // Prepare data in forking store

    const formStore = new ForkingStore();

    const metaGraph = new rdflib.NamedNode("http://data.lblod.info/metagraph");
    formStore.parse(meta, metaGraph, "text/turtle");
    const formGraph = new rdflib.NamedNode("http://data.lblod.info/form");
    formStore.parse(form, formGraph, "text/turtle");

    const sourceGraph = new rdflib.NamedNode(`http://data.lblod.info/submission-document/data/${submissionDocument.id}`);
    if (removals || additions){
      formStore.loadDataWithAddAndDelGraph(source, sourceGraph, additions, removals, "text/turtle");
    }
    else {
      formStore.parse(source, sourceGraph, "text/turtle");
    }

    const graphs = { formGraph, sourceGraph, metaGraph };
    const formNode = formStore.any(undefined, RDF("type"), FORM("Form"), formGraph);

    return { form: formNode,
      formStore,
      graphs,
      sourceNode: new rdflib.NamedNode(submissionDocument.uri),
      submission,
      submissionDocument,
      submitted: submissionStatus.uri === SENT_STATUS
    };
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.isValidForm = true;
    controller.forceShowErrors = false;
  }
}
