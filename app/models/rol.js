import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';
import attr from 'ember-data/attr';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'label']),
  uri: attr(),
  label: attr(),
  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    label: "http://www.w3.org/2004/02/skos/core#prefLabel"
  }
});
