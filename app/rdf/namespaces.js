import { Namespace } from 'rdflib';

export { FORM, RDF, XSD } from '@lblod/submission-form-helpers';

export const DBPEDIA = new Namespace('http://dbpedia.org/ontology/');
export const LBLOD_SUBSIDIE = new Namespace(
  'http://lblod.data.gift/vocabularies/subsidie/',
);
export const MU = new Namespace('http://mu.semte.ch/vocabularies/core/');
export const EXT = new Namespace('http://mu.semte.ch/vocabularies/ext/');
export const QB = new Namespace('http://purl.org/linked-data/cube#');
export const ELI = new Namespace('http://data.europa.eu/eli/ontology#');
export const BESLUIT = new Namespace('http://data.vlaanderen.be/ns/besluit#');
