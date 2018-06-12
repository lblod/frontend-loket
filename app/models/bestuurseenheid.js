import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  naam: attr(),
  werkingsgebied: belongsTo('werkingsgebied', { inverse: 'bestuurseenheid' }),
  classificatie: belongsTo('bestuurseenheid-classificatie-code', { inverse: null }),
  primaireSite: belongsTo('vestiging', { inverse: null }),
  politiezone: belongsTo('organisatie', { inverse: null }),
  contactinfo: hasMany('contact-punt', { inverse: null }),
  posities: hasMany('positie', { inverse: null }),
  bestuursorganen: hasMany('bestuursorgaan', { inverse: 'bestuurseenheid' }),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    naam: "http://www.w3.org/2004/02/skos/core#prefLabel",
    class: "http://data.vlaanderen.be/ns/besluit#Bestuurseenheid",
    werkingsgebied: "http://data.vlaanderen.be/ns/besluit#werkingsgebied",
    bestuursorgaan: "http://data.vlaanderen.be/ns/besluit#bestuurt",
    classificatie: "http://data.vlaanderen.be/ns/besluit#classificatie"
  }
});
