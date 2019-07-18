import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { equal } from '@ember/object/computed';

export default Model.extend({
  uri: attr(),
  label: attr(),
  isLeidinggevendAmbtenaar: equal('uri', 'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/855489b9-b584-4f34-90b2-39aea808cd9f'),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://www.w3.org/2004/02/skos/core#Concept",
    label: "http://www.w3.org/2004/02/skos/core#prefLabel",
    scopeNote: "http://www.w3.org/2004/02/skos/core#scopeNote"
  }
});
