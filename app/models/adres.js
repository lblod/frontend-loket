import attr from 'ember-data/attr';
import Model from 'ember-data/model';

export default Model.extend({
  busnummer: attr(),
  huisnummer: attr(),
  straatnaam: attr(),
  postcode: attr(),
  gemeentenaam: attr(),
  land: attr(),
  volledigAdres : attr(),
  adresRegisterId: attr(),
  adresRegisterUri: attr()
});
