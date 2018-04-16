import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';
import attr from 'ember-data/attr';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'land', 'gemeente', 'adres', 'postcode', 'email', 'telephone', 'fax', 'website']),

  land: attr(),
  gemeente: attr(),
  adres: attr(),
  postcode: attr(),
  email: attr('email'),
  telephone: attr('phone'),
  fax: attr('phone'),
  website: attr()
});
