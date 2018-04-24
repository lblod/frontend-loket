import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  land: attr(),
  gemeente: attr(),
  adres: attr(),
  postcode: attr(),
  email: attr('email'),
  telephone: attr('phone'),
  fax: attr('phone'),
  website: attr()
});
