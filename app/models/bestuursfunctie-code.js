import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default class BestuursfunctieCodeModel extends Model {
  @attr() uri;
  @attr() label;
  @equal(
    'uri',
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/855489b9-b584-4f34-90b2-39aea808cd9f'
  )
  isLeidinggevendAmbtenaar;

  rdfaBindings = {
    // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: 'http://www.w3.org/2004/02/skos/core#Concept',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel',
    scopeNote: 'http://www.w3.org/2004/02/skos/core#scopeNote',
  };
}
