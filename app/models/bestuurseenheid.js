import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'naam', 'wilMailOntvangen', 'mailAdres']),

  uri: attr(),
  naam: attr(),
  mailAdres: attr('string'),
  wilMailOntvangen: attr('boolean'),

  werkingsgebied: belongsTo('werkingsgebied', { inverse: 'bestuurseenheid' }),
  classificatie: belongsTo('bestuurseenheid-classificatie-code', { inverse: null }),
  contactinfo: hasMany('contact-punt', { inverse: null }),
  bestuursorganen: hasMany('bestuursorgaan', { inverse: 'bestuurseenheid' }),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    naam: "http://www.w3.org/2004/02/skos/core#prefLabel",
    class: "http://data.vlaanderen.be/ns/besluit#Bestuurseenheid",
    werkingsgebied: "http://data.vlaanderen.be/ns/besluit#werkingsgebied",
    bestuursorgaan: "http://data.vlaanderen.be/ns/besluit#bestuurt",
    classificatie: "http://data.vlaanderen.be/ns/besluit#classificatie"
  }
});
