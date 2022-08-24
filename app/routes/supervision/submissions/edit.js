import Route from '@ember/routing/route';
import { warn } from '@ember/debug';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { FORM, RDF } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';
import { SENT_STATUS } from '../../../models/submission-document-status';

export default class SupervisionSubmissionsEditRoute extends Route {
  @service router;
  @service store;

  async model(params) {
    // Fetch data from backend

    const submission = await this.store.findRecord('submission', params.id);
    const submissionDocument = await submission.submissionDocument;
    const submissionStatus = await submission.status;

    if (!submissionDocument) {
      warn('No submission document, Transitioning to index.', {
        id: 'no-submission-document',
      });
      this.router.transitionTo('supervision.submissions');
    }

    const response = await fetch(`/submission-forms/${submissionDocument.id}`);
    const { source, additions, removals, meta, form } = await response.json();

    // Prepare data in forking store

    const formStore = new ForkingStore();

    const metaGraph = new NamedNode('http://data.lblod.info/metagraph');
    formStore.parse(meta, metaGraph, 'text/turtle');
    const formGraph = new NamedNode('http://data.lblod.info/form');
    formStore.parse(form, formGraph, 'text/turtle');

    const sourceGraph = new NamedNode(
      `http://data.lblod.info/submission-document/data/${submissionDocument.id}`
    );
    if (removals || additions) {
      formStore.loadDataWithAddAndDelGraph(
        source,
        sourceGraph,
        additions,
        removals,
        'text/turtle'
      );
    } else {
      formStore.parse(source, sourceGraph, 'text/turtle');
    }

    const graphs = { formGraph, sourceGraph, metaGraph };
    const formNode = formStore.any(
      undefined,
      RDF('type'),
      FORM('Form'),
      formGraph
    );

    return {
      form: formNode,
      formStore,
      graphs,
      sourceNode: new NamedNode(submissionDocument.uri),
      submission,
      submissionDocument,
      submitted: submissionStatus.uri === SENT_STATUS,
    };
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.isValidForm = true;
    controller.forceShowErrors = false;
  }
}
