import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { collect } from '@ember/object/computed';

export default class Bestuurseenheid extends Model {
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep = collect.apply(this, ['id', 'naam', 'wilMailOntvangen', 'mailAdres']);

  @attr uri;
  @attr naam;
  @attr alternatieveNaam;
  @attr('string') mailAdres;
  @attr('boolean') wilMailOntvangen;
  @attr('boolean') isTrialUser;

  @belongsTo('werkingsgebied', {inverse: 'bestuurseenheid'}) werkingsgebied;
  @belongsTo('bestuurseenheid-classificatie-code', {inverse: null}) classificatie;
  @hasMany('contact-punt', {inverse: null}) contactinfo;
  @hasMany('bestuursorgaan', {inverse: 'bestuurseenheid'}) bestuursorganen;

  rdfaBindings = { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    naam: "http://www.w3.org/2004/02/skos/core#prefLabel",
    class: "http://data.vlaanderen.be/ns/besluit#Bestuurseenheid",
    werkingsgebied: "http://data.vlaanderen.be/ns/besluit#werkingsgebied",
    bestuursorgaan: "http://data.vlaanderen.be/ns/besluit#bestuurt",
    classificatie: "http://data.vlaanderen.be/ns/besluit#classificatie"
  }
}
