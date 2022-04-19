import Model, { attr, belongsTo } from '@ember-data/model';
import { collect } from '@ember/object/computed';

export default class ContactPuntModel extends Model {
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  @collect.apply(this, [
    'id',
    'land',
    'gemeente',
    'adres',
    'postcode',
    'email',
    'telephone',
    'fax',
    'website',
  ])
  stringRep;
  @attr uri;
  @attr aanschrijfprefix;
  @attr email;
  @attr fax;
  @attr naam;
  @attr voornaam;
  @attr achternaam;
  @attr website;
  @attr telefoon;
  @belongsTo('adres', { inverse: null }) adres;
}
