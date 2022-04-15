import Model, { attr } from '@ember-data/model';

export default class BestuursorgaanClassificatieCodeModel extends Model {
  @attr() uri;
  @attr() label;
  @attr() scopeNote;

  rdfaBindings = {
    // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: 'http://www.w3.org/2004/02/skos/core#Concept',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel',
    scopeNote: 'http://www.w3.org/2004/02/skos/core#scopeNote',
  };
}
