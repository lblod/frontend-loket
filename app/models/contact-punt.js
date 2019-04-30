import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'land', 'gemeente', 'adres', 'postcode', 'email', 'telephone', 'fax', 'website']),

  uri: attr(),
  land: attr(),
  gemeente: attr(),
  adres: attr(),
  postcode: attr(),
  email: attr(),
  telephone: attr(),
  fax: attr(),
  website: attr()
});
