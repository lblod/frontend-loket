import Model, { attr } from '@ember-data/model';

export default class AdresModel extends Model {
  @attr() busnummer;
  @attr() huisnummer;
  @attr() straatnaam;
  @attr() postcode;
  @attr() gemeentenaam;
  @attr() land;
  @attr() volledigAdres;
  @attr() adresRegisterId;
  @attr() adresRegisterUri;
}
