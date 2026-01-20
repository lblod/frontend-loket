import { RDF, SKOS } from '@lblod/submission-form-helpers';
import { Literal, NamedNode, parse, Store } from 'rdflib';
import { EXT } from 'frontend-loket/rdf/namespaces';
import { prefLabel } from 'frontend-loket/rdf/predicates';

export function extractDocumentsFromTtl(ttl) {
  const store = new Store();
  const graph = new NamedNode('http://temporary-graph');
  parse(ttl, store, graph.uri);

  const documents = store.match(
    null,
    RDF('type'),
    EXT('SubmissionDocument'),
    graph,
  );

  return documents.map((document) => {
    const subject = document.subject;
    const name = store.any(subject, prefLabel, undefined, graph);
    const sentDate = store.any(
      subject,
      new NamedNode(
        'http://www.semanticdesktop.org/ontologies/2007/03/22/nmo#sentDate',
      ),
      undefined,
      graph,
    );
    const org = store.any(
      subject,
      new NamedNode('http://purl.org/pav/createdBy'),
      undefined,
      graph,
    );
    const orgName = store.any(org, SKOS('prefLabel'), undefined, graph);
    const link = store.any(
      subject,
      new NamedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
      undefined,
      graph,
    )?.uri;

    return {
      node: subject,
      name: name.value,
      link,
      sentDate: Literal.toJS(sentDate),
      sentBy: {
        node: org,
        name: orgName,
      },
    };
  });
}

export function getSelectedDecisionType({ formStore, sourceNode, graphs }) {
  // A form can have multiple decision types, but just one is in the scheme that interests us
  const decisionTypes = formStore
    .match(sourceNode, RDF('type'), undefined, graphs.sourceGraph)
    .map((triples) => triples.object);

  const toezichtDossierTypeConceptScheme = new NamedNode(
    'http://lblod.data.gift/concept-schemes/71e6455e-1204-46a6-abf4-87319f58eaa5',
  );

  return decisionTypes.find((decisionType) => {
    return formStore.any(
      decisionType,
      SKOS('inScheme'),
      toezichtDossierTypeConceptScheme,
      undefined,
    );
  });
}
